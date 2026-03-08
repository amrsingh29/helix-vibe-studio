# BMC-UX Adapt Components

## Overview

The Adapt library (`@bmc-ux/adapt-angular`, `@bmc-ux/adapt-charts`, `@bmc-ux/adapt-table`) provides 36 pre-built UI components. Always use Adapt components for consistent look and feel.

## Import Packages

```typescript
import { /* components */ } from '@bmc-ux/adapt-angular';   // Core UI + form controls
import { AdaptTableModule } from '@bmc-ux/adapt-table';     // Data table
import { /* chart modules */ } from '@bmc-ux/adapt-charts';  // Charts
```

**Styles** (in global or component SCSS):
```scss
@import '@bmc-ux/adapt-css/adapt.scss';
```

## Component Categories

### Buttons (2 components)
- **Button** — Multiple styles (primary, secondary, danger), sizes, icons, loading states. [Detail](../.cursor/_instructions/UI/AdaptComponents/buttons/button.md)
- **Button Group** — Grouped buttons for toggles and segmented controls. [Detail](../.cursor/_instructions/UI/AdaptComponents/buttons/button-group.md)

### Carousel (2 components)
- **Carousel** — Image/content slideshow with auto-play and navigation. [Detail](../.cursor/_instructions/UI/AdaptComponents/carousel/carousel.md)
- **Multi-Card Carousel** — Horizontally scrollable card gallery. [Detail](../.cursor/_instructions/UI/AdaptComponents/carousel/multi-card.md)

### Charts (9 components)
- **Area Graph** — Filled area trends over time. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/area-graph.md)
- **Area Stacked Graph** — Stacked area part-to-whole. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/area-stacked-graph.md)
- **Dual Chart** — Two Y-axes, mixed chart types. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/dual-chart.md)
- **Flow Chart** — Directed graph with nodes/edges (ngx-graph). [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/flow-chart.md)
- **Heatmap** — Color-coded matrix visualization. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/heatmap.md)
- **Pie Chart** — Pie/donut proportional data. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/pie-chart.md)
- **Scatter Plot** — Cartesian coordinate relationships. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/scatter-plot.md)
- **Stacked Chart** — Vertical/horizontal stacked bars. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/stacked-chart.md)
- **Treemap** — Nested rectangles for hierarchical data. [Detail](../.cursor/_instructions/UI/AdaptComponents/charts/treemap.md)

### Reactive Form Controls (14 components)
- **TextField** — Text, password, email, number, tel, url input. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-textfield.md)
- **TextArea** — Multi-line text with auto-resize. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-textarea.md)
- **Select** — Single/multi-select dropdown with search. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-select.md)
- **Checkbox** — Single/multi-option with indeterminate state. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-checkbox.md)
- **Radio Button** — Mutually exclusive group selection. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-radiobutton.md)
- **Switch** — Binary on/off toggle. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-switch.md)
- **DateTime** — Date/time picker with calendar. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-datetime.md)
- **Counter** — Numeric input with increment/decrement. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-counter.md)
- **Rating** — Star-based rating input. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-rating.md)
- **Search** — Search input with debounce. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-search.md)
- **Uploader** — File upload with drag-and-drop. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-uploader.md)
- **List Builder** — Dual-list select interface. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-list-builder.md)
- **List Selector** — Scrollable selection list. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/rx-list-selector.md)
- **Dropdown** — Options/controls from trigger element. [Detail](../.cursor/_instructions/UI/AdaptComponents/reactive-form/dropdown.md)

### Misc Components (6 components)
- **Accordion** — Collapsible content sections. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/accordion.md)
- **Code Viewer** — Syntax-highlighted code display. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/code-viewer.md)
- **Progress** — Progress bars (single/multi/segmented). [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/progress.md)
- **QR Code Scanner** — Camera-based QR/barcode scanning. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/qr-code-scanner.md)
- **Steps** — Step indicator for wizards/workflows. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/steps.md)
- **Tooltip** — Contextual help on hover/focus. [Detail](../.cursor/_instructions/UI/AdaptComponents/misc/tooltip.md)

### Table & Data (3 components)
- **Table** — Full-featured data table with sort, filter, paginate, select, export. [Detail](../.cursor/_instructions/UI/AdaptComponents/table/table.md)
- **Advanced Filter** — Visual filter builder for complex expressions. [Detail](../.cursor/_instructions/UI/AdaptComponents/table/advanced-filter.md)
- **Empty State** — No-data placeholder with icon and actions. [Detail](../.cursor/_instructions/UI/AdaptComponents/table/empty-state.md)

## Verified API Gotchas

These are confirmed behaviors discovered from reading the Adapt source code. AI agents frequently get these wrong.

### adapt-rx-select — Values MUST Be Arrays

