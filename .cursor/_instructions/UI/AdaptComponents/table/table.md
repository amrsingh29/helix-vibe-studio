# Table

## Description

A comprehensive data table component with advanced features including sorting, filtering, pagination, row selection, column reordering, and export capabilities. The table is highly customizable and supports both client-side and server-side data processing.

## Import

```typescript
import {AdaptTableModule} from '@bmc-ux/adapt-table';
```

## Component Name / Selector

**Selector:** `adapt-table`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| columns | ColumnConfig[] | - | An array of objects to represent dynamic columns |
| value | any[] | - | Data array to display in table |
| first | number | 0 | Index of the first row to be displayed |
| rows | number | - | Number of rows to display per page |
| totalRecords | number | null | Number of total records in the table |
| sortField | string | - | Name of the field to sort data by default |
| sortOrder | AdaptTableSortOrderMode | 1 | Order to sort when default sorting is enabled (1 for ASC, -1 for DESC) |
| multiSortMeta | SortMeta[] | - | An array of SortMeta objects to sort the data by default in multiple sort mode |
| selection | RowDataItem[] \| RowDataItem | - | Selected row in single mode or an array of values in multiple mode |
| style | KeyValueObject | - | Inline style of the component |
| styleClass | string | - | Style class of the component |
| tableStyle | KeyValueObject | - | Inline style of the table |
| tableStyleClass | string | null | Style class of the table |
| pageLinks | number | 5 | Number of page links to display |
| rowsPerPageOptions | number[] | - | Array of page size options |
| paginator | boolean | false | Enable pagination |
| filterable | boolean | false | Enable column filtering |
| sortable | boolean | false | Enable column sorting |
| sortMode | 'single' \| 'multiple' | 'single' | Sorting mode (single or multiple columns) |
| reorderableColumns | boolean | false | Enable column reordering via drag-and-drop |
| selectionMode | 'single' \| 'multiple' | - | Row selection mode |
| dataKey | string | - | Unique identifier field for rows (required for selection) |
| bordered | boolean | false | Enable bordered table style |
| striped | boolean | false | Enable striped rows |
| toolbarConfig | ToolbarConfig | - | Configuration for table toolbar |
| isRefreshingRowData | boolean | false | Shows refresh indicator |
| rowAriaDataResolver | (data: RowData \| GroupedRowData) => AdaptTableRowAriaData | - | Custom resolver for row ARIA attributes |
| globalFilterFields | string[] | - | Fields to search in global filter |
| loading | boolean | false | Show loading indicator |
| lazy | boolean | false | Enable lazy loading for server-side operations |
| exportFilename | string | 'download' | Default filename for exports |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| onRowSelect | EventEmitter<any> | Emits when a row is selected |
| onRowUnselect | EventEmitter<any> | Emits when a row is unselected |
| selectionChange | EventEmitter<any> | Emits when selection changes |
| onSort | EventEmitter<any> | Emits when column is sorted |
| onFilter | EventEmitter<any> | Emits when filter is applied |
| onPage | EventEmitter<any> | Emits when page changes |
| onColReorder | EventEmitter<AdaptTableColReorderEvent> | Emits when columns are reordered |
| onLazyLoad | EventEmitter<any> | Emits lazy load event for server-side operations |
| onExport | EventEmitter<ExportEvent> | Emits when export is triggered |

### Key Interfaces

#### ColumnConfig

```typescript
interface ColumnConfig {
  field: string;                    // Field name
  header: string;                   // Column header text
  sortable?: boolean;              // Enable sorting for this column
  filterable?: boolean;            // Enable filtering for this column
  filterType?: string;             // Filter type (text, dropdown, date, etc.)
  width?: string;                  // Column width
  hidden?: boolean;                // Hide column
  frozen?: boolean;                // Freeze column
  template?: TemplateRef<any>;     // Custom cell template
  headerTemplate?: TemplateRef<any>; // Custom header template
}
```

#### ToolbarConfig

```typescript
interface ToolbarConfig {
  leftSection?: TemplateRef<any>;   // Left toolbar section template
  rightSection?: TemplateRef<any>;  // Right toolbar section template
  showRefresh?: boolean;            // Show refresh button
  showExport?: boolean;             // Show export button
  showColumnToggle?: boolean;       // Show column visibility toggle
  exportTypes?: ExportType[];       // Available export types
}
```

## Simple Example

### TypeScript Component

