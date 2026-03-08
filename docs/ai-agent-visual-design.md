# AI Change Agent — Visual Design Document

> **Purpose:** Transform conversational AI agent outputs into visually appealing, scannable UIs for Change Planning, Change Advisory (Approval), Change Worker Assistant, and Impact Analysis agents.

**Version:** 1.0.0  
**Last Updated:** 2025-03-05  
**References:** `my-change-ai-agent/`, `cookbook/05-adapt-components.md`

---

## 1. Overview

### 1.1 Current State vs. Target

| Current | Target |
|---------|--------|
| Agent output shown as plain text in chat windows | Structured, card-based layouts with icons, badges, and hierarchy |
| Long prose paragraphs | Scannable sections, expandable accordions, labeled sections |
| Risk/readiness buried in text | Visual indicators: gauges, badges, color-coded status |
| MOP steps as long list | Steps component with progress, checkboxes |
| Collision info hard to spot | Dedicated callout/card with clear risk level |

### 1.2 Design Principles

- **Evidence-first:** Every visual element maps to structured agent output (JSON)
- **Scannable:** Key decisions (readiness, recommendation, go/no-go) visible at a glance
- **Expandable:** Detail on demand via accordions; summary always visible
- **Consistent:** Same Adapt components, color scheme, typography across agents
- **Actionable:** Clear CTAs (Generate MOP, Proceed, etc.) where relevant

### 1.3 Technology Stack

| Layer | Technology |
|-------|------------|
| UI Framework | Angular 18, BMC Adapt components (`@bmc-ux/adapt-angular`, `@bmc-ux/adapt-charts`, `@bmc-ux/adapt-table`) |
| Components | Cards, Accordion, Steps, Progress, Table, Badges, Buttons |
| Data | JSON from agent API / worklog field (see Section 6) |

---

## 2. Agent-to-Visual Mapping Summary

| Agent | Primary View | Key Visual Components |
|-------|-------------|------------------------|
| **Change Planning** | Planning Dashboard | Readiness gauge, Collision card, MOP coverage checklist, Historical table |
| **Change Advisory** | Approval Summary | Recommendation badge, Evidence cards, Q&A accordion, Conditions checklist |
| **Change Worker Assistant** | Execution Companion | Pre-check list, MOP Steps, Go/No-Go panel, Service health card |
| **Impact Analysis** | Impact Explorer | CI → Service tree, Criticality badges, Risk indicators |

---

## 3. Change Planning Agent — Visual Design

### 3.1 Data Structure (Target JSON)

```json
{
  "changeId": "CRQ-56789",
  "changeSummary": "Oracle Database Critical Security Patch - July 2025 CPU",
  "changeContext": {
    "changeType": "Standard - Database Patch",
    "window": "2025-12-29 01:00 - 04:00 SGT",
    "primaryCIs": ["DB-PROD-ORA-01", "DB-PROD-ORA-02"],
    "servicesImpacted": ["Customer Self-Service Portal", "Mobile App Backend API"],
    "estimatedUserImpact": "~500 concurrent users"
  },
  "collision": {
    "detected": true,
    "riskLevel": "moderate",
    "count": 2,
    "collidingChanges": [
      { "id": "CRQ-56801", "overlap": "1 hour", "sharedService": "Customer Portal" },
      { "id": "CRQ-56823", "overlap": "30 min", "sharedService": "Customer Portal" }
    ]
  },
  "readiness": "conditionally_ready",
  "mopStatus": {
    "present": true,
    "source": "manual",
    "coverage": { "preChecks": true, "steps": true, "rollback": true, "monitoring": false }
  },
  "historicalSummary": { "found": 4, "successRate": 100, "avgExecution": "17.75 min" },
  "nextAction": "generate_mop"
}
```

