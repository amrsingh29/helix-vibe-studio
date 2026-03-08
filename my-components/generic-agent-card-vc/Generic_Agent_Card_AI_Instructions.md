# AI Agent Instructions: Build Generic Agent Card View Component

## Task Overview

Build a **Generic Agent Card** view component for BMC Helix Innovation Studio that dynamically renders AI agent outputs based on a configuration record. The component should be fully reusable — one component that can display any agent's output (Planning, Advisory, Impact, etc.) by reading layout configuration from a record definition.

---

## Architecture Summary

The solution consists of:

1. **Configuration Record Definition** — stores card layout configurations (header, sections, theme)
2. **Generic Agent Card Component** — reads configuration + JSON data and renders dynamically
3. **Section Renderers** — sub-components that render specific section types (alert, repeatable list, stats row, etc.)
4. **Utility Services** — JSON path extraction and condition evaluation

---

## Part 1: Configuration Record Definition

### Record Definition Name
`AI Agent Card Configuration`

### Record Definition Fields

| Field ID | Field Name | Field Type | Required | Description |
|----------|------------|------------|----------|-------------|
| configName | Config Name | Text (100) | Yes | Unique name for this configuration (e.g., "Planning Agent Card") |
| description | Description | Text (500) | No | Description of what this card displays |
| themeColor | Theme Color | Selection | Yes | Primary accent color for the card |
| headerConfig | Header Configuration | Text (2000) | Yes | JSON string defining header layout |
| sectionsConfig | Sections Configuration | Text (10000) | Yes | JSON string defining sections array |
| isActive | Active | Boolean | Yes | Whether this configuration is available for use |

### Theme Color Selection Values

| Value | Display Label |
|-------|---------------|
| orange | Orange |
| blue | Blue |
| green | Green |
| red | Red |
| purple | Purple |
| cyan | Cyan |

### Header Configuration JSON Schema

```
{
  "title": string,           // Required - Card title
  "subtitle": string,        // Optional - Card subtitle
  "icon": string,            // Required - Adapt icon name
  "badgePath": string,       // Optional - JSON path to badge value
  "badgeColorPath": string   // Optional - JSON path to determine badge color
}
```

### Sections Configuration JSON Schema

Array of section objects. Each section has a `type` and type-specific configuration.

```
[
  { "type": "alert", ... },
  { "type": "repeatable", ... },
  { "type": "statsRow", ... },
  ...
]
```

---

## Part 2: Section Types Specification

The component must support the following section types:

### Section Type: `alert`

**Purpose:** Display a conditional alert banner (e.g., "2 Collisions Detected" or "No Collisions")

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| conditionPath | string | Yes | JSON path to boolean value for condition |
| trueMessage | string | Yes | Message when condition is true (supports ${path} placeholders) |
| falseMessage | string | Yes | Message when condition is false |
| trueSeverity | string | Yes | Severity when true: "success", "warning", "danger", "info" |
| falseSeverity | string | Yes | Severity when false |
| trueIcon | string | No | Icon when true (default based on severity) |
| falseIcon | string | No | Icon when false |
| showWhen | string | No | Condition expression to show/hide entire section |

---

### Section Type: `repeatable`

**Purpose:** Display a list of items from an array in the JSON data

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | string | Yes | Section title |
| dataPath | string | Yes | JSON path to array |
| showWhen | string | No | Condition expression to show/hide section |
| maxItems | number | No | Maximum items to display (default: 10) |
| emptyMessage | string | No | Message when array is empty |
| itemTemplate | object | Yes | Template for rendering each item |

**Item Template Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| primary | string | Yes | Primary text (supports ${field} placeholders) |
| secondary | string | No | Secondary text |
| badge | string | No | Badge text |
| badgeColorMap | object | No | Map values to colors (e.g., {"CI-level": "purple", "Time-window": "orange"}) |
| clickable | boolean | No | Whether item emits click event |
| clickEventPayload | object | No | Fields to include in click event payload |

---

### Section Type: `statsRow`

**Purpose:** Display 2-4 numeric/text metrics in a horizontal row

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| showWhen | string | No | Condition expression to show/hide section |
| items | array | Yes | Array of stat items (2-4 items) |

**Stat Item Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Label displayed below value |
| valuePath | string | Yes | JSON path to value |
| suffix | string | No | Suffix to append (e.g., "%", " min") |
| prefix | string | No | Prefix to prepend (e.g., "$") |
| colorThresholds | object | No | Numeric thresholds for coloring |
| defaultValue | string | No | Default if path returns null |