```typescript
import {Component, OnInit} from '@angular/core';
import {ColumnConfig, ToolbarConfig, AdaptTableFilters} from '@bmc-ux/adapt-table';

interface Car {
  vin: string;
  year: number;
  brand: string;
  color: string;
  price: number;
}

@Component({
  selector: 'app-table-demo',
  templateUrl: './table-demo.html'
})
export class TableDemoComponent implements OnInit {
  cars: Car[] = [];
  selectedCars: Car[] = [];
  columns: ColumnConfig[] = [];
  bordered: boolean = false;
  striped: boolean = true;

  toolbarConfig: ToolbarConfig = {
    showRefresh: true,
    showExport: true,
    showColumnToggle: true,
    exportTypes: ['csv', 'excel', 'pdf']
  };

  ngOnInit() {
    // Define columns
    this.columns = [
      { field: 'vin', header: 'VIN', sortable: true, filterable: true },
      { field: 'year', header: 'Year', sortable: true, filterable: true },
      { field: 'brand', header: 'Brand', sortable: true, filterable: true },
      { field: 'color', header: 'Color', sortable: true, filterable: true },
      { field: 'price', header: 'Price', sortable: true, filterable: true }
    ];

    // Load data
    this.cars = [
      { vin: 'VIN001', year: 2020, brand: 'Toyota', color: 'Blue', price: 25000 },
      { vin: 'VIN002', year: 2021, brand: 'Honda', color: 'Red', price: 28000 },
      { vin: 'VIN003', year: 2019, brand: 'Ford', color: 'Black', price: 22000 }
    ];
  }

  onRowSelect(event: any): void {
    console.log('Row selected:', event.data);
  }

  onSort(event: any): void {
    console.log('Sort event:', event);
  }

  onFilter(event: any): void {
    console.log('Filter event:', event);
  }

  onExport(event: any): void {
    console.log('Export event:', event);
  }
}
```

### HTML Template

```html
<!-- Basic Table -->
<adapt-table [value]="cars"
             [columns]="columns"
             [bordered]="bordered"
             [striped]="striped"
             [rows]="10"
             [paginator]="true"
             [dataKey]="'vin'"></adapt-table>

<!-- Table with Sorting and Filtering -->
<adapt-table [value]="cars"
             [columns]="columns"
             [sortable]="true"
             [sortMode]="'multiple'"
             [filterable]="true"
             [paginator]="true"
             [rows]="10"
             [dataKey]="'vin'"></adapt-table>

<!-- Table with Selection -->
<adapt-table [value]="cars"
             [columns]="columns"
             [selectionMode]="'multiple'"
             [(selection)]="selectedCars"
             [dataKey]="'vin'"
             [paginator]="true"
             [rows]="10"
             (onRowSelect)="onRowSelect($event)"></adapt-table>

<!-- Table with All Features -->
<adapt-table #adaptTable
             [value]="cars"
             [columns]="columns"
             [bordered]="bordered"
             [striped]="striped"
             [rows]="10"
             [first]="0"
             [paginator]="true"
             [filterable]="true"
             [dataKey]="'vin'"
             [sortable]="true"
             [sortMode]="'multiple'"
             [reorderableColumns]="true"
             [selectionMode]="'multiple'"
             [(selection)]="selectedCars"
             [toolbarConfig]="toolbarConfig"
             (onSort)="onSort($event)"
             (onFilter)="onFilter($event)"
             (onExport)="onExport($event)"></adapt-table>

<!-- Server-Side (Lazy Loading) Table -->
<adapt-table [value]="cars"
             [columns]="columns"
             [lazy]="true"
             [totalRecords]="totalRecords"
             [rows]="10"
             [paginator]="true"
             [loading]="loading"
             (onLazyLoad)="loadData($event)"></adapt-table>
```

## Key Features

- **Sorting**: Single and multiple column sorting
- **Filtering**: Column-level and global filtering
- **Pagination**: Client-side and server-side pagination
- **Selection**: Single and multiple row selection
- **Column Reordering**: Drag-and-drop column reordering
- **Export**: Export to CSV, Excel, and PDF
- **Toolbar**: Customizable toolbar with actions
- **Templates**: Custom cell and header templates
- **Frozen Columns**: Pin columns to left or right
- **Responsive**: Mobile-friendly design
- **Lazy Loading**: Server-side data loading
- **Accessibility**: Full ARIA support
- **Bordered/Striped**: Visual style options
- **Column Toggle**: Show/hide columns
- **Row Actions**: Context menus and row-level actions

