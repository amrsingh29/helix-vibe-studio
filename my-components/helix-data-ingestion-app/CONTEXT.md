# DataIngest Platform — Cursor Agent Context

> This file is the single source of truth for the AI agent building the DataIngest platform.
> Read this before writing any code. Reference `dataingest-v2.html` for visual layout.
> Reference `DataIngest_PRD.docx` for full functional requirements and acceptance criteria.

---

## Project Overview

DataIngest is a UI-driven, configurable data ingestion platform with two personas:

- **Admin** — creates import templates by uploading an Excel file, maps columns to DB fields, sets duplicate handling strategy, defines field-level validation rules, and publishes the template.
- **User (Data Custodian)** — browses published templates, downloads a blank Excel sheet, fills it, uploads it, reviews validation errors, and submits records to the database.

The platform is template-driven. All business logic (mappings, rules, dedup strategy) lives in the template configuration — the ingestion engine reads it at runtime. No hardcoded logic per template.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| State management | Zustand |
| File parsing (client-side) | SheetJS (`xlsx`) |
| Backend API | Node.js + Express |
| Database | PostgreSQL |
| File storage | S3-compatible (AWS S3 or MinIO) |
| Auth | JWT + role-based middleware |
| Testing | Vitest + React Testing Library |

### BMC Helix Innovation Studio delivery

For the **coded application** in this repo, the product UI is implemented with **Angular 18 + SCSS** as standalone view components (`data-ingest-admin/`, `data-ingest-user/`) registered via `RxViewComponentRegistryService`. Visual parity targets [`dataingest-v2.html`](dataingest-v2.html); see [`README.md`](README.md) for copy/deploy steps. Backend remains **Java @Action** + record APIs per platform—not Node/PostgreSQL.

---

## Design System

### Colour Tokens

Map these directly to Tailwind CSS custom colours in `tailwind.config.ts`.

```ts
colors: {
  bg:         '#f5f5f3',   // page background
  surface:    '#ffffff',   // card / modal surface
  surface2:   '#f9f9f8',   // subtle surface (table header, sidebar bg)
  surface3:   '#f2f2f0',   // hover state background
  border:     '#e4e4e0',   // default border
  border2:    '#d0d0ca',   // input border, stronger divider
  text1:      '#1a1a18',   // primary text
  text2:      '#5c5c58',   // secondary text
  text3:      '#9a9a94',   // muted / placeholder text
  accent:     '#4f46e5',   // indigo — primary accent (buttons, active nav, links)
  accentLt:   '#eeedfb',   // light indigo — active nav bg, callout bg, selected card bg
  accentMd:   '#c7c4f5',   // medium indigo — selected card border, avatar border
  green:      '#16a34a',
  greenLt:    '#dcfce7',
  red:        '#dc2626',
  redLt:      '#fee2e2',
  amber:      '#d97706',
  amberLt:    '#fef3c7',
  blue:       '#2563eb',
  blueLt:     '#dbeafe',
}
```

### Typography

```ts
fontFamily: {
  sans: ['Geist', 'sans-serif'],
  mono: ['DM Mono', 'monospace'],
  serif: ['Instrument Serif', 'serif'],
}
```

Usage rules:
- `font-sans` — all body text, labels, buttons, nav items
- `font-mono` — data values, IDs, field names, column headers, badges, stats labels
- `font-serif` — page titles, card titles, large stat numbers, modal titles
- Default body size: `text-sm` (13px)
- Table header labels: `text-[10px] uppercase tracking-widest font-mono`

### Spacing & Radius

```ts
borderRadius: {
  sm:  '4px',
  DEFAULT: '6px',   // --r: buttons, inputs, badges, small cards
  lg:  '10px',      // --r-lg: cards, modals, larger containers
  xl:  '14px',      // wizard modal, large overlay panels
}
```

- Card padding: `p-4` or `p-5`
- Section spacing: `mb-6` between major sections, `mb-4` between related elements
- Form field gap: `gap-4` in grid rows
- Table cell padding: `px-3.5 py-2.5`

### Shadows

```ts
boxShadow: {
  sm:  '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)',
  md:  '0 4px 12px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06)',
  lg:  '0 12px 32px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06)',
}
```

- Cards: `shadow-sm`
- Modals / wizard: `shadow-lg`
- Hover cards: `shadow-md`

---

## Component Patterns

### Buttons