**Color Thresholds Object:**

```
{
  "green": 90,    // Value >= 90 shows green
  "yellow": 70,   // Value >= 70 shows yellow
  "red": 0        // Value < 70 shows red
}
```

---

### Section Type: `statusGrid`

**Purpose:** Display a grid of boolean status indicators (checkmarks/X icons)

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | string | Yes | Section title |
| showWhen | string | No | Condition expression to show/hide section |
| columns | number | No | Number of columns (default: 4) |
| items | array | Yes | Array of status items |

**Status Item Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Label displayed below icon |
| valuePath | string | Yes | JSON path to boolean value |
| trueIcon | string | No | Icon when true (default: "check-circle") |
| falseIcon | string | No | Icon when false (default: "x-circle") |
| trueColor | string | No | Color when true (default: "success") |
| falseColor | string | No | Color when false (default: "danger") |
| tooltip | string | No | Tooltip text (supports ${} placeholders) |

---

### Section Type: `gapsList`

**Purpose:** Display a warning box with a bulleted list of items

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | string | Yes | Section title (e.g., "Gaps Identified") |
| dataPath | string | Yes | JSON path to string array |
| showWhen | string | No | Condition expression (commonly: "path.length > 0") |
| severity | string | No | Severity: "warning", "danger", "info" (default: "warning") |
| icon | string | No | Icon name (default: "alert-triangle") |
| emptyBehavior | string | No | "hide" or "showMessage" (default: "hide") |
| emptyMessage | string | No | Message when array is empty |

---

### Section Type: `keyValue`

**Purpose:** Display simple label-value pairs

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | string | No | Optional section title |
| showWhen | string | No | Condition expression to show/hide section |
| layout | string | No | "vertical" or "horizontal" (default: "vertical") |
| items | array | Yes | Array of key-value items |

**Key-Value Item Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Label/key text |
| valuePath | string | Yes | JSON path to value |
| format | string | No | "text", "date", "datetime", "number" |
| defaultValue | string | No | Default if path returns null |

---

### Section Type: `progressBar`

**Purpose:** Display a visual progress indicator

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Label for the progress bar |
| valuePath | string | Yes | JSON path to current value |
| maxValuePath | string | No | JSON path to max value |
| maxValue | number | No | Static max value (default: 100) |
| showWhen | string | No | Condition expression to show/hide section |
| showPercentage | boolean | No | Show percentage text (default: true) |
| colorThresholds | object | No | Color thresholds based on percentage |

---

### Section Type: `divider`

**Purpose:** Visual separator between sections

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| showWhen | string | No | Condition expression to show/hide |
| style | string | No | "solid", "dashed", "dotted" (default: "solid") |
| spacing | string | No | "small", "medium", "large" (default: "medium") |

---

## Part 3: Generic Agent Card Component Specification

### Component Information

| Property | Value |
|----------|-------|
| Component Name | `generic-agent-card` |
| Component Type ID | `com-example-generic-agent-card` |
| Group | AI Agent Visuals |
| Icon | `credit-card` |
| Standalone | true |
| Change Detection | OnPush |

---

### Input Properties (Inspector Configuration)

#### Section: Data Source

| Property | Label | Type | Required | Description |
|----------|-------|------|----------|-------------|
| configRecordId | Card Configuration | Record picker (AI Agent Card Configuration) | Yes | Select which configuration record to use |
| dataRecordDefinition | Data Record Definition | RxDefinitionPicker | Yes | Record definition containing JSON data |
| dataFieldId | JSON Data Field | Field picker (Text fields only) | Yes | Field containing agent JSON output |
| recordInstanceId | Record Instance ID | rx-expression-input | No | Expression for record instance ID |
| jsonContent | Direct JSON Content | rx-expression-input | No | Direct JSON input (skips record fetch if provided) |

#### Section: Display Options

| Property | Label | Type | Default | Description |
|----------|-------|------|---------|-------------|
| showHeader | Show Header | checkbox | true | Display header section |
| showFooter | Show Footer | checkbox | true | Display footer with actions |
| compactMode | Compact Mode | checkbox | false | Reduced padding/spacing |
| overrideTitle | Override Title | text | (empty) | Override config title |
| overrideTheme | Override Theme | selection | (none) | Override config theme color |

---

### Output Events

