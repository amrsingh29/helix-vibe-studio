# BMC Helix Innovation Studio - Cursor Rules Documentation

This directory contains comprehensive documentation for developing applications with BMC Helix Innovation Studio and BMC-UX Adapt components.

## Documentation Files

### 1. Main Development Guide
**File**: `bmc-helix-innovation-studio.md`

Core development guide covering:
- Project structure and setup
- Custom view components creation
- REST API integration (DataPage API, Record Instance API)
- Build and deployment process
- Schematics for code generation
- Common issues and solutions
- Best practices

**Use this for**: General development, project setup, API integration, deployment

---

### 2. Form Controls Guide
**File**: `bmc-ux-adapt-form-controls.md`

Comprehensive guide for all form controls:
- Text Field, Text Area
- Select Dropdown (single/multi-select)
- Checkbox, Radio Button, Switch
- Date/Time Picker
- Typeahead (autocomplete)
- Counter, Rating, Search
- File Uploader
- Form validation and layouts

**Use this for**: Building forms, user input, data entry

---

### 3. UI Components Guide
**File**: `bmc-ux-adapt-ui-components.md`

Complete reference for UI components:
- Buttons and Button Groups
- Modal and Dialog
- Tabs and Accordion
- Alerts and Toasts
- Tooltips and Popovers
- Badge and Tag
- Progress Bar and Busy Loader
- Sidebar and Navigation
- Cards and Panels
- Stepper and Empty State

**Use this for**: Building user interfaces, navigation, notifications

---

### 4. Charts Guide
**File**: `bmc-ux-adapt-charts.md`

Data visualization components:
- Line Graph, Area Graph
- Bar Chart, Stacked Bar Chart
- Pie Chart, Donut Chart
- Dual Chart, Scatter Plot
- Heatmap, Treemap
- Flow Chart
- Chart configuration and customization
- Real-time data updates
- Export functionality

**Use this for**: Dashboards, analytics, data visualization

---

### 5. Table Guide
**File**: `bmc-ux-adapt-table.md`

Advanced data table component:
- Basic table setup
- Sorting and filtering
- Pagination and lazy loading
- Row selection and expansion
- Column resizing and reordering
- Frozen columns
- Virtual scrolling
- Inline editing
- Export to CSV/Excel
- Performance optimization

**Use this for**: Displaying tabular data, data grids, CRUD operations

---

### 6. Requirement Gathering Guide
**File**: `bmc-helix-requirement-gathering.mdc`

Comprehensive question list for gathering requirements before building:
- View Components (category, data source, CRUD, filtering, UI, inspector config, API)
- Java Services (type, inputs, record operations, output, error handling, integrations)
- Combined (UI + backend) data flow and coupling
- Deployment and testing preferences
- Quick reference table mapping existing examples to categories

**Use this for**: Scoping new features, clarifying user requirements before building, choosing the right template/example to follow

---

## Quick Navigation

### By Task

**Creating a new view component**:
See `bmc-helix-innovation-studio.md` > Custom View Components section

**Building a form**:
See `bmc-ux-adapt-form-controls.md`

**Adding a modal dialog**:
See `bmc-ux-adapt-ui-components.md` > Modal & Dialog section

**Creating a dashboard with charts**:
See `bmc-ux-adapt-charts.md`

**Displaying data in a table**:
See `bmc-ux-adapt-table.md`

**API integration**:
See `bmc-helix-innovation-studio.md` > REST API Integration section

**Deployment**:
See `bmc-helix-innovation-studio.md` > Build and Deployment section

**Starting a new feature (requirement gathering)**:
See `bmc-helix-requirement-gathering.mdc`

---

## Package Versions

All documentation is based on:
- **BMC Helix Innovation Studio**: 25.4.00+
- **@bmc-ux/adapt-angular**: 18.24.0
- **@bmc-ux/adapt-charts**: 18.24.0
- **@bmc-ux/adapt-table**: 18.24.0
- **Angular**: 18.2.6+

---

## Getting Started

### 1. Setup Your Environment

Follow the setup instructions in `bmc-helix-innovation-studio.md`:
- Docker environment setup
- Project structure
- Build configuration

### 2. Choose Your Components