```tsx
// Primary
<button className="bg-accent text-white text-sm font-semibold px-3.5 py-1.5 rounded border border-accent hover:bg-indigo-700 transition-colors">
  Label
</button>

// Default (secondary)
<button className="bg-surface text-text2 text-sm font-medium px-3.5 py-1.5 rounded border border-border2 hover:border-text3 hover:text-text1 transition-colors">
  Label
</button>

// Ghost
<button className="bg-transparent text-text2 text-sm font-medium px-3.5 py-1.5 rounded border border-transparent hover:bg-surface3 hover:border-border transition-colors">
  Label
</button>

// Small variant: px-2.5 py-1 text-xs
// Danger variant: bg-redLt text-red border-red/30
// Success variant: bg-greenLt text-green border-green/30
```

### Badges

```tsx
// Status badges — always font-mono text-[10px] font-semibold
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-greenLt text-green font-mono text-[10px] font-semibold">
  <span className="w-1.5 h-1.5 rounded-full bg-green" />
  Success
</span>

// Colour variants:
// Success:  bg-greenLt text-green
// Partial:  bg-amberLt text-amber
// Failed:   bg-redLt   text-red
// Live:     bg-greenLt text-green
// Draft:    bg-surface3 text-text2 border border-border
// Indigo:   bg-accentLt text-accent
// Blue:     bg-blueLt   text-blue
```

### Cards

```tsx
<div className="bg-surface border border-border rounded-lg shadow-sm">
  {/* Card header */}
  <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border">
    <h3 className="text-sm font-semibold text-text1 font-serif">Card Title</h3>
  </div>
  {/* Card body */}
  <div className="p-4">
    {/* content */}
  </div>
</div>
```

### Form Inputs

```tsx
// Text input
<input
  className="w-full bg-surface border border-border2 rounded px-3 py-2 text-sm text-text1 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-colors placeholder:text-text3"
/>

// Select
<select className="w-full bg-surface border border-border2 rounded px-3 py-2 text-sm text-text1 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 cursor-pointer appearance-none" />

// Form label
<label className="block text-[11px] font-semibold text-text2 mb-1.5 tracking-wide">
  Field Name <span className="text-red">*</span>
</label>

// Form hint
<p className="text-[11px] text-text3 mt-1">Hint text</p>
```

### Tables

```tsx
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead>
      <tr>
        <th className="text-[10px] font-mono font-medium text-text3 uppercase tracking-widest px-3.5 py-2.5 border-b border-border bg-surface2 text-left">
          Column
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-surface2 cursor-pointer transition-colors border-b border-border last:border-b-0">
        <td className="px-3.5 py-2.5 text-sm text-text2">Value</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Stat Cards

```tsx
<div className="bg-surface border border-border rounded-lg shadow-sm p-4">
  <div className="text-[10px] font-mono text-text3 uppercase tracking-widest mb-1.5">
    Label
  </div>
  <div className="font-serif text-3xl text-text1 leading-none">42</div>
  <div className="text-xs text-text3 mt-1.5">Sub-label</div>
</div>
// Highlighted variant: add border-accentMd, stat value uses text-accent
```

### Toggle Switch

```tsx
const Toggle = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    className={`relative w-8 h-4.5 rounded-full border transition-colors ${
      on ? 'bg-accent border-accent' : 'bg-border2 border-border2'
    }`}
  >
    <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all ${
      on ? 'left-[18px]' : 'left-0.5'
    }`} />
  </button>
)
```

### Upload Drop Zone

```tsx
<div
  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
  onDragLeave={() => setDragging(false)}
  onDrop={handleDrop}
  onClick={() => fileInputRef.current?.click()}
  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
    dragging ? 'border-accent bg-accentLt' : 'border-border2 bg-surface2 hover:border-accent hover:bg-accentLt'
  }`}
>
  <div className="text-3xl mb-2.5">⬆</div>
  <p className="text-sm font-semibold text-text1 mb-1">Drop your file here, or click to browse</p>
  <p className="text-xs text-text3">Supports .xlsx and .csv · Max 50MB</p>
  <input ref={fileInputRef} type="file" accept=".xlsx,.csv,.zip" className="hidden" />
</div>
```

---

## Layout Structure

### App Shell

```
app (flex, h-screen)
├── sidebar (w-56, bg-surface, border-r)
│   ├── brand (logo + version)
│   ├── persona-toggle (Admin / User)
│   ├── nav (scrollable)
│   └── user-chip (avatar + name + role)
└── main (flex-1, flex-col)
    ├── topbar (h-13, bg-surface, border-b, flex items-center)
    └── content (flex-1, overflow-y-auto, p-7, bg-bg)