| Event Name | Payload | Description |
|------------|---------|-------------|
| itemClicked | `{ sectionType: string, sectionIndex: number, item: any, data: any }` | Emitted when clickable item is clicked |
| viewFullDetails | `{ configName: string, recordInstanceId: string }` | Emitted when "View Full Details" clicked |
| refresh | `{ configName: string }` | Emitted when refresh button clicked |
| configLoaded | `{ success: boolean, configName?: string, error?: string }` | Emitted after configuration loads |
| dataLoaded | `{ success: boolean, error?: string }` | Emitted after JSON data loads |

---

### Data Loading Logic

Implement the following data loading sequence:

**Configuration Loading:**
1. Receive `configRecordId` input
2. Fetch configuration record using RecordService
3. Parse `headerConfig` and `sectionsConfig` JSON fields
4. Store parsed configuration in component state
5. Emit `configLoaded` event

**Data Loading:**
1. Check if `jsonContent` is provided and not empty
   - If yes: Parse JSON directly, skip record fetch
   - If no: Continue to step 2
2. Determine record instance ID:
   - Use `recordInstanceId` input if provided
   - Otherwise, get from record editor context if component is in editor
3. Fetch record instance using RecordService
4. Extract JSON string from configured field (`dataFieldId`)
5. Parse JSON string
6. Store parsed data in component state
7. Emit `dataLoaded` event

**Error Handling:**
- Invalid configuration JSON: Show error state with message
- Failed configuration fetch: Show error state with message
- Invalid data JSON: Show error state with message
- Failed data fetch: Show error state with message
- Missing required paths in data: Use defaults, don't error

---

### Rendering Logic

**Main Render Flow:**
1. If loading: Show loading spinner overlay
2. If error: Show error state with message
3. If no data: Show empty state
4. Otherwise:
   - Render header (if showHeader is true and headerConfig exists)
   - For each section in sectionsConfig array:
     - Evaluate `showWhen` condition (if present)
     - If condition passes (or no condition): Render section using appropriate renderer
     - If condition fails: Skip section
   - Render footer (if showFooter is true)

**Section Rendering:**
- Use switch/case based on section `type`
- Pass section configuration and JSON data to section renderer
- Each section renderer extracts its own data using configured paths

---

## Part 4: Utility Services Specification

### JSON Path Service

**Purpose:** Extract values from nested JSON objects using dot-notation paths

**Required Methods:**

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| getValue | (data: object, path: string, defaultValue?: any) | any | Get value at path, return default if not found |
| setValue | (data: object, path: string, value: any) | object | Set value at path (immutable, returns new object) |
| exists | (data: object, path: string) | boolean | Check if path exists and is not null/undefined |

**Path Format:**
- Dot notation: `collisions.details`
- Array access: `collisions.details[0].changeId`
- Support nested: `mopStatus.gaps`

**Placeholder Resolution:**
Implement a method to resolve `${path}` placeholders in strings:
- Input: `"${collisions.count} Collision(s) Detected"` + data object
- Output: `"2 Collision(s) Detected"`

---

### Condition Evaluator Service

**Purpose:** Evaluate simple condition expressions against JSON data

**Required Methods:**

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| evaluate | (expression: string, data: object) | boolean | Evaluate condition, return true/false |

**Supported Expression Patterns:**

| Pattern | Example | Description |
|---------|---------|-------------|
| Equals boolean | `collisions.detected === true` | Check if path equals true/false |
| Equals string | `status === "approved"` | Check if path equals string |
| Equals number | `count === 0` | Check if path equals number |
| Not equals | `status !== "rejected"` | Check if path not equals value |
| Greater than | `historical.successRate > 80` | Numeric comparison |
| Less than | `collisions.count < 5` | Numeric comparison |
| Greater than or equal | `score >= 90` | Numeric comparison |
| Less than or equal | `risk <= 3` | Numeric comparison |
| Array length | `mopStatus.gaps.length > 0` | Check array length |
| Exists/truthy | `mopStatus.present` | Check if path is truthy |
| Not exists/falsy | `!mopStatus.present` | Check if path is falsy |

**Important:** Do not use JavaScript `eval()`. Parse and evaluate expressions safely.

---

## Part 5: Section Renderer Sub-Components

Create separate sub-components for each section type. Each renderer should:

1. Accept section configuration as input
2. Accept JSON data as input
3. Use JSON Path Service to extract values
4. Use Condition Evaluator for any internal conditions
5. Emit events for interactive elements
6. Support theming via CSS custom properties

