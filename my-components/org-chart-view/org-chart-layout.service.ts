/**
 * @generated
 * @context Layered tree layout, primary + dotted edges, bounding box for pan/zoom/minimap.
 * @decisions Per-root subtree with xBase offset; leaf counter for leaves only; BT mirrors Y using maxDepth.
 * @references org-chart-view.types.ts, org-chart-parse.util.ts
 * @modified 2026-03-27
 */
import { Injectable } from '@angular/core';
import type { OrgChartConfig, OrgChartEdge, OrgChartNode, OrgChartNodeBox } from './org-chart-view.types';

export interface LayoutInput {
  nodes: OrgChartNode[];
  childrenByParent: Map<string | null, string[]>;
  roots: string[];
  expandedIds: Set<string>;
  config: OrgChartConfig;
}

export interface LayoutResult {
  boxes: Map<string, OrgChartNodeBox>;
  primaryEdges: OrgChartEdge[];
  dottedEdges: OrgChartEdge[];
  contentWidth: number;
  contentHeight: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const ROOT_GAP = 48;

@Injectable({ providedIn: 'root' })
export class OrgChartLayoutService {
  computeLayout(input: LayoutInput): LayoutResult {
    const { nodes, childrenByParent, roots, expandedIds, config } = input;
    const visibleIds = this.collectVisibleIds(roots, childrenByParent, expandedIds);
    const dims = this.dimensions(config);

    const maxDepth = this.maxVisibleDepth(roots, childrenByParent, visibleIds);

    const boxes2 = new Map<string, OrgChartNodeBox>();
    let xBase = 0;
    for (const rootId of roots) {
      if (!visibleIds.has(rootId)) {
        continue;
      }
      let leaf = 0;
      const lay = (id: string, depth: number): { minX: number; maxX: number } => {
        if (!visibleIds.has(id)) {
          return { minX: Infinity, maxX: -Infinity };
        }
        const childIds = (childrenByParent.get(id) ?? []).filter((c) => visibleIds.has(c));
        const yC = this.depthToY(depth, maxDepth, dims, config.direction);
        if (childIds.length === 0) {
          const cx = xBase + leaf * dims.leafSpacing + dims.nodeWidth / 2;
          leaf += 1;
          boxes2.set(id, {
            id,
            x: cx - dims.nodeWidth / 2,
            y: yC - dims.nodeHeight / 2,
            width: dims.nodeWidth,
            height: dims.nodeHeight
          });
          return { minX: cx - dims.nodeWidth / 2, maxX: cx + dims.nodeWidth / 2 };
        }
        const rs = childIds.map((c) => lay(c, depth + 1));
        const mn = Math.min(...rs.map((r) => r.minX));
        const mx = Math.max(...rs.map((r) => r.maxX));
        const cx = (mn + mx) / 2;
        boxes2.set(id, {
          id,
          x: cx - dims.nodeWidth / 2,
          y: yC - dims.nodeHeight / 2,
          width: dims.nodeWidth,
          height: dims.nodeHeight
        });
        return {
          minX: Math.min(mn, cx - dims.nodeWidth / 2),
          maxX: Math.max(mx, cx + dims.nodeWidth / 2)
        };
      };
      const span = lay(rootId, 0);
      if (Number.isFinite(span.minX)) {
        xBase = span.maxX + ROOT_GAP;
      }
    }

    const primaryEdges: OrgChartEdge[] = [];
    for (const id of visibleIds) {
      const ch = (childrenByParent.get(id) ?? []).filter((c) => visibleIds.has(c));
      for (const c of ch) {
        primaryEdges.push({ fromId: id, toId: c, kind: 'primary' });
      }
    }

    const dottedEdges: OrgChartEdge[] = [];
    for (const n of nodes) {
      if (!visibleIds.has(n.id)) {
        continue;
      }
      for (const tid of n.dottedLineIds ?? []) {
        if (visibleIds.has(tid) && tid !== n.id) {
          dottedEdges.push({ fromId: n.id, toId: tid, kind: 'dotted' });
        }
      }
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const b of boxes2.values()) {
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    }
    if (!Number.isFinite(minX)) {
      minX = minY = 0;
      maxX = maxY = 400;
    }
    const pad = 40;
    return {
      boxes: boxes2,
      primaryEdges,
      dottedEdges,
      contentWidth: maxX - minX + pad * 2,
      contentHeight: maxY - minY + pad * 2,
      minX: minX - pad,
      minY: minY - pad,
      maxX: maxX + pad,
      maxY: maxY + pad
    };
  }

  directReportCount(nodeId: string, childrenByParent: Map<string | null, string[]>): number {
    return (childrenByParent.get(nodeId) ?? []).length;
  }

  private collectVisibleIds(
    roots: string[],
    childrenByParent: Map<string | null, string[]>,
    expandedIds: Set<string>
  ): Set<string> {
    const visible = new Set<string>();
    const walk = (id: string) => {
      visible.add(id);
      if (!expandedIds.has(id)) {
        return;
      }
      for (const c of childrenByParent.get(id) ?? []) {
        walk(c);
      }
    };
    for (const r of roots) {
      walk(r);
    }
    return visible;
  }

  private maxVisibleDepth(
    roots: string[],
    childrenByParent: Map<string | null, string[]>,
    visibleIds: Set<string>
  ): number {
    let max = 0;
    const dfs = (id: string, d: number) => {
      max = Math.max(max, d);
      if (!visibleIds.has(id)) {
        return;
      }
      for (const c of childrenByParent.get(id) ?? []) {
        if (visibleIds.has(c)) {
          dfs(c, d + 1);
        }
      }
    };
    for (const r of roots) {
      dfs(r, 0);
    }
    return max;
  }

  private depthToY(
    depth: number,
    maxDepth: number,
    dims: { nodeHeight: number; levelGap: number },
    dir: OrgChartConfig['direction']
  ): number {
    const unit = dims.nodeHeight + dims.levelGap;
    if (dir === 'TB') {
      return depth * unit + dims.nodeHeight / 2;
    }
    // BT: shallow depth at bottom visually "root at bottom" — mirror Y
    return (maxDepth - depth) * unit + dims.nodeHeight / 2;
  }

  private dimensions(config: OrgChartConfig) {
    const compact = config.layoutMode === 'compact';
    return {
      nodeWidth: compact ? 188 : 210,
      nodeHeight: compact ? 96 : 118,
      levelGap: compact ? 28 : 40,
      leafSpacing: compact ? 208 : 232
    };
  }
}
