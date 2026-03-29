/**
 * @generated
 * @context JSON-driven org chart view: flat nodes + config schema, event payloads, Helix view properties.
 * @decisions parentId flat model; vacant via status; dottedLineIds for secondary edges; detailFields path into metadata.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-29
 */
import { IRxStandardProps } from '@helix/platform/view/api';

/** Single org node — flat list, hierarchy via parentId */
export interface OrgChartNode {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  department: string;
  avatar: string;
  status: string;
  badge: string | null;
  metadata: Record<string, unknown>;
  style?: Record<string, string | number | boolean>;
  hasChildren?: boolean;
  dottedLineIds?: string[];
}

export type OrgChartDirection = 'TB' | 'BT';
export type OrgChartLayoutMode = 'standard' | 'compact';

export interface OrgChartDetailField {
  /** Dot path into node.metadata */
  key: string;
  /** Optional label; otherwise key is shown (via translate fallback) */
  label?: string;
}

export type OrgChartActionType = 'emit' | 'link' | 'copy';

export interface OrgChartActionItem {
  id: string;
  label: string;
  icon?: string;
  type: OrgChartActionType;
  /** URL for link; text for copy */
  value?: string;
}

export interface OrgChartConfig {
  direction: OrgChartDirection;
  layoutMode: OrgChartLayoutMode;
  theme: string;
  maxDepth: number;
  defaultExpanded: boolean;
  draggable: boolean;
  showVacant: boolean;
  detailFields: OrgChartDetailField[];
  actions: OrgChartActionItem[];
}

export interface OrgChartData {
  nodes: OrgChartNode[];
  config: OrgChartConfig;
}

export interface OrgChartOnNodeClickPayload {
  nodeId: string;
  node: OrgChartNode;
}

export interface OrgChartOnExpandPayload {
  nodeId: string;
}

export interface OrgChartOnCollapsePayload {
  nodeId: string;
}

export interface OrgChartOnSearchPayload {
  query: string;
  matchedNodeIds: string[];
  pathNodeIds: string[];
}

export interface OrgChartOnContextActionPayload {
  actionId: string;
  nodeId: string;
  node: OrgChartNode;
}

/** Resolved position in canvas space (px) */
export interface OrgChartNodeBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OrgChartEdge {
  fromId: string;
  toId: string;
  kind: 'primary' | 'dotted';
}

export interface IOrgChartViewProperties extends IRxStandardProps {
  name: string;
  /**
   * Record definition whose instances supply chart JSON (Data Page loads rows).
   * When set with chartJsonFieldId, chart data is read from that field on the first matching row.
   */
  recordDefinitionName: unknown;
  /** Field id (numeric id string) on the record definition that stores JSON text for nodes+config */
  chartJsonFieldId: string;
  /**
   * When set with record definition + JSON field, loads that record via GET (same pattern as Markdown Viewer).
   * Bind to a view input / expression that resolves to the record instance id string.
   */
  recordInstanceId?: unknown;
  /** Optional AR qualification for the Data Page (e.g. `'536870913' = "REQ-1"`) when recordInstanceId is not used */
  chartDataQueryExpression: string;
  /** Data Page page size (default 1 = first row only) */
  chartDataPageSize: string;
  /**
   * Expression evaluating to JSON string or OrgChartData object.
   * Used when recordDefinitionName or chartJsonFieldId is not set, or as a standalone binding.
   */
  chartDataJson: unknown;
  /** Outputs — populated by runtime for expression builder */
  onNodeClick?: OrgChartOnNodeClickPayload;
  onExpand?: OrgChartOnExpandPayload;
  onCollapse?: OrgChartOnCollapsePayload;
  onSearch?: OrgChartOnSearchPayload;
  onContextAction?: OrgChartOnContextActionPayload;
}