### Common Inputs for All Section Renderers

| Input | Type | Description |
|-------|------|-------------|
| config | object | Section configuration from sectionsConfig |
| data | object | Full JSON data object |
| theme | string | Theme color name |
| compact | boolean | Compact mode flag |

### Common Outputs for Interactive Section Renderers

| Output | Payload | Description |
|--------|---------|-------------|
| itemClick | `{ item: any, index: number }` | Emitted when item is clicked |

---

## Part 6: Styling Specification

### Theme Colors (CSS Custom Properties)

Each theme should define these CSS custom properties:

| Property | Description |
|----------|-------------|
| --card-accent-color | Primary accent color |
| --card-accent-light | Light variant (10% opacity) |
| --card-accent-border | Border color (20% opacity) |

### Base Color Palette

| Color Name | Hex Value | Usage |
|------------|-----------|-------|
| success | #059669 | Positive states, checkmarks |
| warning | #d97706 | Warning states, caution |
| danger | #dc2626 | Error states, failures |
| info | #3b82f6 | Informational states |
| text-primary | #ffffff | Primary text |
| text-secondary | #94a3b8 | Secondary text |
| text-muted | #64748b | Muted/disabled text |
| bg-card | #1e293b to #0f172a | Card background gradient |
| bg-section | rgba(255,255,255,0.02) | Section background |
| border-default | rgba(255,255,255,0.05) | Default borders |

### Theme Accent Colors

| Theme | Accent Color |
|-------|--------------|
| orange | #f97316 |
| blue | #3b82f6 |
| green | #10b981 |
| red | #ef4444 |
| purple | #8b5cf6 |
| cyan | #06b6d4 |

### Spacing Scale

Use consistent spacing based on 4px increments:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Compact Mode Adjustments

When compact mode is enabled:
- Reduce all padding by ~50%
- Use smaller font sizes
- Hide footer section
- Reduce icon sizes

---

## Part 7: Component File Structure

```
libs/ai-agent-visuals/src/lib/
├── components/
│   └── generic-agent-card/
│       ├── generic-agent-card.component.ts
│       ├── generic-agent-card.component.html
│       ├── generic-agent-card.component.scss
│       ├── generic-agent-card.types.ts
│       ├── generic-agent-card.module.ts
│       ├── design/
│       │   ├── generic-agent-card-design.component.ts
│       │   ├── generic-agent-card-design.model.ts
│       │   └── generic-agent-card-design-manager.service.ts
│       └── section-renderers/
│           ├── alert-section/
│           │   ├── alert-section.component.ts
│           │   ├── alert-section.component.html
│           │   └── alert-section.component.scss
│           ├── repeatable-section/
│           │   ├── repeatable-section.component.ts
│           │   ├── repeatable-section.component.html
│           │   └── repeatable-section.component.scss
│           ├── stats-row-section/
│           │   ├── stats-row-section.component.ts
│           │   ├── stats-row-section.component.html
│           │   └── stats-row-section.component.scss
│           ├── status-grid-section/
│           │   ├── status-grid-section.component.ts
│           │   ├── status-grid-section.component.html
│           │   └── status-grid-section.component.scss
│           ├── gaps-list-section/
│           │   ├── gaps-list-section.component.ts
│           │   ├── gaps-list-section.component.html
│           │   └── gaps-list-section.component.scss
│           ├── key-value-section/
│           │   ├── key-value-section.component.ts
│           │   ├── key-value-section.component.html
│           │   └── key-value-section.component.scss
│           ├── progress-bar-section/
│           │   ├── progress-bar-section.component.ts
│           │   ├── progress-bar-section.component.html
│           │   └── progress-bar-section.component.scss
│           └── divider-section/
│               ├── divider-section.component.ts
│               └── divider-section.component.scss
├── services/
│   ├── json-path.service.ts
│   └── condition-evaluator.service.ts
└── models/
    ├── card-configuration.model.ts
    ├── section-config.model.ts
    └── theme.model.ts
```

---

## Part 8: Design Component (View Designer)

### Design Component Behavior

The design-time component should:

1. Show a placeholder visualization representing the card
2. Display the selected configuration name
3. Show icons representing which section types are configured
4. Update preview when configuration selection changes
5. Show warning if no configuration is selected

### Inspector Organization

**Section 1: Card Configuration**
- Configuration record picker (required)

**Section 2: Data Source**
- Record definition picker
- Field picker (filtered to text fields)
- Record instance ID expression
- Direct JSON content expression

