# AI Agent Instructions: Build Change Planning Card View Component

## Task Overview

Build a **Change Planning Card** view component for BMC Helix Innovation Studio that visualizes AI agent outputs for change planning analysis. The component displays collision detection, historical analysis, and MOP (Method of Procedure) status in a visually appealing card format.

---

## Component Specifications

### Basic Information

| Property | Value |
|----------|-------|
| **Component Name** | `change-planning-card` |
| **Component Type ID** | `com-example-change-planning-card` |
| **Group** | AI Agent Visuals |
| **Icon** | `git-branch` |
| **Framework** | Angular 18.x with standalone components |
| **Styling** | SCSS with BMC Adapt design tokens |
| **Change Detection** | `ChangeDetectionStrategy.OnPush` |

---

## Data Source Configuration

### Record Definition Picker

| Setting | Value |
|---------|-------|
| Record definition picker? | **Yes** (inspector dropdown via `RxDefinitionPicker`) |
| Field selection? | **Yes** |
| Which field types to show? | **Text/Character only** (JSON is stored as flat text in a record field, e.g., worklog) |
| Single or multiple fields? | **Single** |
| Record instance ID source | View input param (name: `recordInstanceId`) **OR** Record editor context when placed on a Change Request form |
| Optional data source | ExpressionFormControl `jsonContent` — when provided, use as JSON string instead of record fetch. **When set, record fetch is skipped.** |

### Data Fetching Logic (Pseudocode)

```
IF jsonContent is provided and not empty THEN
    Parse jsonContent as JSON
    Use parsed data directly
ELSE IF recordInstanceId is available THEN
    Fetch record instance using RecordService
    Extract JSON from selected text field
    Parse JSON
    Use parsed data
ELSE IF component is in Record Editor context THEN
    Get record instance from editor context
    Extract JSON from selected text field
    Parse JSON
    Use parsed data
ELSE
    Show empty state / placeholder
END IF
```

---

## Input Properties (Design Model)

### Inspector Configuration

Create the following inspector sections and properties:

#### Section 1: Data Source

| Property Name | Label | Type | Required | Description |
|---------------|-------|------|----------|-------------|
| `recordDefinitionName` | Record Definition | `RxDefinitionPicker` (record definitions only) | Yes | Select the record definition containing the JSON data |
| `jsonFieldId` | JSON Field | Field picker (Text/Character fields only) | Yes | Select the field containing the JSON response |
| `recordInstanceId` | Record Instance ID | `rx-expression-input` | No | Expression to get record instance ID (e.g., `${view.params.recordInstanceId}` or `${recordEditor.recordInstance.id}`) |
| `jsonContent` | JSON Content (Direct) | `rx-expression-input` | No | Direct JSON string input. When provided, skips record fetch. |

#### Section 2: Display Options

| Property Name | Label | Type | Default | Description |
|---------------|-------|------|---------|-------------|
| `showCollisions` | Show Collisions | `checkbox` | `true` | Display collision analysis section |
| `showHistorical` | Show Historical | `checkbox` | `true` | Display historical analysis section |
| `showMopStatus` | Show MOP Status | `checkbox` | `true` | Display MOP status section |
| `compactMode` | Compact Mode | `checkbox` | `false` | Use condensed layout |
| `cardTitle` | Card Title | `text` | `"Change Planning"` | Override default card title |

---

## Output Events

| Event Name | Payload | Description |
|------------|---------|-------------|
| `collisionClicked` | `{ changeId: string, overlapType: string }` | Emitted when user clicks a collision item |
| `viewFullAnalysis` | `{ recordInstanceId: string }` | Emitted when user clicks "View Full Analysis" |
| `refresh` | `void` | Emitted when user clicks refresh button |
| `dataLoaded` | `{ success: boolean, data?: any, error?: string }` | Emitted after data fetch completes |

---

## Expected JSON Input Format

The component should parse JSON in the following structure. **Handle missing fields gracefully with defaults.**