### 3.2 UI Wireframe — Change Planning Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CHANGE PLANNING ANALYSIS — CRQ-56789                                                    │
│  Oracle Database Critical Security Patch - July 2025 CPU                                  │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐  ┌──────────────────────────────────────────────┐
│  READINESS                           │  │  COLLISION & CONFLICT                         │
│  ┌────────────────────────────────┐  │  │  ┌────────────────────────────────────────┐   │
│  │     CONDITIONALLY READY        │  │  │  │  ⚠ MODERATE RISK — 2 overlapping       │   │
│  │  ┌─────┐                       │  │  │  │     changes detected                   │   │
│  │  │ ● ● │  Ready / Cond / Not   │  │  │  │                                        │   │
│  │  │  ○  │  [gauge: 70%]        │  │  │  │  CRQ-56801  1h overlap  Customer Portal │   │
│  │  └─────┘                       │  │  │  │  CRQ-56823  30m overlap  Customer Portal│   │
│  └────────────────────────────────┘  │  │  └────────────────────────────────────────┘   │
└──────────────────────────────────────┘  └──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CHANGE CONTEXT                                              [expand ▼]                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  Type: Standard - Database Patch    Window: 2025-12-29 01:00-04:00 SGT                    │
│  CIs: DB-PROD-ORA-01, DB-PROD-ORA-02                                                     │
│  Services: Customer Portal, Mobile App Backend API    Users: ~500                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  MOP COVERAGE                                              [expand ▼]                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  Pre-checks    [✓]  Sequenced steps [✓]  Rollback [✓]  Monitoring [✗]                    │
│  Source: Manual   Evidence: CRQ-54201                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  HISTORICAL RISK                               [expand ▼]                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  4 similar changes  100% success   Avg 17.75 min                                          │
│  CRQ-54201 | CRQ-52456 | CRQ-50789 | CRQ-48990                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  RECOMMENDED NEXT ACTION                                                                  │
│  Would you like me to generate an AI-backed MOP from historical executions?              │
│  ┌────────────────────┐  ┌────────────────┐                                              │
│  │  Generate MOP      │  │  No, thanks    │                                              │
│  └────────────────────┘  └────────────────┘                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Adapt Component Mapping — Change Planning

| Section | Adapt Component | Notes |
|---------|-----------------|-------|
| Readiness gauge | `adapt-progress` (segmented) or custom badge | Green/amber/red; show text "Ready", "Conditionally Ready", "Not Ready" |
| Collision card | Card + `adapt-button` (danger/primary) | Callout styling; list colliding CRQs in table or list |
| Change context | `adapt-accordion` item | Collapsible; label-value pairs |
| MOP coverage | Custom layout + icons | Check/uncheck icons per dimension |
| Historical | `adapt-table` or simple list | CRQ IDs, dates, outcomes |
| Next action | `adapt-button` (primary, secondary) | "Generate MOP" / "No, thanks" |

---

## 4. Change Advisory Agent — Visual Design

### 4.1 Data Structure (Target JSON)

```json
{
  "changeId": "CR-45892",
  "readiness": "high",
  "recommendation": "approve_with_conditions",
  "evidenceSnapshot": {
    "impact": { "summary": "...", "peakExposure": "None" },
    "risk": { "summary": "...", "mitigation": "Lab validation completed" },
    "mopQuality": { "validated": true, "steps": 24, "rollback": true },
    "schedule": { "window": "...", "conflicts": [] },
    "vendorReadiness": { "onSite": "John Tan", "escalation": "Sarah Lim" },
    "postChangeMonitoring": { "defined": true, "duration": "2 hours" },
    "historicalContext": { "similar": 12, "successful": 11 }
  },
  "stakeholderQA": [
    { "question": "What's the impact if firmware upgrade fails?", "answer": "Router boot to previous firmware...", "resolved": true }
  ],
  "keyRisks": ["Vendor arrival time not confirmed"],
  "conditions": [
    { "text": "Confirm John Tan arrival by 01:30 SGT", "owner": "Change Coordinator", "by": "2025-12-27 18:00" }
  ],
  "confidence": "high"
}
```

### 4.2 UI Wireframe — Approval Summary

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CHANGE APPROVAL READINESS — CR-45892                                                     │
│  Router Firmware Upgrade                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐  ┌──────────────────────────────────────────────┐
│  RECOMMENDATION                      │  │  OVERALL READINESS                           │
│  ┌────────────────────────────────┐  │  │  ┌────────────────────────────────────────┐   │
│  │  APPROVE WITH CONDITIONS       │  │  │  │  High                                 │   │
│  │  [badge - primary/amber]       │  │  │  │  ████████░░ 80%                      │   │
│  └────────────────────────────────┘  │  │  └────────────────────────────────────────┘   │
└──────────────────────────────────────┘  └──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  EVIDENCE SNAPSHOT                                        [accordion - multiselect]     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ▼ Impact      │ Affected: 4 core routers. Minimal customer impact. Peak: None.          │
│  ▼ Risk        │ Firmware compatibility mitigated. Lab validated. Rollback ready.       │
│  ▼ MOP Quality │ 24 steps, validated. Rollback documented.                               │
│  ▼ Schedule    │ 02:00-05:00 SGT. No IPTV/blackout conflicts.                            │
│  ▼ Vendor      │ Cisco (John Tan) on-site. Escalation: Sarah Lim.                       │
│  ▼ Monitoring  │ 2h post-implementation. KPIs defined.                                   │
│  ▼ Historical  │ 12 similar, 11 successful.                                             │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  STAKEHOLDER Q&A                                 [expand ▼]                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  Q: What's the impact if firmware upgrade fails mid-process?                             │
│  A: Router will boot to previous firmware. Recovery 8-12 min. Redundant paths.  [✓]     │
│  Q: Has this firmware been tested in our environment?                                    │
│  A: Yes, 72h lab test. All protocols stable.                              [✓]            │
│  Open: None                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CONDITIONS FOR APPROVAL                                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ☐ Confirm John Tan arrival by 01:30 SGT — Change Coordinator by 2025-12-27 18:00     │
│  ☐ Notify NOC of maintenance window — Change Owner by 2025-12-28 01:00                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CONFIDENCE: High. All critical dimensions show strong evidence.                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Adapt Component Mapping — Change Advisory