**Section 3: Display Options**
- Show header checkbox
- Show footer checkbox
- Compact mode checkbox
- Override title text field
- Override theme dropdown

---

## Part 9: Error States and Edge Cases

### Error States to Handle

| State | Display |
|-------|---------|
| No configuration selected | "Please select a card configuration" |
| Configuration fetch failed | "Unable to load card configuration" |
| Invalid configuration JSON | "Invalid configuration format" |
| No data source configured | "Please configure a data source" |
| Data fetch failed | "Unable to load data" |
| Invalid data JSON | "Invalid data format" |

### Edge Cases

| Case | Behavior |
|------|----------|
| Empty array in repeatable section | Show empty message or hide section based on config |
| Null value at JSON path | Use default value or show "-" |
| Missing section type | Log warning, skip section |
| Unknown theme color | Fall back to default (blue) |
| Very long text in stats | Truncate with ellipsis |
| Very long list in repeatable | Limit to maxItems, show "and X more" |

---

## Part 10: Accessibility Requirements

1. Use semantic HTML elements (headings, lists, buttons)
2. Add ARIA labels to icon-only buttons
3. Ensure color is not the only indicator (add icons/text)
4. Support keyboard navigation for interactive elements
5. Add role="button" and tabindex="0" to clickable items
6. Provide tooltips for status icons
7. Ensure sufficient color contrast (WCAG AA)

---

## Part 11: Testing Scenarios

### Configuration Loading

| Scenario | Expected Result |
|----------|-----------------|
| Valid configuration record | Config loads, card renders |
| Invalid configuration JSON | Error state shown |
| Missing configuration record | Error state shown |
| Configuration with all section types | All sections render correctly |
| Configuration with no sections | Card renders with header only |

### Data Loading

| Scenario | Expected Result |
|----------|-----------------|
| jsonContent provided | Uses direct JSON, skips fetch |
| recordInstanceId provided | Fetches from record |
| In record editor context | Gets ID from editor |
| No data source | Empty state shown |
| Invalid JSON in field | Error state shown |

### Section Rendering

| Scenario | Expected Result |
|----------|-----------------|
| showWhen condition true | Section visible |
| showWhen condition false | Section hidden |
| Empty array data | Section hidden or shows empty message |
| Missing path in data | Uses default, no error |
| All boolean values true | All green checkmarks |
| All boolean values false | All red X icons |
| Numeric value above threshold | Green color applied |
| Numeric value below threshold | Red color applied |

### Theme and Display

| Scenario | Expected Result |
|----------|-----------------|
| Orange theme | Orange accent colors |
| Compact mode | Reduced padding, no footer |
| Override title | Custom title shown |
| showHeader false | No header rendered |

---

## Part 12: Sample Configuration Records

### Sample 1: Planning Agent Card

**Config Name:** `Planning Agent Card`
**Theme Color:** `orange`

**Header Config:**
```json
{
  "title": "Change Planning",
  "subtitle": "Collision & Historical Analysis",
  "icon": "git-branch"
}
```

**Sections Config:**
```json
[
  {
    "type": "alert",
    "conditionPath": "collisions.detected",
    "trueMessage": "${collisions.count} Collision(s) Detected",
    "falseMessage": "No Collisions - Clear to proceed",
    "trueSeverity": "warning",
    "falseSeverity": "success",
    "trueIcon": "alert-octagon",
    "falseIcon": "check-circle"
  },
  {
    "type": "repeatable",
    "title": "Collision Details",
    "dataPath": "collisions.details",
    "showWhen": "collisions.detected === true",
    "itemTemplate": {
      "primary": "${changeId}",
      "badge": "${overlapType}",
      "secondary": "${window}",
      "badgeColorMap": {
        "CI-level": "purple",
        "Service-level": "blue",
        "Time-window": "orange",
        "Dependency": "pink"
      },
      "clickable": true,
      "clickEventPayload": {
        "changeId": "${changeId}"
      }
    }
  },
  {
    "type": "statsRow",
    "items": [
      {
        "label": "Success Rate",
        "valuePath": "historical.successRate",
        "suffix": "%",
        "colorThresholds": { "green": 90, "yellow": 70, "red": 0 }
      },
      {
        "label": "Similar Changes",
        "valuePath": "historical.similarChanges"
      },
      {
        "label": "Avg Duration",
        "valuePath": "historical.avgDuration"
      }
    ]
  },
  {
    "type": "statusGrid",
    "title": "MOP Status",
    "columns": 4,
    "items": [
      { "label": "Pre-checks", "valuePath": "mopStatus.preChecks" },
      { "label": "Steps", "valuePath": "mopStatus.steps" },
      { "label": "Rollback", "valuePath": "mopStatus.rollback" },
      { "label": "Monitoring", "valuePath": "mopStatus.monitoring" }
    ]
  },
  {
    "type": "gapsList",
    "title": "Gaps Identified",
    "dataPath": "mopStatus.gaps",
    "showWhen": "mopStatus.gaps.length > 0",
    "severity": "warning"
  }
]
```

