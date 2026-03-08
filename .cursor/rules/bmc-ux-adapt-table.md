# BMC-UX Adapt Table Guide

## Overview

BMC-UX Adapt Table is a powerful, feature-rich data table component built on PrimeNG. It provides advanced features like sorting, filtering, pagination, row selection, column resizing, and more.

**Version**: 18.24.0  
**Package**: `@bmc-ux/adapt-table`  
**Based on**: PrimeNG Table  
**BMC Helix Innovation Studio**: 25.3.0+

---

## Installation and Setup

### Import Module

```typescript
import { AdaptTableModule } from '@bmc-ux/adapt-table';

@NgModule({
  imports: [
    CommonModule,
    AdaptTableModule
  ]
})
export class YourModule {}
```

### Standalone Component Import

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdaptTableModule } from '@bmc-ux/adapt-table';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [
    CommonModule,
    AdaptTableModule
  ],
  templateUrl: './data-view.component.html'
})
export class DataViewComponent {}
```

---

## Basic Table

### Simple Table

```typescript
// Component
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
];
```

```html
<adapt-table [value]="users">
  <ng-template pTemplate="header">
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Status</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.id }}</td>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.role }}</td>
      <td>{{ user.status }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

## Table Features

### 1. Sorting

**Single Column Sort**:
```html
<adapt-table [value]="users">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="id">
        ID <p-sortIcon field="id"></p-sortIcon>
      </th>
      <th pSortableColumn="name">
        Name <p-sortIcon field="name"></p-sortIcon>
      </th>
      <th pSortableColumn="email">
        Email <p-sortIcon field="email"></p-sortIcon>
      </th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.id }}</td>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

**Multi-Column Sort**:
```html
<adapt-table 
  [value]="users"
  sortMode="multiple">
  <!-- Hold Ctrl/Cmd to sort multiple columns -->
</adapt-table>
```

**Programmatic Sort**:
```typescript
// Component
sortField: string = 'name';
sortOrder: number = 1; // 1 for ascending, -1 for descending
```

```html
<adapt-table 
  [value]="users"
  [(sortField)]="sortField"
  [(sortOrder)]="sortOrder">
</adapt-table>
```

---

### 2. Filtering

**Column Filters**:
```html
<adapt-table 
  [value]="users"
  [globalFilterFields]="['name', 'email', 'role']">
  <ng-template pTemplate="header">
    <tr>
      <th>
        <div class="flex align-items-center">
          Name
          <p-columnFilter 
            type="text" 
            field="name" 
            display="menu">
          </p-columnFilter>
        </div>
      </th>
      <th>
        <div class="flex align-items-center">
          Role
          <p-columnFilter 
            type="text" 
            field="role" 
            display="menu">
          </p-columnFilter>
        </div>
      </th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.role }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

**Global Search**:
```html
<div class="table-header">
  <adapt-rx-search
    placeholder="Search..."
    (search)="onGlobalSearch($event)">
  </adapt-rx-search>
</div>

<adapt-table 
  #dt
  [value]="users"
  [globalFilterFields]="['name', 'email', 'role']">
  <!-- table content -->
</adapt-table>
```

```typescript
// Component
@ViewChild('dt') table: any;

onGlobalSearch(query: string) {
  this.table.filterGlobal(query, 'contains');
}
```

**Dropdown Filter**:
```html
<th>
  <div class="flex align-items-center">
    Status
    <p-columnFilter 
      field="status" 
      matchMode="equals" 
      [showMenu]="false">
      <ng-template pTemplate="filter" let-value let-filter="filterCallback">
        <p-dropdown 
          [ngModel]="value" 
          [options]="statuses"
          (onChange)="filter($event.value)"
          placeholder="Select Status">
        </p-dropdown>
      </ng-template>
    </p-columnFilter>
  </div>
</th>
```

---

### 3. Pagination

**Basic Pagination**:
```html
<adapt-table 
  [value]="users"
  [paginator]="true"
  [rows]="10"
  [totalRecords]="totalRecords">
</adapt-table>
```

**Custom Rows Per Page**:
```html
<adapt-table 
  [value]="users"
  [paginator]="true"
  [rows]="10"
  [rowsPerPageOptions]="[5, 10, 25, 50]"
  [showCurrentPageReport]="true"
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
</adapt-table>
```