```

### Sidebar Nav Item States

```tsx
// Default
className="flex items-center gap-2 px-2.5 py-1.75 rounded text-sm text-text2 font-medium hover:bg-surface3 hover:text-text1 transition-colors"

// Active
className="flex items-center gap-2 px-2.5 py-1.75 rounded text-sm text-accent font-semibold bg-accentLt"
```

---

## Admin Wizard Modal

The template creation wizard is a **modal overlay** (not a route), structured as:

```
modal-overlay (fixed inset-0, bg-black/45, flex items-center justify-center)
└── wizard (bg-surface, rounded-xl, w-full max-w-3xl, max-h-[90vh], flex flex-col, shadow-lg)
    ├── wizard-header (px-5 py-4, border-b, flex justify-between)
    ├── wizard-body (flex, flex-1, overflow-hidden)
    │   ├── steps-sidebar (w-44, bg-surface2, border-r, py-4)
    │   │   └── step items (num circle + label + connector line)
    │   └── panel (flex-1, overflow-y-auto, p-6)
    └── wizard-footer (px-5 py-3.5, border-t, bg-surface2, flex justify-between)
        ├── ← Previous button
        └── [Cancel] [Next → / Publish] buttons
```

### Wizard Step States

```tsx
// Incomplete
<div className="flex items-center gap-2.5 px-4 py-2.5">
  <span className="w-5.5 h-5.5 rounded-full border-1.5 border-border2 flex items-center justify-center text-[10px] font-bold font-mono text-text3">1</span>
  <span className="text-xs text-text2 font-medium">Upload file</span>
</div>

// Active
<div className="flex items-center gap-2.5 px-4 py-2.5 bg-accentLt">
  <span className="w-5.5 h-5.5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">1</span>
  <span className="text-xs text-accent font-semibold">Upload file</span>
</div>

// Done
<div className="flex items-center gap-2.5 px-4 py-2.5">
  <span className="w-5.5 h-5.5 rounded-full bg-greenLt border border-green flex items-center justify-center text-[10px] font-bold text-green">✓</span>
  <span className="text-xs text-green font-medium">Upload file</span>