| Section | Adapt Component | Notes |
|---------|-----------------|-------|
| Recommendation | Badge (custom or styled `span`) | Approve / Approve with Conditions / Defer / Reject — color-coded |
| Readiness | `adapt-progress` | Single bar with percentage |
| Evidence snapshot | `adapt-accordion` | One item per dimension; multiselect for compare |
| Stakeholder Q&A | `adapt-accordion` or list | Q/A pairs; resolved icon |
| Conditions | Checkbox list (rx-checkbox) or custom | Owner + deadline |
| Confidence | Plain text callout | Muted background |

---

## 5. Change Worker Assistant — Visual Design

### 5.1 Data Structure (Target JSON)

```json
{
  "changeId": "CRQ-67890",
  "phase": "pre_execution",
  "preChecks": [
    { "id": "1", "label": "Backup verification", "status": "passed", "detail": "RMAN backup COMPLETED" },
    { "id": "2", "label": "Service health baseline", "status": "passed", "detail": "Healthy, 120ms" },
    { "id": "3", "label": "Active event check", "status": "passed", "detail": "No active events" }
  ],
  "mopSteps": [
    { "id": 1, "label": "Verify flash space", "status": "completed" },
    { "id": 2, "label": "Backup config", "status": "in_progress" },
    { "id": 3, "label": "Copy new IOS to flash", "status": "pending" }
  ],
  "canProceed": true,
  "proceedReason": "Service health stable, no active events. Safe to proceed.",
  "serviceHealth": { "status": "healthy", "responseTime": "120ms", "errorRate": "0.02%" },
  "activeEvents": []
}
```

### 5.2 UI Wireframe — Execution Companion

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  EXECUTION COMPANION — CRQ-67890                                                         │
│  Oracle Database Patch                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐  ┌──────────────────────────────────────────────┐
│  CAN I PROCEED?                      │  │  SERVICE HEALTH                               │
│  ┌────────────────────────────────┐  │  │  ┌────────────────────────────────────────┐   │
│  │  ✓ YES — SAFE TO PROCEED      │  │  │  │  Healthy   120ms   0.02% error          │   │
│  │  [green callout]              │  │  │  │  No active events                        │   │
│  └────────────────────────────────┘  │  │  └────────────────────────────────────────┘   │
└──────────────────────────────────────┘  └──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  PRE-IMPLEMENTATION CHECKLIST                                                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ☑ Backup verification       RMAN backup COMPLETED                                      │
│  ☑ Service health baseline    Healthy, 120ms                                           │
│  ☑ Active event check         No active events                                          │
│  ☐ Standby sync check         [Run when ready]                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  MOP STEPS                                                                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  (1) Verify flash space          ✓ Completed                                             │
│  (2) Backup config               ● In progress                                           │
│  (3) Copy new IOS to flash       ○ Pending                                                │
│  (4) Configure boot system       ○ Pending                                                │
│  (5) Schedule reload             ○ Pending                                                │
│  ...                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  [adapt-steps horizontal: current = 2]                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Alternate — Risk Warning State:**

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CAN I PROCEED?                                                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ⚠ PROCEED WITH CAUTION                                                            │ │
│  │  Minor alarms on NETWORK-CORE-SW-02 (78% util). Risk low. Monitor after Step 3.    │ │
│  └───────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Adapt Component Mapping — Change Worker

| Section | Adapt Component | Notes |
|---------|-----------------|-------|
| Can I proceed? | Card with colored border | Green/amber/red; large text + short reason |
| Pre-check list | List + icons | Check / cross / pending |
| MOP steps | `adapt-steps` | Horizontal; completed / current / pending |
| Service health | Small card or label-value | Status, latency, error rate |
| Events | List or table | If any; severity styling |

---

## 6. Impact Analysis Agent — Visual Design

### 6.1 Data Structure (Target JSON)