**Lazy Loading with Pagination**:
```typescript
// Component
loading: boolean = false;
totalRecords: number = 0;

loadData(event: any) {
  this.loading = true;
  
  const page = event.first / event.rows;
  const size = event.rows;
  
  this.dataService.getData(page, size).subscribe(response => {
    this.users = response.data;
    this.totalRecords = response.total;
    this.loading = false;
  });
}
```

```html
<adapt-table 
  [value]="users"
  [lazy]="true"
  [paginator]="true"
  [rows]="10"
  [totalRecords]="totalRecords"
  [loading]="loading"
  (onLazyLoad)="loadData($event)">
</adapt-table>
```

---

### 4. Row Selection

**Single Selection**:
```typescript
// Component
selectedUser: User;
```

```html
<adapt-table 
  [value]="users"
  [(selection)]="selectedUser"
  selectionMode="single"
  dataKey="id">
  <ng-template pTemplate="body" let-user>
    <tr [pSelectableRow]="user">
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

**Multiple Selection**:
```typescript
// Component
selectedUsers: User[] = [];
```

```html
<adapt-table 
  [value]="users"
  [(selection)]="selectedUsers"
  selectionMode="multiple"
  dataKey="id">
  <ng-template pTemplate="header">
    <tr>
      <th style="width: 3rem">
        <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
      </th>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>
        <p-tableCheckbox [value]="user"></p-tableCheckbox>
      </td>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

**Radio Button Selection**:
```html
<adapt-table 
  [value]="users"
  [(selection)]="selectedUser"
  dataKey="id">
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>
        <p-tableRadioButton [value]="user"></p-tableRadioButton>
      </td>
      <td>{{ user.name }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

### 5. Row Expansion

```typescript
// Component
expandedRows: any = {};
```

```html
<adapt-table 
  [value]="users"
  dataKey="id"
  [expandedRowKeys]="expandedRows">
  <ng-template pTemplate="header">
    <tr>
      <th style="width: 3rem"></th>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user let-expanded="expanded">
    <tr>
      <td>
        <button 
          type="button" 
          pButton 
          pRipple 
          [pRowToggler]="user"
          class="p-button-text p-button-rounded"
          [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'">
        </button>
      </td>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="rowexpansion" let-user>
    <tr>
      <td colspan="3">
        <div class="p-3">
          <h5>Additional Details</h5>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong>Status:</strong> {{ user.status }}</p>
        </div>
      </td>
    </tr>
  </ng-template>
</adapt-table>
```

---

### 6. Column Resizing

```html
<adapt-table 
  [value]="users"
  [resizableColumns]="true"
  columnResizeMode="expand">
  <ng-template pTemplate="header">
    <tr>
      <th pResizableColumn>Name</th>
      <th pResizableColumn>Email</th>
      <th pResizableColumn>Role</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.role }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

**Resize Modes**:
- `expand` - Table width increases/decreases
- `fit` - Column widths adjust to fit table width

---

### 7. Column Reordering

