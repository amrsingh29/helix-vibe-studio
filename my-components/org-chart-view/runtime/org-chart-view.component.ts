/**
 * @generated
 * @context Org chart VC: JSON chartDataJson, pan/zoom, minimap, search/path, detail panel, context menu, export, viewport culling >200 nodes.
 * @decisions notifyPropertyChanged for outputs; RxLogService; drag offsets map when draggable; OnPush + markForCheck.
 * @references cookbook/02-ui-view-components.md, org-chart-layout.service.ts
 * @modified 2026-03-29
 */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AdaptButtonModule } from '@bmc-ux/adapt-angular';
import {
  RxRecordInstanceDataPageService,
  RxRecordInstanceService
} from '@helix/platform/record/api';
import {
  IDataPageParams,
  IDataPageRequestConfiguration,
  RxLogService
} from '@helix/platform/shared/api';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, Subject, Subscription, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  coerceDataPageRows,
  coerceDesignerString,
  flattenRecordDefinitionNameValue,
  getCellByFieldId
} from '../org-chart-record.util';
import { exportOrgChartPng } from '../org-chart-export.util';
import { OrgChartLayoutService } from '../org-chart-layout.service';
import {
  ancestorsPath,
  buildHierarchyMaps,
  buildNodeMap,
  filterVacantNodes,
  formatMetadataValue,
  getMetadataAtPath,
  mergeConfig,
  parseChartDataJson
} from '../org-chart-parse.util';
import type {
  IOrgChartViewProperties,
  OrgChartActionItem,
  OrgChartConfig,
  OrgChartData,
  OrgChartNode,
  OrgChartNodeBox
} from '../org-chart-view.types';
import { filterVisibleBoxIds, screenToContentViewport } from '../org-chart-viewport.util';
import { OrgChartNodeCardComponent } from './org-chart-node-card.component';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-org-chart-view',
  templateUrl: './org-chart-view.component.html',
  styleUrls: ['./org-chart-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AdaptButtonModule, TranslateModule, OrgChartNodeCardComponent]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-org-chart-view'
})
export class OrgChartViewComponent
  extends BaseViewComponent
  implements OnInit, OnDestroy, AfterViewInit, IViewComponent
{
  @Input() config!: Observable<IOrgChartViewProperties>;

  @ViewChild('viewport', { read: ElementRef }) viewportRef?: ElementRef<HTMLElement>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: IOrgChartViewProperties;

  parseError: string | null = null;
  chart: OrgChartData | null = null;

  layoutBoxes = new Map<string, OrgChartNodeBox>();
  contentW = 800;
  contentH = 600;
  originMinX = 0;
  originMinY = 0;
  originMaxX = 800;
  originMaxY = 600;

  expandedIds = new Set<string>();
  selectedId: string | null = null;
  searchQuery = '';
  private readonly search$ = new Subject<string>();
  private searchSub: Subscription | null = null;

  matchedIds = new Set<string>();
  pathIds = new Set<string>();

  panX = 0;
  panY = 0;
  scale = 1;
  private draggingPan = false;
  private panStartX = 0;
  private panStartY = 0;
  private panOriginX = 0;
  private panOriginY = 0;

  dragOffsets = new Map<string, { dx: number; dy: number }>();
  private draggingNode: string | null = null;
  private dragStart: { x: number; y: number; dx: number; dy: number } | null = null;

  contextMenu: { x: number; y: number; node: OrgChartNode } | null = null;

  renderIds: string[] = [];
  primaryEdgePaths: { d: string }[] = [];
  dottedEdgePaths: { d: string }[] = [];

  virtualize = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rxLogService: RxLogService,
    private readonly rxRecordInstanceDataPageService: RxRecordInstanceDataPageService,
    private readonly rxRecordInstanceService: RxRecordInstanceService,
    private readonly layoutService: OrgChartLayoutService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.searchSub = this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((q) => this.applySearch(q));

    this.config
      .pipe(
        distinctUntilChanged(
          (a, b) => this.chartConfigFingerprint(a) === this.chartConfigFingerprint(b)
        ),
        switchMap((c) => {
          this.state = { ...c };
          this.isHidden = Boolean(c.hidden);
          return this.resolveChartRaw$(c);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ raw, error }) => {
        this.applyChartParse(raw, error);
        this.cdr.markForCheck();
      });
  }

  /** Stable compare for config stream when record or expression inputs change */
  private chartConfigFingerprint(c: IOrgChartViewProperties): string {
    return JSON.stringify({
      h: c.hidden,
      rd: flattenRecordDefinitionNameValue(c.recordDefinitionName),
      fid: coerceDesignerString(c.chartJsonFieldId),
      rid: coerceDesignerString(c.recordInstanceId),
      q: coerceDesignerString(c.chartDataQueryExpression),
      ps: coerceDesignerString(c.chartDataPageSize),
      j: c.chartDataJson
    });
  }

  /**
   * When record definition + JSON field are set, load that cell via Data Page (first row).
   * Otherwise use chartDataJson expression value.
   */
  private resolveChartRaw$(
    c: IOrgChartViewProperties
  ): Observable<{ raw: unknown; error: string | null }> {
    const rd = flattenRecordDefinitionNameValue(c.recordDefinitionName);
    const fid = coerceDesignerString(c.chartJsonFieldId);
    const instanceId = coerceDesignerString(c.recordInstanceId);
    if (rd && fid && instanceId) {
      return this.loadChartRawFromRecordInstance(rd, fid, instanceId);
    }
    if (rd && fid) {
      return this.loadChartRawFromRecord(rd, fid, c);
    }
    return of({ raw: c.chartDataJson, error: null });
  }

  /** Same as Markdown Viewer: exact record when instance id is bound */
  private loadChartRawFromRecordInstance(
    rd: string,
    fieldId: string,
    instanceId: string
  ): Observable<{ raw: unknown; error: string | null }> {
    const fid = parseInt(fieldId, 10);
    return this.rxRecordInstanceService.get(rd, instanceId).pipe(
      map((record) => {
        const raw = Number.isFinite(fid) ? record.fieldInstances[fid]?.value : undefined;
        return { raw, error: null };
      }),
      catchError((e) => {
        this.rxLogService.error(`OrgChartView: Record GET failed: ${String(e)}`);
        return of({ raw: null, error: String(e) });
      })
    );
  }

  private loadChartRawFromRecord(
    rd: string,
    fieldId: string,
    c: IOrgChartViewProperties
  ): Observable<{ raw: unknown; error: string | null }> {
    const rawSize = coerceDesignerString(c.chartDataPageSize) || '1';
    const pageSize = parseInt(rawSize, 10);
    const params: IDataPageParams = {
      recorddefinition: rd,
      propertySelection: [fieldId],
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 1,
      startIndex: 0
    };
    const qe = coerceDesignerString(c.chartDataQueryExpression);
    if (qe) {
      params.queryExpression = qe;
    }
    const req: IDataPageRequestConfiguration = { params };
    return this.rxRecordInstanceDataPageService.post(req).pipe(
      map((res) => {
        const rows = coerceDataPageRows(res as unknown);
        if (!rows.length) {
          return { raw: null, error: null };
        }
        // ASSUMPTION: Chart JSON is taken from the first row; use Query expression + page size 1 to target one record.
        const cell = getCellByFieldId(rows[0], fieldId);
        return { raw: cell, error: null };
      }),
      catchError((e) => {
        this.rxLogService.error(`OrgChartView: Data Page failed: ${String(e)}`);
        return of({ raw: null, error: String(e) });
      })
    );
  }

  private applyChartParse(raw: unknown, externalError: string | null): void {
    const { data, error } = parseChartDataJson(raw);
    this.parseError = externalError || error;
    this.chart = data;
    if (!data) {
      this.layoutBoxes.clear();
      this.renderIds = [];
      return;
    }
    const cfg = mergeConfig(data.config);
    const nodes = filterVacantNodes(data.nodes, cfg.showVacant);
    this.virtualize = nodes.length > 200;
    const { childrenByParent, roots } = buildHierarchyMaps(nodes);
    this.expandedIds = this.buildInitialExpanded(cfg, roots, childrenByParent);
    this.recomputeLayout(nodes, childrenByParent, roots, cfg);
    this.applySearch(this.searchQuery);
  }

  ngAfterViewInit(): void {
    this.afterPanZoom();
  }

  override ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    super.ngOnDestroy();
  }

  private buildInitialExpanded(
    config: OrgChartConfig,
    roots: string[],
    childrenByParent: Map<string | null, string[]>
  ): Set<string> {
    const expanded = new Set<string>();
    if (!config.defaultExpanded) {
      return expanded;
    }
    const walk = (id: string, depth: number) => {
      const ch = childrenByParent.get(id) ?? [];
      if (depth < config.maxDepth - 1 && ch.length > 0) {
        expanded.add(id);
      }
      for (const c of ch) {
        walk(c, depth + 1);
      }
    };
    for (const r of roots) {
      walk(r, 0);
    }
    return expanded;
  }

  private recomputeLayout(
    nodes: OrgChartNode[],
    childrenByParent: Map<string | null, string[]>,
    roots: string[],
    cfg: OrgChartConfig
  ): void {
    const res = this.layoutService.computeLayout({
      nodes,
      childrenByParent,
      roots,
      expandedIds: this.expandedIds,
      config: cfg
    });
    this.layoutBoxes = res.boxes;
    this.contentW = Math.max(400, res.contentWidth);
    this.contentH = Math.max(300, res.contentHeight);
    this.originMinX = res.minX;
    this.originMinY = res.minY;
    this.originMaxX = res.maxX;
    this.originMaxY = res.maxY;
    this.buildEdgePaths(res, res.boxes);
    this.updateRenderList();
  }

  private buildEdgePaths(
    res: {
      primaryEdges: { fromId: string; toId: string }[];
      dottedEdges: { fromId: string; toId: string }[];
      minX: number;
      minY: number;
    },
    boxes: Map<string, OrgChartNodeBox>
  ): void {
    const ox = res.minX;
    const oy = res.minY;
    const toL = (b: OrgChartNodeBox) => ({
      x: b.x - ox,
      y: b.y - oy,
      w: b.width,
      h: b.height
    });
    const bottom = (b: OrgChartNodeBox) => {
      const L = toL(b);
      return { x: L.x + L.w / 2, y: L.y + L.h };
    };
    const top = (b: OrgChartNodeBox) => {
      const L = toL(b);
      return { x: L.x + L.w / 2, y: L.y };
    };
    const right = (b: OrgChartNodeBox) => {
      const L = toL(b);
      return { x: L.x + L.w, y: L.y + L.h / 2 };
    };
    const left = (b: OrgChartNodeBox) => {
      const L = toL(b);
      return { x: L.x, y: L.y + L.h / 2 };
    };

    this.primaryEdgePaths = [];
    for (const e of res.primaryEdges) {
      const a = boxes.get(e.fromId);
      const b = boxes.get(e.toId);
      if (!a || !b) {
        continue;
      }
      const p1 = bottom(a);
      const p2 = top(b);
      const mid = (p1.y + p2.y) / 2;
      const d = `M ${p1.x} ${p1.y} L ${p1.x} ${mid} L ${p2.x} ${mid} L ${p2.x} ${p2.y}`;
      this.primaryEdgePaths.push({ d });
    }

    this.dottedEdgePaths = [];
    for (const e of res.dottedEdges) {
      const a = boxes.get(e.fromId);
      const b = boxes.get(e.toId);
      if (!a || !b) {
        continue;
      }
      const p1 = right(a);
      const p2 = left(b);
      const mid = (p1.x + p2.x) / 2;
      const d = `M ${p1.x} ${p1.y} L ${mid} ${p1.y} L ${mid} ${p2.y} L ${p2.x} ${p2.y}`;
      this.dottedEdgePaths.push({ d });
    }
  }

  private updateRenderList(): void {
    const ids = [...this.layoutBoxes.keys()];
    if (!this.virtualize || !this.viewportRef) {
      this.renderIds = ids;
      this.cdr.markForCheck();
      return;
    }
    const el = this.viewportRef.nativeElement;
    const vw = el.clientWidth || 800;
    const vh = el.clientHeight || 500;
    const vp = screenToContentViewport(vw, vh, this.panX, this.panY, this.scale);
    const vis = filterVisibleBoxIds(this.layoutBoxes, this.originMinX, this.originMinY, vp, ids);
    this.renderIds = ids.filter((id) => vis.has(id));
    this.cdr.markForCheck();
  }

  @HostListener('window:mouseup')
  onWinMouseUp(): void {
    this.draggingPan = false;
    this.draggingNode = null;
    this.dragStart = null;
  }

  @HostListener('window:mousemove', ['$event'])
  onWinMouseMove(ev: MouseEvent): void {
    if (this.draggingPan) {
      this.panX = this.panOriginX + (ev.clientX - this.panStartX);
      this.panY = this.panOriginY + (ev.clientY - this.panStartY);
      this.afterPanZoom();
      this.cdr.markForCheck();
      return;
    }
    if (this.draggingNode && this.dragStart && this.state) {
      const cfg = mergeConfig(this.chart?.config);
      if (!cfg.draggable) {
        return;
      }
      const dx = ev.clientX - this.dragStart.x;
      const dy = ev.clientY - this.dragStart.y;
      this.dragOffsets.set(this.draggingNode, {
        dx: this.dragStart.dx + dx,
        dy: this.dragStart.dy + dy
      });
      this.cdr.markForCheck();
    }
  }

  onViewportMouseDown(ev: MouseEvent): void {
    if (ev.button !== 0) {
      return;
    }
    const t = ev.target as HTMLElement;
    if (t.closest('com-amar-helix-vibe-studio-org-chart-node-card')) {
      return;
    }
    this.draggingPan = true;
    this.panStartX = ev.clientX;
    this.panStartY = ev.clientY;
    this.panOriginX = this.panX;
    this.panOriginY = this.panY;
    this.contextMenu = null;
  }

  onWheel(ev: WheelEvent): void {
    ev.preventDefault();
    const delta = ev.deltaY > 0 ? -0.08 : 0.08;
    const next = Math.min(2.5, Math.max(0.35, this.scale + delta));
    this.scale = next;
    this.afterPanZoom();
    this.cdr.markForCheck();
  }

  private afterPanZoom(): void {
    this.updateRenderList();
  }

  onSearchInput(value: string): void {
    this.searchQuery = value;
    this.search$.next(value.trim());
  }

  private applySearch(q: string): void {
    this.matchedIds.clear();
    this.pathIds.clear();
    if (!this.chart || !q) {
      this.emitSearch(q);
      this.cdr.markForCheck();
      return;
    }
    const nodes = filterVacantNodes(this.chart.nodes, mergeConfig(this.chart.config).showVacant);
    const { parentById } = buildHierarchyMaps(nodes);
    const lower = q.toLowerCase();
    for (const n of nodes) {
      const hay = `${n.name} ${n.title} ${n.department}`.toLowerCase();
      if (hay.includes(lower)) {
        this.matchedIds.add(n.id);
        for (const anc of ancestorsPath(n.id, parentById)) {
          this.pathIds.add(anc);
        }
      }
    }
    this.emitSearch(q);
    this.cdr.markForCheck();
  }

  private emitSearch(query: string): void {
    const payload = {
      query,
      matchedNodeIds: [...this.matchedIds],
      pathNodeIds: [...this.pathIds]
    };
    this.notifyPropertyChanged('onSearch', payload);
  }

  selectedNode(): OrgChartNode | null {
    if (!this.selectedId || !this.chart) {
      return null;
    }
    return buildNodeMap(filterVacantNodes(this.chart.nodes, mergeConfig(this.chart.config).showVacant)).get(
      this.selectedId
    ) ?? null;
  }

  detailRows(): { label: string; value: string }[] {
    const node = this.selectedNode();
    const cfg = mergeConfig(this.chart?.config);
    if (!node) {
      return [];
    }
    return cfg.detailFields.map((f) => ({
      label: f.label ?? f.key,
      value: formatMetadataValue(getMetadataAtPath(node.metadata, f.key))
    }));
  }

  actionsList(): OrgChartActionItem[] {
    return mergeConfig(this.chart?.config).actions ?? [];
  }

  toggleExpand(nodeId: string): void {
    if (!this.chart) {
      return;
    }
    const cfg = mergeConfig(this.chart.config);
    const nodes = filterVacantNodes(this.chart.nodes, cfg.showVacant);
    const { childrenByParent, roots } = buildHierarchyMaps(nodes);
    const nodeMap = buildNodeMap(nodes);
    const n = nodeMap.get(nodeId);
    if (!n) {
      return;
    }
    const wasExpanded = this.expandedIds.has(nodeId);
    if (wasExpanded) {
      this.expandedIds.delete(nodeId);
      this.notifyPropertyChanged('onCollapse', { nodeId });
    } else {
      this.expandedIds.add(nodeId);
      this.notifyPropertyChanged('onExpand', { nodeId });
    }
    this.recomputeLayout(nodes, childrenByParent, roots, cfg);
    this.cdr.markForCheck();
  }

  selectNode(nodeId: string): void {
    this.selectedId = nodeId;
    if (!this.chart) {
      return;
    }
    const nodes = filterVacantNodes(this.chart.nodes, mergeConfig(this.chart.config).showVacant);
    const n = buildNodeMap(nodes).get(nodeId);
    if (n) {
      this.notifyPropertyChanged('onNodeClick', { nodeId, node: n });
    }
    this.contextMenu = null;
    this.cdr.markForCheck();
  }

  openContext(ev: MouseEvent, node: OrgChartNode): void {
    if (!this.actionsList().length) {
      return;
    }
    this.contextMenu = { x: ev.clientX, y: ev.clientY, node };
    this.cdr.markForCheck();
  }

  closeContext(): void {
    this.contextMenu = null;
    this.cdr.markForCheck();
  }

  runAction(act: OrgChartActionItem, node: OrgChartNode): void {
    if (act.type === 'link' && act.value) {
      window.open(act.value, '_blank', 'noopener,noreferrer');
    } else if (act.type === 'copy' && act.value) {
      void navigator.clipboard?.writeText(act.value);
    } else if (act.type === 'emit') {
      this.notifyPropertyChanged('onContextAction', { actionId: act.id, nodeId: node.id, node });
    }
    this.closeContext();
  }

  startNodeDrag(ev: MouseEvent, nodeId: string): void {
    const cfg = mergeConfig(this.chart?.config);
    if (!cfg.draggable || ev.button !== 0) {
      return;
    }
    ev.stopPropagation();
    this.draggingPan = false;
    this.draggingNode = nodeId;
    const cur = this.dragOffsets.get(nodeId) ?? { dx: 0, dy: 0 };
    this.dragStart = { x: ev.clientX, y: ev.clientY, dx: cur.dx, dy: cur.dy };
  }

  exportPng(): void {
    if (!this.chart) {
      return;
    }
    const cfg = mergeConfig(this.chart.config);
    const nodes = filterVacantNodes(this.chart.nodes, cfg.showVacant);
    const { childrenByParent, roots } = buildHierarchyMaps(nodes);
    const full = this.layoutService.computeLayout({
      nodes,
      childrenByParent,
      roots,
      expandedIds: this.expandedIds,
      config: cfg
    });
    const nodeMap = buildNodeMap(nodes);
    const url = exportOrgChartPng({
      boxes: full.boxes,
      primaryEdges: full.primaryEdges,
      dottedEdges: full.dottedEdges,
      minX: full.minX,
      minY: full.minY,
      maxX: full.maxX,
      maxY: full.maxY,
      nodesById: nodeMap
    });
    if (!url) {
      this.rxLogService.error('OrgChartView: PNG export failed');
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = 'org-chart.png';
    a.click();
  }

  minimapViewBox(): string {
    return `0 0 ${this.contentW} ${this.contentH}`;
  }

  minimapVp(): { x: number; y: number; w: number; h: number } {
    const el = this.viewportRef?.nativeElement;
    const vw = el?.clientWidth ?? 800;
    const vh = el?.clientHeight ?? 500;
    const s = this.scale;
    const x = (-this.panX) / s;
    const y = (-this.panY) / s;
    const w = vw / s;
    const h = vh / s;
    return { x, y, w, h };
  }

  onMinimapClick(ev: MouseEvent): void {
    const el = ev.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    const my = ev.clientY - rect.top;
    const scaleX = this.contentW / rect.width;
    const scaleY = this.contentH / rect.height;
    const cx = mx * scaleX;
    const cy = my * scaleY;
    const vp = this.viewportRef?.nativeElement;
    const vw = vp?.clientWidth ?? 800;
    const vh = vp?.clientHeight ?? 500;
    this.panX = -(cx - vw / (2 * this.scale)) * this.scale;
    this.panY = -(cy - vh / (2 * this.scale)) * this.scale;
    this.afterPanZoom();
    this.cdr.markForCheck();
  }

  expandableFor(id: string): boolean {
    if (!this.chart) {
      return false;
    }
    const nodes = filterVacantNodes(this.chart.nodes, mergeConfig(this.chart.config).showVacant);
    const { childrenByParent } = buildHierarchyMaps(nodes);
    const n = buildNodeMap(nodes).get(id);
    const kids = childrenByParent.get(id) ?? [];
    return kids.length > 0 || Boolean(n?.hasChildren);
  }

  expandedFor(id: string): boolean {
    return this.expandedIds.has(id);
  }

  themeClass(): string {
    const t = mergeConfig(this.chart?.config).theme;
    return `oc-host--theme-${t || 'default'}`;
  }

  getNode(id: string): OrgChartNode {
    if (!this.chart) {
      return {
        id,
        parentId: null,
        name: '',
        title: '',
        department: '',
        avatar: '',
        status: 'active',
        badge: null,
        metadata: {}
      };
    }
    const nodes = filterVacantNodes(this.chart.nodes, mergeConfig(this.chart.config).showVacant);
    return (
      buildNodeMap(nodes).get(id) ?? {
        id,
        parentId: null,
        name: '',
        title: '',
        department: '',
        avatar: '',
        status: 'active',
        badge: null,
        metadata: {}
      }
    );
  }

  isCompact(): boolean {
    return mergeConfig(this.chart?.config).layoutMode === 'compact';
  }

  nodePathHighlight(id: string): boolean {
    return this.pathIds.has(id);
  }

  searchDim(id: string): boolean {
    const q = this.searchQuery.trim();
    if (!q) {
      return false;
    }
    return !this.pathIds.has(id) && !this.matchedIds.has(id);
  }

  reportCountFor(id: string): number {
    if (!this.chart) {
      return 0;
    }
    const nodes = filterVacantNodes(this.chart.nodes, mergeConfig(this.chart.config).showVacant);
    const { childrenByParent } = buildHierarchyMaps(nodes);
    return this.layoutService.directReportCount(id, childrenByParent);
  }

  isVacant(id: string): boolean {
    return this.getNode(id).status.toLowerCase() === 'vacant';
  }

  setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    const next = { ...this.state } as Record<string, unknown>;
    switch (propertyPath) {
      case 'hidden':
        next.hidden = Boolean(propertyValue);
        this.state = next as unknown as IOrgChartViewProperties;
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      case 'name':
      case 'recordDefinitionName':
      case 'chartJsonFieldId':
      case 'recordInstanceId':
      case 'chartDataQueryExpression':
      case 'chartDataPageSize':
      case 'chartDataJson':
        next[propertyPath] = propertyValue;
        this.state = next as unknown as IOrgChartViewProperties;
        this.resolveChartRaw$(this.state)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(({ raw, error }) => {
            this.applyChartParse(raw, error);
            this.notifyPropertyChanged(propertyPath, propertyValue);
            this.cdr.markForCheck();
          });
        break;
      default:
        return throwError(() => new Error(`OrgChartView: property ${propertyPath} is not settable.`));
    }
  }
}
