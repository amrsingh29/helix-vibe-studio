/**
 * @generated
 * @context Parse and normalize chart JSON; metadata path helper; default config merge.
 * @decisions Treat missing parentId as root; filter vacant when showVacant false; orphan nodes become roots.
 * @references org-chart-view.types.ts
 * @modified 2026-03-27
 */
import type {
  OrgChartConfig,
  OrgChartData,
  OrgChartNode
} from './org-chart-view.types';

export const DEFAULT_ORG_CHART_CONFIG: OrgChartConfig = {
  direction: 'TB',
  layoutMode: 'standard',
  theme: 'default',
  maxDepth: 4,
  defaultExpanded: true,
  draggable: false,
  showVacant: true,
  detailFields: [],
  actions: []
};

export function mergeConfig(partial?: Partial<OrgChartConfig>): OrgChartConfig {
  return {
    ...DEFAULT_ORG_CHART_CONFIG,
    ...partial,
    detailFields: partial?.detailFields ?? DEFAULT_ORG_CHART_CONFIG.detailFields,
    actions: partial?.actions ?? DEFAULT_ORG_CHART_CONFIG.actions
  };
}

/** Parse expression result: string JSON or object */
export function parseChartDataJson(raw: unknown): { data: OrgChartData | null; error: string | null } {
  if (raw === null || raw === undefined || raw === '') {
    return { data: null, error: null };
  }
  try {
    let obj: unknown = raw;
    if (typeof raw === 'string') {
      const t = raw.trim();
      if (!t) {
        return { data: null, error: null };
      }
      obj = JSON.parse(t);
    }
    if (typeof obj !== 'object' || obj === null) {
      return { data: null, error: 'parseChartDataJson: root must be an object' };
    }
    const o = obj as Record<string, unknown>;
    const nodesRaw = o.nodes;
    if (!Array.isArray(nodesRaw)) {
      return { data: null, error: 'parseChartDataJson: missing nodes array' };
    }
    const nodes = nodesRaw.map((n, i) => normalizeNode(n, i)).filter((n): n is OrgChartNode => n !== null);
    const config = mergeConfig((o.config as Partial<OrgChartConfig>) ?? {});
    return { data: { nodes, config }, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { data: null, error: msg };
  }
}

function normalizeNode(raw: unknown, index: number): OrgChartNode | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }
  const r = raw as Record<string, unknown>;
  const id = String(r.id ?? `node-${index}`);
  let parentId: string | null = null;
  if (r.parentId !== undefined && r.parentId !== null && String(r.parentId).trim() !== '') {
    parentId = String(r.parentId);
  }
  return {
    id,
    parentId,
    name: String(r.name ?? ''),
    title: String(r.title ?? ''),
    department: String(r.department ?? ''),
    avatar: String(r.avatar ?? ''),
    status: String(r.status ?? 'active'),
    badge: r.badge === undefined || r.badge === null ? null : String(r.badge),
    metadata:
      typeof r.metadata === 'object' && r.metadata !== null && !Array.isArray(r.metadata)
        ? (r.metadata as Record<string, unknown>)
        : {},
    style:
      typeof r.style === 'object' && r.style !== null && !Array.isArray(r.style)
        ? (r.style as Record<string, string | number | boolean>)
        : undefined,
    hasChildren: typeof r.hasChildren === 'boolean' ? r.hasChildren : undefined,
    dottedLineIds: Array.isArray(r.dottedLineIds)
      ? r.dottedLineIds.map((x) => String(x))
      : undefined
  };
}

export function filterVacantNodes(nodes: OrgChartNode[], showVacant: boolean): OrgChartNode[] {
  if (showVacant) {
    return nodes;
  }
  return nodes.filter((n) => n.status.toLowerCase() !== 'vacant');
}

/** Build id → node map; skip duplicate ids (later wins) */
export function buildNodeMap(nodes: OrgChartNode[]): Map<string, OrgChartNode> {
  const m = new Map<string, OrgChartNode>();
  for (const n of nodes) {
    m.set(n.id, n);
  }
  return m;
}

/**
 * Children map and roots. Orphans (parent missing) become roots.
 */
export function buildHierarchyMaps(nodes: OrgChartNode[]): {
  childrenByParent: Map<string | null, string[]>;
  parentById: Map<string, string | null>;
  roots: string[];
} {
  const ids = new Set(nodes.map((n) => n.id));
  const childrenByParent = new Map<string | null, string[]>();
  const parentById = new Map<string, string | null>();

  for (const n of nodes) {
    let p: string | null = n.parentId;
    if (p !== null && !ids.has(p)) {
      // ASSUMPTION: missing parent → treat as root (orphan promotion)
      p = null;
    }
    parentById.set(n.id, p);
    if (!childrenByParent.has(p)) {
      childrenByParent.set(p, []);
    }
    childrenByParent.get(p)!.push(n.id);
  }

  const roots = (childrenByParent.get(null) ?? []).slice();
  return { childrenByParent, parentById, roots };
}

export function getMetadataAtPath(metadata: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.').filter(Boolean);
  let cur: unknown = metadata;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export function formatMetadataValue(v: unknown): string {
  if (v === null || v === undefined) {
    return '';
  }
  if (typeof v === 'object') {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

export function ancestorsPath(nodeId: string, parentById: Map<string, string | null>): string[] {
  const path: string[] = [];
  let cur: string | null = nodeId;
  const seen = new Set<string>();
  while (cur !== null && !seen.has(cur)) {
    seen.add(cur);
    path.push(cur);
    cur = parentById.get(cur) ?? null;
  }
  return path.reverse();
}