```json
{
  "changeId": "CRQ-56789",
  "analysisTimestamp": "2025-12-26T14:30:00Z",
  
  "collisions": {
    "detected": true,
    "count": 2,
    "risk": "Moderate",
    "details": [
      {
        "changeId": "CRQ-56801",
        "overlapType": "CI-level",
        "affectedCi": "APP-WEB-CLUSTER",
        "window": "01:30-02:30 SGT",
        "recommendation": "Sequence database patch before JVM tuning"
      },
      {
        "changeId": "CRQ-56823",
        "overlapType": "Time-window",
        "affectedCi": "LB-PROD-01",
        "window": "00:00-01:00 SGT",
        "recommendation": "Confirm completion before proceeding"
      }
    ]
  },
  
  "historical": {
    "successRate": 100,
    "similarChanges": 4,
    "avgDuration": "17.75 min",
    "failureHistory": "None",
    "referencedChangeIds": ["CRQ-54201", "CRQ-52456", "CRQ-50789", "CRQ-48990"]
  },
  
  "mopStatus": {
    "present": true,
    "quality": "Good",
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": false,
    "gaps": [
      "Monitoring duration unspecified",
      "Escalation contact outdated"
    ]
  }
}
```

### Default Values (when fields are missing)

```typescript
const DEFAULTS = {
  collisions: {
    detected: false,
    count: 0,
    risk: 'None',
    details: []
  },
  historical: {
    successRate: 0,
    similarChanges: 0,
    avgDuration: 'N/A',
    failureHistory: 'None',
    referencedChangeIds: []
  },
  mopStatus: {
    present: false,
    quality: 'Unknown',
    preChecks: false,
    steps: false,
    rollback: false,
    monitoring: false,
    gaps: []
  }
};
```

---

## Visual Design Specification

### Card Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌──────┐                                                   🔄   │
│ │ Icon │  Change Planning                                       │
│ └──────┘  Collision & Historical Analysis                       │
├─────────────────────────────────────────────────────────────────┤
│ COLLISION ALERT                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ 2 Collision(s) Detected                                  │ │
│ │    Risk Level: Moderate                                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ OR                                                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✅ No Collisions - Clear to proceed                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ COLLISION DETAILS (if detected)                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CRQ-56801  [CI-level]                        01:30-02:30   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CRQ-56823  [Time-window]                     00:00-01:00   │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ HISTORICAL STATS                                                │
│ ┌─────────────┬─────────────┬─────────────┐                     │
│ │    100%     │      4      │  17.75 min  │                     │
│ │ Success Rate│Similar Chgs │ Avg Duration│                     │
│ └─────────────┴─────────────┴─────────────┘                     │
├─────────────────────────────────────────────────────────────────┤
│ MOP STATUS                                                      │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                                     │
│ │ ✅ │ │ ✅ │ │ ✅ │ │ ❌ │                                     │
│ │Pre-│ │Stps│ │Roll│ │Moni│                                     │
│ └────┘ └────┘ └────┘ └────┘                                     │
│                                                                 │
│ ⚠️ Gaps Identified:                                             │
│ • Monitoring duration unspecified                               │
│ • Escalation contact outdated                                   │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER (if not compactMode)                                     │
│ [ View Full Analysis → ]                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Color Scheme (Dark Theme)

| Element | Color | Hex/RGBA |
|---------|-------|----------|
| Card background | Dark gradient | `linear-gradient(135deg, #1e293b, #0f172a)` |
| Card border | Orange (theme) | `rgba(249, 115, 22, 0.2)` |
| Header background | Orange tint | `rgba(249, 115, 22, 0.1)` |
| Primary text | White | `#ffffff` |
| Secondary text | Slate | `#94a3b8` |
| Muted text | Dark slate | `#64748b` |
| Success color | Emerald | `#059669` |
| Warning color | Amber | `#d97706` |
| Danger color | Red | `#dc2626` |
| Orange (collisions) | Orange | `#f97316` |

### Collision Risk Color Mapping

| Risk Level | Alert Background | Text Color |
|------------|------------------|------------|
| High | `rgba(220, 38, 38, 0.1)` | `#dc2626` |
| Moderate | `rgba(249, 115, 22, 0.1)` | `#f97316` |
| Low | `rgba(217, 119, 6, 0.1)` | `#d97706` |
| None | `rgba(5, 150, 105, 0.1)` | `#059669` |

