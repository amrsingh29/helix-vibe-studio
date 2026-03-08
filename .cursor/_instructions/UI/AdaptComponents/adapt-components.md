# Adapt Components Overview

This document provides a quick overview of all available Adapt Angular components. Each component has detailed documentation in its respective file.

**Last Updated:** February 12, 2026

---

## Table of Contents

- [Buttons](#buttons)
- [Carousel](#carousel)
- [Charts](#charts)
- [Misc Components](#misc-components)
- [Reactive Form Controls](#reactive-form-controls)
- [Table & Data](#table--data)

---

## Buttons

### Button
Standard button component with multiple styles, sizes, and states. Supports icons, loading states, and various button types (primary, secondary, danger, etc.).

**[View Full Documentation](buttons/button.md)**

### Button Group
Groups multiple buttons together in a single component. Useful for toggle buttons, segmented controls, or related actions.

**[View Full Documentation](buttons/button-group.md)**

---

## Carousel

### Carousel (Image Carousel)
Slideshow component for images and mixed content (images, videos, etc.) with auto-play, navigation controls, and drag-and-drop support. Supports multiple slides with captions and indicators.

**[View Full Documentation](carousel/carousel.md)**

### Multi-Card Carousel
Displays multiple cards horizontally in a scrollable carousel. Perfect for product showcases, feature highlights, or content galleries. Supports auto-play, multiple themes, and custom card content.

**[View Full Documentation](carousel/multi-card.md)**

---

## Charts

### Area Graph
Displays quantitative values over time with filled areas under lines. Great for showing trends and volumes over time.

**[View Full Documentation](charts/area-graph.md)**

### Area Stacked Graph
Shows how different components contribute to a total over time with stacked filled areas. Useful for visualizing part-to-whole relationships across time.

**[View Full Documentation](charts/area-stacked-graph.md)**

### Dual Chart
Combines multiple chart types with two Y-axes for displaying data with different scales or units. Ideal for comparing metrics with different ranges.

**[View Full Documentation](charts/dual-chart.md)**

### Flow Chart
Visualizes directed graphs with nodes and edges, useful for workflows, processes, and hierarchical relationships. Based on ngx-graph with D3 curve support.

**[View Full Documentation](charts/flow-chart.md)**

### Heatmap
Matrix visualization where individual values are represented as colors. Perfect for displaying patterns, correlations, and concentrations in large datasets.

**[View Full Documentation](charts/heatmap.md)**

### Pie Chart
Circular chart divided into slices to illustrate proportional data. Supports both pie and donut (hollow center) modes. Ideal for showing percentage distributions.

**[View Full Documentation](charts/pie-chart.md)**

### Scatter Plot
Displays relationships between two variables using Cartesian coordinates. Each point represents a data item. Good for correlation analysis and pattern identification.

**[View Full Documentation](charts/scatter-plot.md)**

### Stacked Chart (Bar Chart)
Presents categorical data with stacked bars showing combined totals and individual contributions. Supports vertical and horizontal orientations.

**[View Full Documentation](charts/stacked-chart.md)**

### Treemap
Displays hierarchical data as nested rectangles where size is proportional to data values. Excellent for visualizing large hierarchical datasets and part-to-whole relationships.

**[View Full Documentation](charts/treemap.md)**

---

## Misc Components

### Accordion
Collapsible content sections with titles. When collapsed, only the title is visible. Supports single or multiple open sections, drag-and-drop reordering, and auto-scroll.

**[View Full Documentation](misc/accordion.md)**

### Code Viewer
Syntax-highlighted code display with line numbers, copy functionality, and support for multiple programming languages. Perfect for documentation and code examples.

**[View Full Documentation](misc/code-viewer.md)**

### Progress
Progress bars for tracking task completion. Supports single and multi-bar modes, animations, striped patterns, segmented progress, and clickable segments with callbacks.

**[View Full Documentation](misc/progress.md)**

### QR Code Scanner
Scans QR codes using device camera or uploaded images. Supports multiple cameras, continuous scanning mode, and various barcode formats.

**[View Full Documentation](misc/qr-code-scanner.md)**

### Steps
Displays a sequence of steps in a process with numbered or labeled indicators. Commonly used for wizards, multi-step forms, or progress tracking. Supports horizontal and vertical layouts.

**[View Full Documentation](misc/steps.md)**

### Tooltip
Displays informative text on hover, focus, or tap. Provides contextual help without cluttering the interface. Supports multiple placements and custom templates.

**[View Full Documentation](misc/tooltip.md)**

---

## Reactive Form Controls

All reactive form controls support both template-driven and reactive forms, with consistent properties like labels, validation, tooltips, and accessibility features.

### Dropdown
Exposes a list of options or controls from a trigger element. Use for complex options beyond simple selection. Supports multiple placements and auto-close behaviors.

**[View Full Documentation](reactive-form/dropdown.md)**

### Checkbox
Allows users to select one or more options. Supports checked, unchecked, and indeterminate states. Includes label, sub-label, and tooltip support.

**[View Full Documentation](reactive-form/rx-checkbox.md)**

### Counter
Numeric input with increment/decrement buttons. Supports min/max values, step configuration, and direct input. Perfect for quantity selection.

**[View Full Documentation](reactive-form/rx-counter.md)**

### DateTime
Date and time picker with calendar interface. Supports date-only, time-only, or combined modes. Includes min/max date restrictions and customizable formats.

**[View Full Documentation](reactive-form/rx-datetime.md)**

### List Builder
Dual-list interface for selecting items from available list and moving to selected list. Supports search, sorting, and drag-and-drop. Ideal for user/role assignments.

**[View Full Documentation](reactive-form/rx-list-builder.md)**

### List Selector
Scrollable list for selecting one or multiple items. Supports search, custom templates, and keyboard navigation. Great for option selection from lists.

**[View Full Documentation](reactive-form/rx-list-selector.md)**

### Radio Button
Mutually exclusive selection within a group. Use radio button group component with individual radio button options. Supports any value type.

**[View Full Documentation](reactive-form/rx-radiobutton.md)**

### Rating
Star/icon-based rating input. Supports configurable maximum rating value, half-star display, and readonly mode for showing ratings.

**[View Full Documentation](reactive-form/rx-rating.md)**

### Search
Text input optimized for search with built-in search icon and clear button. Supports debounce to limit API calls. Emits search and clear events.

**[View Full Documentation](reactive-form/rx-search.md)**

### Select
Dropdown selection with single and multiple modes. Supports searchable options, grouped options, custom formatters, and clearable selection.

**[View Full Documentation](reactive-form/rx-select.md)**

### Switch
Toggle control for binary on/off states. Visual switch alternative to checkbox. Perfect for settings and feature toggles.

**[View Full Documentation](reactive-form/rx-switch.md)**

### TextArea
Multi-line text input with character counter, auto-resize, and validation support. Configurable rows and max length.

**[View Full Documentation](reactive-form/rx-textarea.md)**

### TextField
Single-line text input supporting various types (text, password, email, number, tel, url). Includes password visibility toggle, prefix/suffix icons, and validation.

**[View Full Documentation](reactive-form/rx-textfield.md)**

### Uploader
File upload with drag-and-drop support. Supports multiple files, file type validation, size limits, and preview. Perfect for document and image uploads.

**[View Full Documentation](reactive-form/rx-uploader.md)**

---

## Table & Data

### Table
Comprehensive data table with sorting, filtering, pagination, row selection, column reordering, and export capabilities. Supports both client-side and server-side data processing. Highly customizable with templates.

**[View Full Documentation](table/table.md)**

### Advanced Filter
Visual filter builder for creating complex filter expressions. Supports multiple field types, saved filters, AND/OR logic, and expression editing. Perfect for advanced search and data filtering.

**[View Full Documentation](table/advanced-filter.md)**

### Empty State
Placeholder component for no-data scenarios. Displays icon, text, and optional actions. Multiple icon types for different contexts (no data, no results, error, etc.). Supports different sizes and inverted mode.

**[View Full Documentation](table/empty-state.md)**

---

## Quick Reference by Use Case

### Form Building
- **Text Input**: [TextField](reactive-form/rx-textfield.md), [TextArea](reactive-form/rx-textarea.md), [Search](reactive-form/rx-search.md)
- **Selection**: [Select](reactive-form/rx-select.md), [Radio Button](reactive-form/rx-radiobutton.md), [Checkbox](reactive-form/rx-checkbox.md)
- **Date/Time**: [DateTime](reactive-form/rx-datetime.md)
- **Lists**: [List Builder](reactive-form/rx-list-builder.md), [List Selector](reactive-form/rx-list-selector.md)
- **Files**: [Uploader](reactive-form/rx-uploader.md)
- **Numbers**: [Counter](reactive-form/rx-counter.md), [Rating](reactive-form/rx-rating.md)
- **Toggles**: [Switch](reactive-form/rx-switch.md), [Checkbox](reactive-form/rx-checkbox.md)

### Data Visualization
- **Tables**: [Table](table/table.md)
- **Graphs**: [Area Graph](charts/area-graph.md), [Area Stacked Graph](charts/area-stacked-graph.md), [Scatter Plot](charts/scatter-plot.md)
- **Charts**: [Pie Chart](charts/pie-chart.md), [Stacked Chart](charts/stacked-chart.md), [Dual Chart](charts/dual-chart.md)
- **Specialized**: [Heatmap](charts/heatmap.md), [Treemap](charts/treemap.md), [Flow Chart](charts/flow-chart.md)

### Navigation & Layout
- **Carousels**: [Carousel](carousel/carousel.md), [Multi-Card](carousel/multi-card.md)
- **Steps**: [Steps](misc/steps.md)
- **Accordion**: [Accordion](misc/accordion.md)

### User Feedback
- **Progress**: [Progress](misc/progress.md)
- **Empty State**: [Empty State](table/empty-state.md)
- **Tooltip**: [Tooltip](misc/tooltip.md)

### Actions
- **Buttons**: [Button](buttons/button.md), [Button Group](buttons/button-group.md)
- **Dropdown**: [Dropdown](reactive-form/dropdown.md)

### Filtering & Search
- **Search**: [Search](reactive-form/rx-search.md)
- **Advanced Filter**: [Advanced Filter](table/advanced-filter.md)

### Utilities
- **Code Display**: [Code Viewer](misc/code-viewer.md)
- **QR Codes**: [QR Code Scanner](misc/qr-code-scanner.md)

---

## Component Counts by Category

- **Buttons**: 2 components
- **Carousel**: 2 components
- **Charts**: 9 components
- **Misc Components**: 6 components
- **Reactive Form Controls**: 14 components
- **Table & Data**: 3 components

**Total: 36 Adapt Components**

---

## Import Packages

Most components are imported from:
- `@bmc-ux/adapt-angular` - Core Adapt components
- `@bmc-ux/adapt-charts` - Chart components
- `@bmc-ux/adapt-table` - Table component

Refer to individual component documentation for specific import statements.