</div>
```

### Step 2 Sub-tabs

Step 2 of the Admin wizard contains three sub-tabs rendered inside the panel:
- **Data mapping** (default active)
- **Duplicate han...** (truncated label)
- **Options**

```tsx
<div className="flex border-b border-border mb-5 -mx-6 px-6">
  {['Data mapping', 'Duplicate han...', 'Options'].map(tab => (
    <button
      key={tab}
      className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
        active === tab
          ? 'text-accent border-accent font-semibold'
          : 'text-text3 border-transparent hover:text-text1'
      }`}
    >
      {tab}
    </button>
  ))}
</div>
```

---

## Field Mapping Row Pattern

```tsx
// Used in Admin wizard Step 2 — Data mapping
<div className="grid grid-cols-[1fr_36px_1fr_32px] gap-2.5 items-center mb-2">
  {/* Source field — read-only chip from uploaded file */}
  <div className="bg-surface2 border border-border rounded px-3 py-2 text-xs font-mono text-text1">
    {sourceField}
  </div>

  {/* Arrow */}
  <div className="text-accent font-bold text-base text-center">→</div>

  {/* Target field — dropdown of DB fields */}
  <select className="form-select text-xs py-1.5 px-2.5">
    <option>Select target field</option>
    {targetFields.map(f => <option key={f}>{f}</option>)}
  </select>

  {/* Delete */}
  <button className="flex items-center justify-center p-1 rounded text-text3 hover:text-red hover:bg-redLt transition-colors">
    ×
  </button>
</div>
```

---

## Validation Rule Row Pattern

```tsx
// Used in Admin wizard Step 4
<div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_32px] gap-2.5 items-center mb-2">
  <select className="form-select text-xs py-1.5">/* Field */</select>
  <select className="form-select text-xs py-1.5">/* Rule type */</select>
  <input  className="form-input  text-xs py-1.5 font-mono">/* Value */</input>
  <select className="form-select text-xs py-1.5">/* On error */</select>
  <button className="delete-btn">×</button>
</div>
```

---

## Duplicate Handling Option Card

```tsx
<div
  onClick={() => setSelected(mode)}
  className={`flex items-start gap-3 p-3.5 border-[1.5px] rounded-lg cursor-pointer transition-all mb-2.5 ${
    selected === mode
      ? 'border-accent bg-accentLt'
      : 'border-border hover:border-accentMd hover:bg-accentLt'
  }`}
>
  {/* Radio indicator */}
  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
    selected === mode ? 'border-accent bg-accent' : 'border-border2'
  }`}>
    {selected === mode && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
  </div>
  <div>
    <p className="text-sm font-semibold text-text1">{label}</p>
    <p className="text-xs text-text3 mt-0.5">{description}</p>
  </div>
</div>
```

---

## User Upload Wizard — Step Progress Bar

```tsx
// Horizontal steps used in the User upload flow (not a modal, rendered inline)
<div className="flex items-center mb-7">
  {steps.map((step, i) => (
    <React.Fragment key={step.label}>
      {i > 0 && (
        <div className={`flex-1 h-px mx-2 ${i < currentStep ? 'bg-green' : 'bg-border'}`} />
      )}
      <div className="flex items-center gap-1.5">
        <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 ${
          i + 1 < currentStep ? 'bg-greenLt border-green text-green'
          : i + 1 === currentStep ? 'bg-accent border-accent text-white'
          : 'bg-surface border-border2 text-text3'
        }`}>
          {i + 1 < currentStep ? '✓' : i + 1}
        </span>
        <span className={`text-xs font-medium ${
          i + 1 < currentStep ? 'text-green'
          : i + 1 === currentStep ? 'text-accent font-semibold'
          : 'text-text3'
        }`}>{step.label}</span>
      </div>
    </React.Fragment>
  ))}
</div>
```

---

## Validation Error Row

```tsx
<div className="flex gap-2.5 items-start p-2.5 bg-redLt border border-red/20 rounded mb-1.5">
  <span className="text-[10px] font-mono font-bold text-red bg-red/10 border border-red/20 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
    Row {rowNumber}
  </span>
  <div>
    <p className="text-xs font-bold text-red">{columnName}</p>
    <p className="text-xs text-text2">{errorMessage}</p>
  </div>
</div>
```

---

## Validation Summary Bar

```tsx
<div className="flex gap-2.5 mb-5">
  <div className="flex-1 text-center p-3.5 rounded-lg bg-greenLt border border-green/30">
    <div className="font-serif text-2xl font-bold text-green">{validCount}</div>
    <div className="text-[10px] font-mono text-text3 uppercase tracking-wider mt-1">Valid rows</div>
  </div>
  <div className="flex-1 text-center p-3.5 rounded-lg bg-redLt border border-red/30">
    <div className="font-serif text-2xl font-bold text-red">{errorCount}</div>
    <div className="text-[10px] font-mono text-text3 uppercase tracking-wider mt-1">Errors</div>
  </div>
  <div className="flex-1 text-center p-3.5 rounded-lg bg-surface2 border border-border">
    <div className="font-serif text-2xl font-bold text-text1">{totalCount}</div>
    <div className="text-[10px] font-mono text-text3 uppercase tracking-wider mt-1">Total rows</div>
  </div>
</div>
```

---

## Template Card (User Catalogue)

```tsx
<div
  onClick={() => onSelect(template.id)}
  className={`relative bg-surface border-[1.5px] rounded-lg p-4.5 cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-px ${
    selected ? 'border-accent bg-accentLt' : 'border-border hover:border-accentMd'
  }`}
>
  {selected && (
    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs">✓</div>
  )}
  <div className="text-2xl mb-2.5">{template.icon}</div>
  <h3 className="text-sm font-bold text-text1 mb-1">{template.name}</h3>
  <p className="text-xs text-text3 leading-relaxed mb-3">{template.description}</p>
  <div className="flex gap-1.5 flex-wrap">
    <span className="badge-indigo">{template.cols} cols</span>
    <span className="badge-gray">{template.category}</span>
  </div>
</div>
```

---

## Persona Toggle (Sidebar)

```tsx
<div className="mx-3 my-2.5 flex bg-surface3 border border-border rounded p-0.5">
  {['Admin', 'User'].map(p => (
    <button
      key={p}
      onClick={() => setPersona(p)}
      className={`flex-1 py-1.5 text-xs rounded font-medium transition-all ${
        persona === p
          ? 'bg-surface text-accent font-semibold shadow-sm'
          : 'text-text2 hover:text-text1'
      }`}
    >
      {p}
    </button>
  ))}
</div>
```

---

## Data Model Quick Reference

```ts
// Core entities — implement as PostgreSQL tables

Template          { id, name, description, category, status, version, created_by, published_at }
TemplateColumn    { id, template_id, column_name, display_label, data_type, is_required, sort_order, target_table, target_field }
ValidationRule    { id, column_id, rule_type, rule_value, on_error, error_message }
DuplicateConfig   { id, template_id, strategy, key_fields: string[] }
Submission        { id, template_id, template_version, submitted_by, status, total_rows, success_rows, error_rows, note, submitted_at }
SubmissionError   { id, submission_id, row_number, column_name, rule_type, raw_value, error_message }

// Template status enum:    'draft' | 'published' | 'deprecated'
// Submission status enum:  'success' | 'partial' | 'failed'
// Duplicate strategy enum: 'generate-all' | 'generate-duplicates' | 'reject' | 'replace' | 'update'
// Rule type enum:          'required' | 'max-length' | 'min-value' | 'max-value' | 'decimal-places' | 'regex' | 'unique-in-file' | 'enum'
// On error enum:           'skip-row' | 'warn' | 'reject-all'
```

---

## File Structure (Recommended)

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DropZone.tsx
│   │   ├── FormInput.tsx
│   │   ├── Modal.tsx
│   │   ├── StatCard.tsx
│   │   ├── Table.tsx
│   │   └── Toggle.tsx
│   ├── admin/
│   │   ├── wizard/
│   │   │   ├── TemplateWizard.tsx       # modal wrapper + step router
│   │   │   ├── Step1UploadFile.tsx
│   │   │   ├── Step2DataMapping.tsx     # contains 3 sub-tabs
│   │   │   ├── Step2Tabs/
│   │   │   │   ├── MappingTab.tsx
│   │   │   │   ├── DuplicateTab.tsx
│   │   │   │   └── OptionsTab.tsx
│   │   │   ├── Step3DuplicateHandling.tsx
│   │   │   └── Step4ValidationOptions.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── TemplateList.tsx
│   │   └── SubmissionMonitor.tsx
│   └── user/
│       ├── UserDashboard.tsx
│       ├── upload/
│       │   ├── UploadWizard.tsx          # step router
│       │   ├── Step1ChooseTemplate.tsx
│       │   ├── Step2UploadValidate.tsx
│       │   └── Step3ConfirmSubmit.tsx
│       └── SubmissionHistory.tsx
├── store/
│   ├── personaStore.ts        # Admin | User persona switch
│   ├── wizardStore.ts         # Admin wizard step + form state
│   └── uploadStore.ts         # User upload wizard state
├── services/
│   ├── templateService.ts     # CRUD for templates
│   ├── submissionService.ts   # submit, history
│   └── fileParser.ts          # SheetJS parsing logic
├── types/
│   └── index.ts               # All TypeScript interfaces matching data model
└── pages/                     # If using React Router
    ├── AdminPage.tsx
    └── UserPage.tsx
```

---

## Key Implementation Rules

1. **Wizard is a modal** — never navigate away from the current page when opening the template wizard. Use a portal-mounted overlay.
2. **Template columns come from the uploaded file** — do not let admin type column names manually. Parse the Excel headers on upload and populate the source field dropdowns from the parsed result.
3. **Step 2 has sub-tabs, not separate wizard steps** — Data Mapping, Duplicate Handling, and Options are tabs within Step 2's panel, not separate steps in the sidebar.
4. **Validation runs client-side first** — use SheetJS to parse the user's uploaded file in-browser, then run all `ValidationRule` records for that template against each row before making any API call.
5. **Re-validate server-side before write** — never trust client-side validation alone. The ingestion API endpoint must re-run all rules.
6. **Submissions are immutable** — once submitted, a submission record cannot be edited. Only a new submission can be created.
7. **Users see only their own submissions** — enforce at the API query level with `WHERE submitted_by = current_user_id`.
8. **Template version is stamped on submission** — always store `template_version` on the `Submission` record at time of submit.
9. **Auto mapping is fuzzy string match** — compare source field names to target field names using normalised lowercase + Levenshtein distance or simple includes match. No AI API call needed.
10. **Light mode only** — no dark mode toggle. The design system is light mode. Do not add `dark:` Tailwind classes.

---

## Reference Files

| File | Purpose |
|---|---|
| `dataingest-v2.html` | Complete interactive UI mockup — match every screen to this |
| `DataIngest_PRD.docx` | Full PRD with user stories, acceptance criteria, and non-functional requirements |
| `CONTEXT.md` | This file — design tokens, component patterns, and implementation rules |