The `writeValue()` implementation checks `Array.isArray(value)`. If the value is a plain string, it **silently clears the selection to empty**. This affects `FormControl` defaults, `patchValue`, and `reset`.

```typescript
// WRONG — selection will always be empty
status: new FormControl('Enabled', Validators.required)
this.form.patchValue({ status: record.status });

// CORRECT — wrap all select values in arrays
status: new FormControl(['Enabled'], Validators.required)
this.form.patchValue({ status: record.status ? [record.status] : ['Enabled'] });

// When reading values for save, unwrap:
const sel = (v: any) => Array.isArray(v) ? v[0] || '' : v || '';
fieldValues[statusFieldId] = sel(val.status);
```

### adapt-table — No `adaptTableCellTemplate` Directive

There is **no** directive named `adaptTableCellTemplate`. Any `<ng-template adaptTableCellTemplate="x">` is silently ignored and never rendered.

| Goal | Correct API |
|------|-------------|
| Row-level actions (Edit, Delete, etc.) | `ColumnConfig.rowLevelActionsConfig` |
| Custom cell rendering | `ColumnConfig.cellTemplate` (`TemplateRef` via `@ViewChild`) |
| Column-level header actions | `ColumnConfig.columnLevelActionsConfig` |

```typescript
// CORRECT — row actions via ColumnConfig
columns: ColumnConfig[] = [
  { field: 'name', header: 'Name', sortable: true },
  {
    field: 'created', header: 'Created', sortable: true,
    rowLevelActionsConfig: {
      actions: [
        { title: 'Edit', icon: 'd-icon-left-pencil',
          action: (params) => this.openEdit(params.dataItem) },
        { title: 'Delete', icon: 'd-icon-left-trash',
          action: (params) => this.confirmDelete(params.dataItem) }
      ]
    }
  }
];
```

### adapt-button — Use `[btn-type]`, Not `[variant]`

The button component has no `[variant]` input. Use `[btn-type]` for styling.

```html
<!-- WRONG -->
<button adapt-button [variant]="'primary'">Save</button>

<!-- CORRECT -->
<button adapt-button [btn-type]="'primary'">Save</button>
<button adapt-button [btn-type]="'secondary'">Cancel</button>
<button adapt-button [btn-type]="'tertiary'" [size]="'small'">
  <span class="d-icon-left-refresh"></span>
</button>
```

### Icons — Use `<span>` with `d-icon-left-*` Prefix

Button icons use `<span>` (not `<i>`) with the `d-icon-left-*` class pattern:

```html
<!-- WRONG -->
<button adapt-button><i class="d-icon-add"></i> Add</button>

<!-- CORRECT -->
<button adapt-button [btn-type]="'primary'">
  <span class="d-icon-left-plus"></span> Add
</button>
```

---

## Quick Reference by Use Case

| Use Case | Components |
|----------|-----------|
| Form building | TextField, TextArea, Select, Checkbox, RadioButton, Switch, DateTime, Counter, Rating, Uploader |
| Data display | Table, Empty State |
| Data visualization | Area Graph, Pie Chart, Stacked Chart, Heatmap, Treemap, Scatter Plot |
| Navigation/layout | Carousel, Multi-Card, Steps, Accordion |
| Actions | Button, Button Group, Dropdown |
| Filtering | Search, Advanced Filter |
| Feedback | Progress, Tooltip |

## Icon Usage

BMC-UX provides the DPL icon font. Use `<span>` elements with `d-icon-left-*` prefix inside buttons:

```html
<!-- Inside buttons — use d-icon-left-* prefix -->
<button adapt-button [btn-type]="'primary'">
  <span class="d-icon-left-plus"></span> Add
</button>
<button adapt-button [btn-type]="'tertiary'" [size]="'small'">
  <span class="d-icon-left-pencil"></span>
</button>

<!-- Standalone icons — use d-icon-* -->
<span class="d-icon-home"></span>
<span class="d-icon-user"></span>
<span class="d-icon-settings"></span>
<span class="d-icon-search"></span>
```

Common icon names: `plus`, `pencil`, `trash`, `refresh`, `cross`, `check`, `search`, `home`, `user`, `settings`.

## Standalone Component Import Pattern

```typescript
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdaptRxTextfieldComponent,
    AdaptButtonModule,
    AdaptModalModule,
    AdaptTableModule
  ]
})
export class MyComponent {}
```

For detailed per-component documentation with full API, properties, and examples, see the individual `.md` files linked above in `.cursor/_instructions/UI/AdaptComponents/`.

Also see the larger reference guides:
- `.cursor/rules/bmc-ux-adapt-form-controls.md`
- `.cursor/rules/bmc-ux-adapt-ui-components.md`
- `.cursor/rules/bmc-ux-adapt-charts.md`
- `.cursor/rules/bmc-ux-adapt-table.md`