### Overlap Type Badge Colors

| Type | Background | Text |
|------|------------|------|
| CI-level | `rgba(168, 85, 247, 0.2)` | `#a855f7` (purple) |
| Service-level | `rgba(59, 130, 246, 0.2)` | `#3b82f6` (blue) |
| Time-window | `rgba(249, 115, 22, 0.2)` | `#f97316` (orange) |
| Dependency | `rgba(236, 72, 153, 0.2)` | `#ec4899` (pink) |

### Success Rate Color Thresholds

| Rate | Color |
|------|-------|
| ≥ 90% | Success (green) |
| 70-89% | Warning (amber) |
| < 70% | Danger (red) |

---

## BMC Adapt Components to Use

Import and use these Adapt components:

```typescript
import {
  AdaptCardModule,
  AdaptIconModule,
  AdaptBadgeModule,
  AdaptAlertModule,
  AdaptTooltipModule,
  AdaptSpinnerModule,
  AdaptButtonModule
} from '@bmc-ux/adapt-angular';
```

### Icon Names (from Adapt icon set)

| Purpose | Icon Name |
|---------|-----------|
| Card header | `git-branch` |
| Collision detected | `alert-octagon` |
| No collisions | `check-circle` |
| MOP check pass | `check-circle` |
| MOP check fail | `x-circle` |
| Gaps warning | `alert-triangle` |
| Refresh button | `refresh` |
| View details arrow | `chevron-right` |

---

## File Structure to Create

```
bundle/src/main/webapp/libs/ai-agent-visuals/src/lib/
├── components/
│   └── change-planning-card/
│       ├── change-planning-card.component.ts
│       ├── change-planning-card.component.html
│       ├── change-planning-card.component.scss
│       ├── change-planning-card.types.ts
│       ├── design/
│       │   ├── change-planning-card-design.component.ts
│       │   ├── change-planning-card-design.model.ts
│       │   └── change-planning-card-design-manager.service.ts
│       └── change-planning-card.module.ts
└── models/
    └── planning-analysis.model.ts
```

---

## Implementation Requirements

### 1. Runtime Component (`change-planning-card.component.ts`)

- Use `standalone: true`
- Use `ChangeDetectionStrategy.OnPush`
- Inject `RecordService` for fetching record data
- Inject `ChangeDetectorRef` for manual change detection
- Implement `OnInit` and `OnChanges` lifecycle hooks
- Handle all three data source scenarios (jsonContent, recordInstanceId, record editor context)
- Parse JSON safely with try-catch and fallback to defaults
- Expose computed getters for template bindings

### 2. Design Model (`change-planning-card-design.model.ts`)

- Use `RxDefinitionPicker` for record definition selection
- Filter field picker to show only Text/Character field types
- Implement `getInitialProperties()` with sensible defaults
- Implement `getInspectorConfig()` with two sections: "Data Source" and "Display Options"

### 3. Design Component (`change-planning-card-design.component.ts`)

- Show placeholder visualization in View Designer canvas
- Display selected record definition name
- Display which sections are enabled (Collisions, Historical, MOP)
- Use dashed orange border styling to indicate component boundaries

### 4. Registration Module (`change-planning-card.module.ts`)

- Register component with `RxViewComponentRegistryService`
- Define all input properties with types and defaults
- Define all output events

### 5. Styles (`change-planning-card.component.scss`)

- Use CSS custom properties (variables) for colors
- Support both normal and compact modes
- Ensure responsive behavior
- Match the dark theme color scheme specified above
- Use consistent spacing (8px grid)
- Add hover states for interactive elements

---

## Error Handling Requirements

1. **Invalid JSON**: If JSON parsing fails, display an error state with message "Invalid JSON format"
2. **Missing record**: If record fetch fails, display error state with message "Unable to load data"
3. **Empty data**: If data is empty/null, display placeholder state with message "No planning analysis available"
4. **Missing fields**: Use default values for any missing fields (never throw errors for missing optional fields)

---

## Accessibility Requirements