```json
{
  "changeId": "CRQ123456",
  "impactedCIs": [
    {
      "id": "DatabaseServer01",
      "services": [
        { "name": "Customer Portal", "criticality": "high", "usersAffected": 12000, "regulatoryRisk": "moderate" },
        { "name": "Reporting Engine", "criticality": "medium", "impactProfileMissing": true }
      ]
    },
    { "id": "WebApp02", "services": [] }
  ],
  "summary": { "highCriticality": true, "regulatoryRisk": "moderate", "recommendation": "Approval with mitigation for Customer Portal" }
}
```

### 6.2 UI Wireframe — Impact Explorer

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  IMPACT ANALYSIS — CRQ123456                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  SUMMARY                                                                                 │
│  High business criticality • Moderate regulatory risk                                    │
│  Recommendation: Approval with mitigation plan for Customer Portal                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  IMPACTED CIS & SERVICES                                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  DatabaseServer01                                                                         │
│  ├─ Customer Portal         [HIGH]  12,000 users   Regulatory: Moderate  [Profile ↗]    │
│  └─ Reporting Engine       [MED]   —              Impact profile missing               │
│                                                                                          │
│  WebApp02                                                                                 │
│  └─ No business service impact detected                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Adapt Component Mapping — Impact Analysis

| Section | Adapt Component | Notes |
|---------|-----------------|-------|
| Summary | Callout card | Key bullets + recommendation |
| CI tree | `adapt-accordion` or nested list | CI → Services; expand/collapse |
| Criticality | Badge (high=red, medium=amber, low=green) | Per service |
| Users/risk | Label-value in row | Per service |

---

## 7. Shared Layout Patterns

### 7.1 Page Layout (Suggested)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  [Breadcrumb / Back]    Change Request CRQ-56789                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────────────────┐│
│  │  AI Summary (View Component)        │  │  Chat / Conversation (optional)              ││
│  │  - Agent-specific dashboard         │  │  - Full transcript                          ││
│  │  - Cards, accordions, steps         │  │  - Follow-up Q&A                            ││
│  └─────────────────────────────────────┘  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Color & Status Conventions

| Status | Background | Border | Text |
|--------|------------|--------|------|
| Ready / Approve / Safe | `#e9f9ed` | `#9fe1a8` | `#155724` |
| Conditionally / Caution | `#fff9e6` | `#ffd966` | `#856404` |
| Not Ready / Reject / Risk | `#fde8e8` | `#f5c2c7` | `#842029` |
| Neutral / Info | `#e7f1ff` | `#b3d7ff` | `#004085` |

### 7.3 Recommendation Badge Styles

| Recommendation | Style |
|----------------|-------|
| Approve | Badge `success` (green) |
| Approve with Conditions | Badge `warning` (amber) |
| Defer | Badge `secondary` (gray) |
| Reject | Badge `danger` (red) |

---

## 8. Implementation Approach

### 8.1 Option A: Agent Returns Structured JSON

- **Best if possible:** Modify agents (or add a post-process step) to return JSON matching the schemas above.
- **View components:** Consume JSON via `jsonContent` expression or record field.
- **Existing:** `ai-analysis-display` can be extended or used as base for agent-specific variants.

### 8.2 Option B: Parse Chat/Text Output

- If agents only return markdown/text:
  - Use regex or lightweight parsing to extract sections (e.g. `### 2. Collision` → collision block).
  - Map parsed blocks to visual components.
  - Less reliable; structured output preferred.

### 8.3 Option C: Hybrid

- Agent writes structured JSON to a worklog field.
- View component reads that field; chat remains for conversational Q&A.
- Best of both: visual summary + chat for drill-down.

---

## 9. Suggested View Components to Build

| Component | Purpose | Priority |
|-----------|---------|----------|
| `change-planning-dashboard` | Change Planning Agent output | High |
| `change-advisory-summary` | Change Advisory Agent output | High |
| `change-execution-companion` | Change Worker Assistant output | High |
| `impact-analysis-explorer` | Impact Analysis Agent output | Medium |
| `ai-readiness-gauge` | Reusable gauge for readiness/confidence | Medium |
| `ai-collision-card` | Reusable collision display | Low |

---

## 10. Next Steps

1. **Validate with stakeholders** — Review wireframes and color conventions.
2. **Define API contract** — Confirm how agent output will be delivered (REST, worklog, etc.).
3. **Prioritize first component** — Suggest starting with Change Advisory Summary (highest CAB value).
4. **Extend `ai-analysis-display`** — Or create agent-specific components using same patterns.
5. **Add localization** — All labels via `localized-strings.json` per project standards.

---

**Document End**
