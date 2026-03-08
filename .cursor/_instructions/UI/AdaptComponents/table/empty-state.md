# Empty State

## Description

Empty State component displays a placeholder when there is no data or content to show. It provides visual feedback with icons, text, and optional actions to guide users on what to do next. Commonly used in tables, lists, search results, and other data-driven components.

## Import

```typescript
import {AdaptEmptyStateModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-empty-state`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Empty state label text |
| type | AdaptEmptyStateType | - | Empty state icon type to be used |
| inverted | boolean | false | Toggle inverted color mode |
| size | EmptyStateSizes | '256' | Size of the empty state icon (128 or 256) |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| sizeChange | EventEmitter<EmptyStateSizeChange> | Emits when size changes |

### Exported Types

#### AdaptEmptyStateType

Common empty state types include:
- `'no-data'` - No data available
- `'no-results'` - No search results
- `'no-content'` - No content
- `'error'` - Error state
- `'search'` - Search empty state
- `'filter'` - Filter empty state
- `'folder'` - Empty folder
- And many more...

#### EmptyStateSizes

```typescript
type EmptyStateSizes = '128' | '256';
```

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';
import {AdaptEmptyStateType} from '@bmc-ux/adapt-angular';

@Component({
  selector: 'app-empty-state-demo',
  templateUrl: './empty-state.demo.html'
})
export class EmptyStateDemoComponent {
  emptyStateType: AdaptEmptyStateType = 'no-data';
  inverted: boolean = false;
  currentSize: '128' | '256' = '256';

  // For list/table
  items: any[] = [];

  onSizeChange(event: any): void {
    console.log('Size changed:', event);
  }
}
```

### HTML Template

```html
<!-- Basic Empty State -->
<adapt-empty-state [type]="'no-data'"
                   [label]="'No data available'"></adapt-empty-state>

<!-- No Search Results -->
<adapt-empty-state [type]="'no-results'"
                   [label]="'No results found'"></adapt-empty-state>

<!-- Empty Folder -->
<adapt-empty-state [type]="'folder'"
                   [label]="'This folder is empty'"></adapt-empty-state>

<!-- Error State -->
<adapt-empty-state [type]="'error'"
                   [label]="'Something went wrong'"></adapt-empty-state>

<!-- Small Size Empty State -->
<adapt-empty-state [type]="'no-data'"
                   [label]="'No items'"
                   [size]="'128'"></adapt-empty-state>

<!-- Inverted Mode (for dark backgrounds) -->
<div class="dark-background">
  <adapt-empty-state [type]="'no-data'"
                     [label]="'No data available'"
                     [inverted]="true"></adapt-empty-state>
</div>

<!-- In a Table Context -->
<adapt-table [value]="items">
  <!-- Table configuration -->
</adapt-table>

<div *ngIf="items.length === 0">
  <adapt-empty-state [type]="'no-data'"
                     [label]="'No records found'"></adapt-empty-state>
</div>

<!-- In Search Results -->
<div *ngIf="searchResults.length === 0 && searchPerformed">
  <adapt-empty-state [type]="'no-results'"
                     [label]="'No results match your search'"></adapt-empty-state>
</div>

<!-- With Custom Action -->
<div class="empty-state-container">
  <adapt-empty-state [type]="'no-data'"
                     [label]="'No items yet'"></adapt-empty-state>
  <button class="btn btn-primary mt-3" (click)="createNewItem()">
    Create New Item
  </button>
</div>

<!-- With Dynamic Type -->
<adapt-empty-state [type]="emptyStateType"
                   [label]="getEmptyStateLabel()"
                   [size]="currentSize"
                   (sizeChange)="onSizeChange($event)"></adapt-empty-state>

<!-- Conditional Empty State in List -->
<div class="data-container">
  <div *ngIf="loading">
    <div class="spinner">Loading...</div>
  </div>
  
  <div *ngIf="!loading && items.length > 0">
    <div *ngFor="let item of items">
      <!-- Item display -->
    </div>
  </div>
  
  <div *ngIf="!loading && items.length === 0">
    <adapt-empty-state [type]="'no-data'"
                       [label]="'No items to display'"></adapt-empty-state>
  </div>
</div>
```

### Complete Example with Actions

```typescript
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-data-list',
  template: `
    <div class="data-list">
      <div class="search-bar">
        <input type="text" 
               [(ngModel)]="searchTerm" 
               (ngModelChange)="search()"
               placeholder="Search...">
      </div>

      <div *ngIf="!loading && filteredItems.length > 0" class="items">
        <div *ngFor="let item of filteredItems" class="item">
          {{item.name}}
        </div>
      </div>

      <div *ngIf="!loading && filteredItems.length === 0" 
           class="empty-state-wrapper">
        <adapt-empty-state 
          [type]="getEmptyStateType()"
          [label]="getEmptyStateLabel()">
        </adapt-empty-state>
        
        <button *ngIf="hasSearchTerm" 
                class="btn btn-secondary mt-3"
                (click)="clearSearch()">
          Clear Search
        </button>
        
        <button *ngIf="!hasSearchTerm && canCreate" 
                class="btn btn-primary mt-3"
                (click)="createNew()">
          Create New Item
        </button>
      </div>
    </div>
  `
})
export class DataListComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  get hasSearchTerm(): boolean {
    return !!this.searchTerm;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load data logic
    this.loading = false;
    this.filteredItems = this.items;
  }

  search() {
    this.filteredItems = this.items.filter(item => 
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getEmptyStateType(): string {
    return this.hasSearchTerm ? 'no-results' : 'no-data';
  }

  getEmptyStateLabel(): string {
    return this.hasSearchTerm 
      ? `No results found for "${this.searchTerm}"`
      : 'No items available';
  }

  clearSearch() {
    this.searchTerm = '';
    this.search();
  }

  createNew() {
    // Create new item logic
  }
}
```

## Key Features

- **Multiple Icon Types**: Various icons for different empty state scenarios
- **Customizable Text**: Custom label for context-specific messages
- **Size Options**: 128px or 256px icon sizes
- **Inverted Mode**: Support for dark backgrounds
- **Responsive**: Adapts to container size
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Lightweight**: Minimal performance impact
- **Consistent Design**: Matches Adapt design system
- **Easy Integration**: Simple to add to any component
- **Ideal for**:
  - Empty tables and lists
  - No search results
  - Empty folders/directories
  - Error states
  - First-time user experiences
  - Filter results with no matches