1. Add `role="button"` and `tabindex="0"` to clickable collision items
2. Handle keyboard navigation (Enter key to activate)
3. Use semantic heading elements (`<h3>` for card title)
4. Ensure sufficient color contrast (WCAG AA)
5. Add tooltips to MOP status icons explaining what each means
6. Use `aria-label` on icon-only buttons (refresh)

---

## Testing Scenarios

Ensure the component handles these scenarios correctly:

| Scenario | Expected Behavior |
|----------|-------------------|
| No collisions | Green success alert, no collision details list |
| 1 collision | Orange alert, one collision item |
| 5+ collisions | Orange alert, scrollable collision list |
| 100% success rate | Green colored percentage |
| 50% success rate | Red colored percentage |
| All MOP checks pass | 4 green check icons |
| All MOP checks fail | 4 red X icons |
| 3 MOP gaps | Amber warning box with 3 bullet points |
| 0 MOP gaps | No warning box displayed |
| Compact mode | Reduced padding, no footer |
| JSON from `jsonContent` input | Skips record fetch, parses directly |
| JSON from record field | Fetches record, extracts field, parses |
| Invalid JSON | Error state displayed |
| Loading state | Spinner overlay |

---

## Sample Test Data

### Scenario: Multiple Collisions with MOP Gaps

```json
{
  "changeId": "CRQ-56789",
  "collisions": {
    "detected": true,
    "count": 2,
    "risk": "Moderate",
    "details": [
      { "changeId": "CRQ-56801", "overlapType": "CI-level", "window": "01:30-02:30" },
      { "changeId": "CRQ-56823", "overlapType": "Time-window", "window": "00:00-01:00" }
    ]
  },
  "historical": {
    "successRate": 100,
    "similarChanges": 4,
    "avgDuration": "17.75 min"
  },
  "mopStatus": {
    "present": true,
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": false,
    "gaps": ["Monitoring duration unspecified", "Escalation contact outdated"]
  }
}
```

### Scenario: No Collisions, Perfect MOP

```json
{
  "changeId": "CRQ-12345",
  "collisions": {
    "detected": false,
    "count": 0,
    "risk": "None",
    "details": []
  },
  "historical": {
    "successRate": 95,
    "similarChanges": 12,
    "avgDuration": "22 min"
  },
  "mopStatus": {
    "present": true,
    "preChecks": true,
    "steps": true,
    "rollback": true,
    "monitoring": true,
    "gaps": []
  }
}
```

### Scenario: High Risk with Low Success Rate

```json
{
  "changeId": "CRQ-99999",
  "collisions": {
    "detected": true,
    "count": 4,
    "risk": "High",
    "details": [
      { "changeId": "CRQ-99001", "overlapType": "CI-level", "window": "02:00-03:00" },
      { "changeId": "CRQ-99002", "overlapType": "Service-level", "window": "02:30-04:00" },
      { "changeId": "CRQ-99003", "overlapType": "Dependency", "window": "01:00-02:00" },
      { "changeId": "CRQ-99004", "overlapType": "Time-window", "window": "02:00-02:30" }
    ]
  },
  "historical": {
    "successRate": 45,
    "similarChanges": 8,
    "avgDuration": "45 min"
  },
  "mopStatus": {
    "present": true,
    "preChecks": false,
    "steps": true,
    "rollback": false,
    "monitoring": false,
    "gaps": ["Missing pre-checks", "No rollback procedure", "No monitoring plan", "Outdated contact list"]
  }
}
```

---

## Final Checklist

Before considering the component complete, verify:

- [ ] Component renders correctly with all three data source methods
- [ ] All sections can be independently shown/hidden via properties
- [ ] Compact mode reduces visual footprint appropriately
- [ ] All output events fire correctly with proper payloads
- [ ] Error states display meaningful messages
- [ ] Loading state shows spinner overlay
- [ ] Design component shows correct placeholder in View Designer
- [ ] Inspector properties are grouped and labeled correctly
- [ ] RxDefinitionPicker filters to Text/Character fields only
- [ ] Colors match the specified design system
- [ ] Keyboard navigation works on interactive elements
- [ ] Tooltips appear on MOP status icons
- [ ] Component is registered with correct type ID and metadata

---

**End of Instructions**