```html
<adapt-table 
  [value]="users"
  [reorderableColumns]="true">
  <ng-template pTemplate="header">
    <tr>
      <th pReorderableColumn>Name</th>
      <th pReorderableColumn>Email</th>
      <th pReorderableColumn>Role</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.role }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

### 8. Frozen Columns

```html
<adapt-table [value]="users" [scrollable]="true" scrollHeight="400px">
  <ng-template pTemplate="header">
    <tr>
      <th [frozen]="true">Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Address</th>
      <th>City</th>
      <th>Country</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td [frozen]="true">{{ user.name }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.phone }}</td>
      <td>{{ user.address }}</td>
      <td>{{ user.city }}</td>
      <td>{{ user.country }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

### 9. Virtual Scrolling

**For Large Datasets**:
```html
<adapt-table 
  [value]="users"
  [scrollable]="true"
  [scrollHeight]="'400px'"
  [virtualScroll]="true"
  [virtualScrollItemSize]="46"
  [lazy]="true"
  (onLazyLoad)="loadDataOnScroll($event)">
  <ng-template pTemplate="header">
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr style="height: 46px">
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

### 10. Row Editing

**Inline Editing**:
```typescript
// Component
clonedUsers: { [s: string]: User } = {};

onRowEditInit(user: User) {
  this.clonedUsers[user.id] = { ...user };
}

onRowEditSave(user: User) {
  delete this.clonedUsers[user.id];
  // Save to backend
  this.userService.update(user).subscribe();
}

onRowEditCancel(user: User, index: number) {
  this.users[index] = this.clonedUsers[user.id];
  delete this.clonedUsers[user.id];
}
```

```html
<adapt-table 
  [value]="users"
  dataKey="id"
  editMode="row">
  <ng-template pTemplate="header">
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th style="width: 8rem"></th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user let-editing="editing" let-ri="rowIndex">
    <tr [pEditableRow]="user">
      <td>
        <p-cellEditor>
          <ng-template pTemplate="input">
            <input pInputText type="text" [(ngModel)]="user.name">
          </ng-template>
          <ng-template pTemplate="output">
            {{ user.name }}
          </ng-template>
        </p-cellEditor>
      </td>
      <td>
        <p-cellEditor>
          <ng-template pTemplate="input">
            <input pInputText type="text" [(ngModel)]="user.email">
          </ng-template>
          <ng-template pTemplate="output">
            {{ user.email }}
          </ng-template>
        </p-cellEditor>
      </td>
      <td>
        <div class="flex gap-2">
          <button 
            *ngIf="!editing" 
            pButton 
            pRipple 
            type="button" 
            pInitEditableRow 
            icon="pi pi-pencil"
            (click)="onRowEditInit(user)">
          </button>
          <button 
            *ngIf="editing" 
            pButton 
            pRipple 
            type="button" 
            pSaveEditableRow 
            icon="pi pi-check"
            (click)="onRowEditSave(user)">
          </button>
          <button 
            *ngIf="editing" 
            pButton 
            pRipple 
            type="button" 
            pCancelEditableRow 
            icon="pi pi-times"
            (click)="onRowEditCancel(user, ri)">
          </button>
        </div>
      </td>
    </tr>
  </ng-template>
</adapt-table>
```

---

## Advanced Features

### 1. Row Grouping

```typescript
// Component
groupedUsers: any[];

ngOnInit() {
  this.groupedUsers = this.users.reduce((acc, user) => {
    const role = user.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(user);
    return acc;
  }, {});
}
```

```html
<adapt-table 
  [value]="users"
  rowGroupMode="subheader"
  groupRowsBy="role"
  sortField="role"
  sortOrder="1">
  <ng-template pTemplate="groupheader" let-user>
    <tr>
      <td colspan="3">
        <strong>{{ user.role }}</strong>
      </td>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.status }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

### 2. Export Data

```typescript
import { Table } from 'primeng/table';

@ViewChild('dt') table: Table;

exportCSV() {
  this.table.exportCSV();
}

exportExcel() {
  import('xlsx').then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(this.users);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'users');
  });
}

saveAsExcelFile(buffer: any, fileName: string) {
  import('file-saver').then(FileSaver => {
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  });
}
```

```html
<div class="table-header">
  <button adapt-button (click)="exportCSV()">Export CSV</button>
  <button adapt-button (click)="exportExcel()">Export Excel</button>
</div>

<adapt-table #dt [value]="users">
  <!-- table content -->
</adapt-table>
```

---

### 3. Context Menu

```typescript
// Component
contextMenuItems: MenuItem[] = [
  { label: 'View', icon: 'pi pi-eye', command: () => this.viewUser(this.selectedUser) },
  { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editUser(this.selectedUser) },
  { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteUser(this.selectedUser) }
];

selectedUser: User;
```

```html
<p-contextMenu #cm [model]="contextMenuItems"></p-contextMenu>

<adapt-table 
  [value]="users"
  [(contextMenuSelection)]="selectedUser"
  [contextMenu]="cm">
  <ng-template pTemplate="body" let-user>
    <tr [pContextMenuRow]="user">
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

### 4. Custom Cell Templates

```html
<adapt-table [value]="users">
  <ng-template pTemplate="body" let-user>
    <tr>
      <td>
        <!-- Avatar -->
        <div class="flex align-items-center gap-2">
          <img [src]="user.avatar" alt="avatar" class="avatar">
          <span>{{ user.name }}</span>
        </div>
      </td>
      <td>
        <!-- Status Badge -->
        <span [class]="'badge badge-' + user.status.toLowerCase()">
          {{ user.status }}
        </span>
      </td>
      <td>
        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button adapt-button icon-only (click)="edit(user)">
            <i class="d-icon-edit"></i>
          </button>
          <button adapt-button icon-only type="danger" (click)="delete(user)">
            <i class="d-icon-delete"></i>
          </button>
        </div>
      </td>
    </tr>
  </ng-template>