---

### Sample 2: Advisory Agent Card

**Config Name:** `Advisory Agent Card`
**Theme Color:** `cyan`

**Header Config:**
```json
{
  "title": "Change Advisory",
  "subtitle": "Readiness Assessment",
  "icon": "shield",
  "badgePath": "recommendation",
  "badgeColorPath": "recommendation"
}
```

**Sections Config:**
```json
[
  {
    "type": "statsRow",
    "items": [
      {
        "label": "Readiness Score",
        "valuePath": "confidence",
        "suffix": "%",
        "colorThresholds": { "green": 80, "yellow": 60, "red": 0 }
      },
      {
        "label": "Evidence Complete",
        "valuePath": "evidenceCompleteCount",
        "suffix": "/7"
      }
    ]
  },
  {
    "type": "progressBar",
    "label": "Evidence Coverage",
    "valuePath": "evidenceCompleteCount",
    "maxValue": 7,
    "showPercentage": true
  },
  {
    "type": "gapsList",
    "title": "Conditions for Approval",
    "dataPath": "conditions",
    "showWhen": "conditions.length > 0",
    "severity": "warning",
    "icon": "alert-triangle"
  },
  {
    "type": "repeatable",
    "title": "Stakeholder Q&A",
    "dataPath": "stakeholderQA",
    "showWhen": "stakeholderQA.length > 0",
    "itemTemplate": {
      "primary": "${question}",
      "secondary": "${resolution}",
      "badge": "${answered}",
      "badgeColorMap": { "true": "green", "false": "yellow" }
    }
  }
]
```

---

### Sample 3: Impact Analysis Card

**Config Name:** `Impact Analysis Card`
**Theme Color:** `purple`

**Header Config:**
```json
{
  "title": "Impact Analysis",
  "subtitle": "CI & Service Impact Assessment",
  "icon": "target"
}
```

**Sections Config:**
```json
[
  {
    "type": "alert",
    "conditionPath": "blastRadius",
    "trueMessage": "${blastRadius} Blast Radius",
    "falseMessage": "Impact Unknown",
    "trueSeverity": "info",
    "falseSeverity": "warning"
  },
  {
    "type": "statsRow",
    "items": [
      { "label": "CIs Affected", "valuePath": "cisCount" },
      { "label": "Services", "valuePath": "servicesCount" },
      { "label": "Users Impacted", "valuePath": "totalUsersAffected" }
    ]
  },
  {
    "type": "repeatable",
    "title": "Impacted Services",
    "dataPath": "services",
    "itemTemplate": {
      "primary": "${name}",
      "badge": "${criticality}",
      "secondary": "${usersAffected} users",
      "badgeColorMap": { "High": "red", "Medium": "yellow", "Low": "gray" }
    }
  },
  {
    "type": "repeatable",
    "title": "Affected Configuration Items",
    "dataPath": "cis",
    "itemTemplate": {
      "primary": "${name}",
      "badge": "${type}",
      "secondary": "Criticality: ${criticality}"
    }
  }
]
```

---

## Final Checklist

Before considering complete, verify:

- [ ] Configuration Record Definition created with all fields
- [ ] Generic Agent Card component loads configuration from record
- [ ] All 8 section types render correctly
- [ ] JSON Path Service extracts nested values correctly
- [ ] Condition Evaluator handles all expression patterns
- [ ] Placeholder resolution works in messages and templates
- [ ] Theme colors apply correctly
- [ ] Compact mode reduces visual footprint
- [ ] Error states display appropriate messages
- [ ] Loading state shows spinner
- [ ] Events emit with correct payloads
- [ ] Design component shows preview in View Designer
- [ ] Inspector properties grouped and labeled correctly
- [ ] Accessibility requirements met
- [ ] All sample configurations render as expected

---

**End of Instructions**
