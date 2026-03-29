/**
 * @generated
 * @context Viewport culling for large org charts (>200 nodes): intersect node boxes with visible rect in content space.
 * @decisions Margin in px to avoid popping; inverse pan/zoom to map viewport to content coordinates.
 * @modified 2026-03-27
 */
import type { OrgChartNodeBox } from './org-chart-view.types';

export interface ViewportRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Map screen viewport to content coordinates (before canvas transform, origin top-left of viewport host) */
export function screenToContentViewport(
  viewportWidth: number,
  viewportHeight: number,
  panX: number,
  panY: number,
  scale: number,
  margin = 80
): ViewportRect {
  const inv = 1 / scale;
  const left = (-panX) * inv - margin;
  const top = (-panY) * inv - margin;
  const right = (viewportWidth - panX) * inv + margin;
  const bottom = (viewportHeight - panY) * inv + margin;
  return { left, top, right, bottom };
}

export function boxIntersectsViewport(
  box: OrgChartNodeBox,
  originMinX: number,
  originMinY: number,
  vp: ViewportRect
): boolean {
  const x1 = box.x - originMinX;
  const y1 = box.y - originMinY;
  const x2 = x1 + box.width;
  const y2 = y1 + box.height;
  return x2 >= vp.left && x1 <= vp.right && y2 >= vp.top && y1 <= vp.bottom;
}

export function filterVisibleBoxIds(
  boxes: Map<string, OrgChartNodeBox>,
  originMinX: number,
  originMinY: number,
  vp: ViewportRect,
  allIds: string[]
): Set<string> {
  const out = new Set<string>();
  for (const id of allIds) {
    const b = boxes.get(id);
    if (b && boxIntersectsViewport(b, originMinX, originMinY, vp)) {
      out.add(id);
    }
  }
  return out;
}
