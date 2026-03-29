/**
 * @generated
 * @context PNG export without third-party libs: Canvas2D draws nodes and elbow edges from layout snapshot.
 * @decisions Skips remote avatar images (CORS); draws initials circle instead; solid + dashed strokes.
 * @modified 2026-03-27
 */
import type { OrgChartEdge, OrgChartNode, OrgChartNodeBox } from './org-chart-view.types';

export interface ExportLayoutSnapshot {
  boxes: Map<string, OrgChartNodeBox>;
  primaryEdges: OrgChartEdge[];
  dottedEdges: OrgChartEdge[];
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  nodesById: Map<string, OrgChartNode>;
}

function initialsOf(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) {
    return '?';
  }
  if (p.length === 1) {
    return p[0].slice(0, 2).toUpperCase();
  }
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function localBox(b: OrgChartNodeBox, minX: number, minY: number) {
  return { x: b.x - minX, y: b.y - minY, w: b.width, h: b.height };
}

function centerBottom(b: OrgChartNodeBox, minX: number, minY: number) {
  const L = localBox(b, minX, minY);
  return { x: L.x + L.w / 2, y: L.y + L.h };
}

function centerTop(b: OrgChartNodeBox, minX: number, minY: number) {
  const L = localBox(b, minX, minY);
  return { x: L.x + L.w / 2, y: L.y };
}

function centerRight(b: OrgChartNodeBox, minX: number, minY: number) {
  const L = localBox(b, minX, minY);
  return { x: L.x + L.w, y: L.y + L.h / 2 };
}

function centerLeft(b: OrgChartNodeBox, minX: number, minY: number) {
  const L = localBox(b, minX, minY);
  return { x: L.x, y: L.y + L.h / 2 };
}

/** Returns data URL (PNG) or null if canvas unsupported */
export function exportOrgChartPng(snapshot: ExportLayoutSnapshot, scale = 2): string | null {
  const w = Math.max(320, Math.ceil(snapshot.maxX - snapshot.minX));
  const h = Math.max(240, Math.ceil(snapshot.maxY - snapshot.minY));
  if (typeof document === 'undefined') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(w * scale);
  canvas.height = Math.floor(h * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  ctx.scale(scale, scale);
  ctx.fillStyle = '#f7f8fa';
  ctx.fillRect(0, 0, w, h);

  const { minX, minY } = snapshot;

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  for (const e of snapshot.primaryEdges) {
    const a = snapshot.boxes.get(e.fromId);
    const b = snapshot.boxes.get(e.toId);
    if (!a || !b) {
      continue;
    }
    const p1 = centerBottom(a, minX, minY);
    const p2 = centerTop(b, minX, minY);
    const mid = (p1.y + p2.y) / 2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p1.x, mid);
    ctx.lineTo(p2.x, mid);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = '#64748b';
  for (const e of snapshot.dottedEdges) {
    const a = snapshot.boxes.get(e.fromId);
    const b = snapshot.boxes.get(e.toId);
    if (!a || !b) {
      continue;
    }
    const p1 = centerRight(a, minX, minY);
    const p2 = centerLeft(b, minX, minY);
    const mid = (p1.x + p2.x) / 2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(mid, p1.y);
    ctx.lineTo(mid, p2.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  for (const [id, box] of snapshot.boxes) {
    const node = snapshot.nodesById.get(id);
    if (!node) {
      continue;
    }
    const L = localBox(box, minX, minY);
    // ASSUMPTION: PNG export draws initials instead of loading avatar URLs to avoid canvas taint from cross-origin images.
    const vacant = node.status.toLowerCase() === 'vacant';
    ctx.beginPath();
    const r = 8;
    const { x: rx, y: ry, w, h } = L;
    ctx.moveTo(rx + r, ry);
    ctx.lineTo(rx + w - r, ry);
    ctx.quadraticCurveTo(rx + w, ry, rx + w, ry + r);
    ctx.lineTo(rx + w, ry + h - r);
    ctx.quadraticCurveTo(rx + w, ry + h, rx + w - r, ry + h);
    ctx.lineTo(rx + r, ry + h);
    ctx.quadraticCurveTo(rx, ry + h, rx, ry + h - r);
    ctx.lineTo(rx, ry + r);
    ctx.quadraticCurveTo(rx, ry, rx + r, ry);
    ctx.closePath();
    ctx.fillStyle = vacant ? '#fefce8' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = vacant ? '#ca8a04' : '#cbd5e1';
    ctx.lineWidth = vacant ? 2 : 1;
    if (vacant) {
      ctx.setLineDash([4, 3]);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    const cx = L.x + 36;
    const cy = L.y + L.h / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initialsOf(node.name), cx, cy);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = '600 12px sans-serif';
    const name = node.name || '—';
    ctx.fillText(name.length > 22 ? `${name.slice(0, 20)}…` : name, L.x + 64, L.y + 28);
    ctx.font = '400 11px sans-serif';
    ctx.fillStyle = '#475569';
    const title = node.title || '';
    ctx.fillText(title.length > 28 ? `${title.slice(0, 26)}…` : title, L.x + 64, L.y + 46);
  }

  try {
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}
