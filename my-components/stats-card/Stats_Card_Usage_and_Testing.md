# Stats Card — Usage & Testing Guide

## Overview

The **Stats Card** is a BMC Helix Innovation Studio view component that displays a compact card with:

- **Icon** — Driven by `type` (services, users, risk) or overridden via Icon Picker
- **Primary Number** — Large numeric metric
- **Title** — Bold label
- **Subtitle** — Muted summary (e.g. "2 Mission Critical · 3 High")

The component accepts **arbitrary JSON** — you map JSON keys to each display slot in the **Data Mapping** section of the inspector. No fixed schema is required.

---

## Data Sources

The component can receive data in two ways:

| Source | When Used | Configuration |
|--------|-----------|----------------|
| **JSON Content (Direct)** | When `jsonContent` is provided and non-empty | Expression binding (e.g. `${view.params.jsonContent}`) or constant JSON string |
| **Record Field** | When no `jsonContent` or when empty | Record Definition + JSON Field + Record Instance ID |

**Priority:** `jsonContent` takes precedence. When set, the record fetch is skipped.

---

## Data Mapping — How It Works

The Stats Card does **not** expect a fixed JSON shape. You map your JSON keys to display slots.

### Mapping Properties

| Slot | Property | Default | Description |
|------|----------|---------|-------------|
| Primary Number | `primaryNumberKey` | `primaryNumber` | JSON path for the main number |
| Title | `titleKey` | `title` | JSON path for the title text |
| Subtitle | `subtitleKey` | `subtitle` | JSON path for the subtitle (empty = hide subtitle) |
| Icon / Type | `typeKey` | `type` | JSON path for type (drives icon lookup; empty = default icon) |

**Dot notation** is supported for nested objects, e.g. `metrics.count`, `data.summary.total`.

---

## Sample JSON & Mapping Examples

### Example 1 — Standard Shape (Default Mapping)

Use when your JSON matches the default keys. No mapping changes needed.

**JSON Input:**
```json
{
  "type": "services",
  "primaryNumber": 6,
  "title": "Change Request",
  "subtitle": "2 Mission Critical · 3 High"
}
```

**Mapping:** (leave defaults)
- Primary Number Key: `primaryNumber`
- Title Key: `title`
- Subtitle Key: `subtitle`
- Type Key: `type`

**Result:** Primary = 6, Title = Change Request, Subtitle = 2 Mission Critical · 3 High, Icon = service_desk.

---

### Example 2 — Flat Arbitrary Shape

Use when your JSON has different key names.

**JSON Input:**
```json
{
  "detected": true,
  "count": 2,
  "risk": "Moderate"
}
```

**Mapping:**
| Slot | Key to enter |
|------|--------------|
| Primary Number Key | `count` |
| Title Key | `risk` |
| Subtitle Key | *(leave empty)* |
| Type Key | *(leave empty)* |

**Result:** Primary = 2, Title = Moderate, no subtitle, default icon.

---

### Example 3 — Nested Structure (Dot Notation)

Use when your JSON has nested objects.

**JSON Input:**
```json
{
  "status": "open",
  "metrics": {
    "affected": 12,
    "severity": "High",
    "summary": "5 Critical · 7 High · 0 Medium"
  }
}
```

**Mapping:**
| Slot | Key to enter |
|------|--------------|
| Primary Number Key | `metrics.affected` |
| Title Key | `metrics.severity` |
| Subtitle Key | `metrics.summary` |
| Type Key | `status` |

**Result:** Primary = 12, Title = High, Subtitle = 5 Critical · 7 High · 0 Medium, default icon (status "open" is not in type map).

---

### Example 4 — API / DataPage Response

Use when data comes from a DataPage or REST API.

**JSON Input:**
```json
{
  "category": "users",
  "payload": {
    "total": 42,
    "label": "Users Affected",
    "breakdown": "15 Critical · 27 High"
  }
}
```

**Mapping:**
| Slot | Key to enter |
|------|--------------|
| Primary Number Key | `payload.total` |
| Title Key | `payload.label` |
| Subtitle Key | `payload.breakdown` |
| Type Key | `category` |