</adapt-table>
```

---

## Styling

### Custom Table Styles

```scss
::ng-deep {
  .adapt-table {
    // Header
    .p-datatable-thead > tr > th {
      background-color: #f5f5f5;
      font-weight: 600;
      padding: 1rem;
    }
    
    // Body
    .p-datatable-tbody > tr > td {
      padding: 0.75rem 1rem;
    }
    
    // Hover
    .p-datatable-tbody > tr:hover {
      background-color: #f9f9f9;
    }
    
    // Selected row
    .p-datatable-tbody > tr.p-highlight {
      background-color: #e3f2fd;
    }
    
    // Striped rows
    .p-datatable-tbody > tr:nth-child(even) {
      background-color: #fafafa;
    }
  }
}
```

### Responsive Table

```scss
@media screen and (max-width: 768px) {
  ::ng-deep .adapt-table {
    .p-datatable-thead > tr > th,
    .p-datatable-tbody > tr > td {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }
}
```

---

## Performance Optimization

### 1. Virtual Scrolling for Large Data

```html
<adapt-table 
  [value]="users"
  [scrollable]="true"
  scrollHeight="600px"
  [virtualScroll]="true"
  [virtualScrollItemSize]="50"
  [rows]="100">
</adapt-table>
```

### 2. Lazy Loading

```typescript
loadData(event: LazyLoadEvent) {
  this.loading = true;
  
  // Simulate API call
  setTimeout(() => {
    const start = event.first || 0;
    const end = start + (event.rows || 10);
    
    this.users = this.allUsers.slice(start, end);
    this.loading = false;
  }, 1000);
}
```

### 3. Track By Function

```typescript
trackByUserId(index: number, user: User): number {
  return user.id;
}
```

```html
<adapt-table [value]="users">
  <ng-template pTemplate="body" let-user>
    <tr *ngFor="let user of users; trackBy: trackByUserId">
      <td>{{ user.name }}</td>
    </tr>
  </ng-template>
</adapt-table>
```

---

## Best Practices

### 1. Use DataKey

Always provide a unique `dataKey` for selection and row operations:
```html
<adapt-table [value]="users" dataKey="id">
```

### 2. Implement Loading State

```html
<adapt-table [value]="users" [loading]="loading">
  <ng-template pTemplate="emptymessage">
    <tr>
      <td colspan="5" class="text-center">
        No data found
      </td>
    </tr>
  </ng-template>
</adapt-table>
```

### 3. Optimize Large Tables

- Use virtual scrolling for 1000+ rows
- Implement lazy loading for server-side pagination
- Use trackBy for better performance
- Limit visible columns on mobile

### 4. Accessibility

```html
<adapt-table 
  [value]="users"
  ariaLabel="Users table"
  ariaLabelledBy="table-header">
  <ng-template pTemplate="caption">
    <h2 id="table-header">User Management</h2>
  </ng-template>
</adapt-table>
```

---

## Common Patterns

### CRUD Table

```html
<div class="table-toolbar">
  <button adapt-button (click)="openNew()">
    <i class="d-icon-add"></i> Add User
  </button>
  <button adapt-button type="danger" [disabled]="!selectedUsers?.length" (click)="deleteSelected()">
    <i class="d-icon-delete"></i> Delete Selected
  </button>
</div>

<adapt-table 
  [value]="users"
  [(selection)]="selectedUsers"
  dataKey="id">
  <!-- table content -->
</adapt-table>
```

### Table with Toolbar

```html
<div class="table-container">
  <div class="table-header">
    <h3>Users</h3>
    <div class="table-actions">
      <adapt-rx-search (search)="onSearch($event)"></adapt-rx-search>
      <button adapt-button (click)="refresh()">
        <i class="d-icon-refresh"></i>
      </button>
      <button adapt-button (click)="exportData()">
        <i class="d-icon-download"></i>
      </button>
    </div>
  </div>
  
  <adapt-table [value]="users">
    <!-- table content -->
  </adapt-table>
</div>
```

---

## Troubleshooting

### Issue: Table not displaying data

**Solution**: Ensure data is an array
```typescript
users: User[] = []; // Initialize as empty array
```

### Issue: Sorting not working

**Solution**: Add `pSortableColumn` and `p-sortIcon`
```html
<th pSortableColumn="name">
  Name <p-sortIcon field="name"></p-sortIcon>
</th>
```

### Issue: Selection not working

**Solution**: Add `dataKey` attribute
```html
<adapt-table [value]="users" dataKey="id">
```

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Package Version**: @bmc-ux/adapt-table 18.24.0