Browse the component guides to find what you need:
- Form controls for user input
- UI components for interface elements
- Charts for data visualization
- Table for data display

### 3. Import and Use

```typescript
// Import components
import { 
  AdaptRxTextfieldComponent,
  AdaptButtonModule,
  AdaptModalModule 
} from '@bmc-ux/adapt-angular';

import { AdaptTableModule } from '@bmc-ux/adapt-table';
import { AdaptChartsModule } from '@bmc-ux/adapt-charts';

// Use in your component
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdaptRxTextfieldComponent,
    AdaptButtonModule,
    AdaptModalModule,
    AdaptTableModule,
    AdaptChartsModule
  ]
})
export class MyComponent {}
```

### 4. Build and Deploy

Follow the deployment process in `bmc-helix-innovation-studio.md`:
```bash
# Build frontend
npm run build

# Build and deploy
mvn clean install -Pdeploy -DskipTests
```

---

## Common Patterns

### Form with Validation
See: `bmc-ux-adapt-form-controls.md` > Form Validation section

### CRUD Table with Actions
See: `bmc-ux-adapt-table.md` > CRUD Table pattern

### Dashboard with Multiple Charts
See: `bmc-ux-adapt-charts.md` > Dashboard pattern

### Modal Form
See: `bmc-ux-adapt-ui-components.md` > Form in Modal pattern

---

## Best Practices

### Component Development
1. Use standalone components
2. Import only what you need
3. Follow ADAPT design system guidelines
4. Implement proper error handling
5. Add loading states

### Performance
1. Use virtual scrolling for large lists
2. Implement lazy loading
3. Use trackBy for ngFor
4. Optimize chart data
5. Debounce user input

### Accessibility
1. Provide ARIA labels
2. Ensure keyboard navigation
3. Test with screen readers
4. Use semantic HTML
5. Maintain color contrast

---

## Troubleshooting

### Component not showing
1. Check imports in module/component
2. Verify styles are imported
3. Clear browser cache
4. Rebuild and redeploy

### Styles not applied
1. Import `@bmc-ux/adapt-css/adapt.scss`
2. Check for CSS conflicts
3. Verify component selectors

### API errors
1. Check endpoint URLs
2. Verify headers (X-Requested-By)
3. Check field IDs
4. Review payload structure

---

## Additional Resources

- **BMC Documentation**: https://docs.bmc.com/xwiki/bin/view/Service-Management/Innovation-Suite/
- **Angular Documentation**: https://angular.io/docs
- **PrimeNG Documentation**: https://primeng.org/
- **D3.js Documentation**: https://d3js.org/

---

## Contributing

When updating these guides:
1. Maintain consistent formatting
2. Include code examples
3. Add troubleshooting tips
4. Update version numbers
5. Test all examples

---

## Document Structure

Each guide follows this structure:
1. **Overview** - Introduction and version info
2. **Installation** - Import and setup instructions
3. **Components** - Detailed component documentation
4. **Configuration** - Options and customization
5. **Examples** - Common use cases
6. **Best Practices** - Recommendations
7. **Troubleshooting** - Common issues and solutions

---

**Last Updated**: February 2, 2026  
**Documentation Version**: 1.0  
**Maintained by**: Development Team

---

## Quick Reference Card

### Essential Commands
```bash
# Build frontend
cd /workspace/sample-app/bundle/src/main/webapp && npm run build

# Deploy
cd /workspace/sample-app && mvn clean install -Pdeploy -DskipTests

# Generate component
npx nx g @helix/schematics:create-view-component --name="my-component" --project="com-mycompany-sample-app" --no-interactive
```

### Essential Imports
```typescript
// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Adapt Components
import { AdaptModule } from '@bmc-ux/adapt-angular';
import { AdaptTableModule } from '@bmc-ux/adapt-table';
import { AdaptChartsModule } from '@bmc-ux/adapt-charts';

// Styles
@import '@bmc-ux/adapt-css/adapt.scss';
```

### Essential APIs
```typescript
// DataPage API (Query)
POST /api/rx/application/datapage

// Record Instance API (CRUD)
POST /api/rx/application/record/recordinstance
PUT /api/rx/application/record/recordinstance/{id}
DELETE /api/rx/application/record/recordinstance/{id}
```