**Result:** Primary = 42, Title = Users Affected, Subtitle = 15 Critical · 27 High, Icon = users.

---

### Example 5 — Minimal (Number + Title Only)

Use when you only need primary number and title.

**JSON Input:**
```json
{
  "value": 99,
  "description": "Pending Approvals"
}
```

**Mapping:**
| Slot | Key to enter |
|------|--------------|
| Primary Number Key | `value` |
| Title Key | `description` |
| Subtitle Key | *(leave empty)* |
| Type Key | *(leave empty)* |

**Result:** Primary = 99, Title = Pending Approvals, no subtitle, default icon.

---

## Type → Icon Lookup

When `typeKey` points to a value, the component maps it to an icon:

| Type Value | Icon |
|------------|------|
| `services` | service_desk |
| `users` | users |
| `risk` | exclamation_triangle |
| *(any other or missing)* | arrow_chart (default) |

**Override:** Use the **Icon** picker in the inspector to select a fixed icon. When set, it ignores the type-based lookup.

---

## How to Configure in View Designer

1. **Add the component** — From the palette, drag "Stats Card" (Helix Vibe Studio group) onto the canvas.
2. **Data Source** — Choose one:
   - **Record:** Select Record Definition → JSON Field → bind Record Instance ID (e.g. `${view.params.recordInstanceId}`).
   - **Direct JSON:** Bind "JSON Content (Direct)" to an expression that returns a JSON string (e.g. `${view.params.jsonContent}`).
3. **Data Mapping** — In the "Data Mapping" section, enter the JSON keys that match your data:
   - Primary Number Key (e.g. `count`, `primaryNumber`, `metrics.affected`)
   - Title Key (e.g. `risk`, `title`, `payload.label`)
   - Subtitle Key (e.g. `summary`, `subtitle`, `metrics.summary`) — leave empty to hide.
   - Type Key (e.g. `type`, `category`) — leave empty for default icon.
4. **Icon (optional)** — Use the Icon Picker to override the type-based icon.
5. **Styling (optional)** — Adjust colors, font sizes, card borders in the respective sections.

---

## Styling

| Section | Properties |
|---------|-------------|
| Card Styling | Background, Border Color, Border Radius, Box Shadow, Padding |
| Icon Styling | Background, Color, Font Size |
| Primary Number | Color, Font Size |
| Title | Color, Font Size |
| Subtitle | Color, Font Size |

All values use plain strings (e.g. `#FFFFFF`, `12px`). **Advanced:** Use "Style Config Override (JSON)" for a single JSON blob overriding all styles.

---

## setProperty Support

You can update the component at runtime via `setProperty`:

- `jsonContent` — Update JSON string
- `recordInstanceId` — Switch record context
- `primaryNumberKey`, `titleKey`, `subtitleKey`, `typeKey` — Change mapping
- `iconName` — Override icon
- Style props — `cardBackgroundColor`, `primaryNumberColor`, etc.

---

## Testing Checklist

- [ ] **Default mapping** — JSON with `primaryNumber`, `title`, `subtitle`, `type` works without mapping changes.
- [ ] **Arbitrary flat JSON** — Map `count` → primary, `risk` → title; verify display.
- [ ] **Nested JSON** — Use `metrics.affected`, `metrics.severity`; verify dot notation works.
- [ ] **Empty subtitle** — Leave subtitleKey empty; subtitle should not appear.
- [ ] **Direct JSON** — Use `jsonContent` expression; record fetch should be skipped.
- [ ] **Record field** — Store JSON in a text field; bind Record Instance ID; verify fetch.
- [ ] **Type icons** — Test `type: "services"`, `type: "users"`, `type: "risk"`; verify icons.
- [ ] **Icon override** — Set Icon in inspector; verify it overrides type-based icon.
- [ ] **Invalid JSON** — Pass invalid string; verify "Invalid or empty JSON" message.
- [ ] **Empty / no data** — Pass empty or null; verify "No data" message.
