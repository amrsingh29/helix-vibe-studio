# Petronas — End-to-End Incident Management Demo (Design Pack)

<!--
  @generated
  @context Petronas customer demo: end-to-end incident story across personas with BMC Helix DWP, ITSM, AIOps; dual workflow diagrams; exec summary + speaker notes added.
  @decisions Single anchor service (Production Operations visibility platform); Mermaid for both diagrams; benefits tied to measurable outcomes.
  @references User request; BMC Helix portfolio positioning (DWP, ITSM, AIOps).
  @modified 2025-03-21
-->

This folder contains **demo preparation** material for a **wow-factor**, **story-driven** incident management journey aimed at **Petronas**, emphasizing **BMC Helix Digital Workplace (DWP)**, **BMC Helix ITSM**, **BMC Helix AIOps**, and **AI Agents** across the full lifecycle.

| Document | Purpose |
|----------|---------|
| [petronas-incident-demo-blueprint.md](./petronas-incident-demo-blueprint.md) | Full narrative, diagrams, benefits, and demo checkpoints |
| [petronas-demo-exec-summary.md](./petronas-demo-exec-summary.md) | **One-page** executive summary (PDF-style; print → Save as PDF) |
| [petronas-demo-speaker-notes.md](./petronas-demo-speaker-notes.md) | **Speaker notes** — minute-by-minute + slide mapping + recovery lines |

---

## Quick anchor (for dry runs)

**Chosen internal business service (high impact for Petronas):**  
**Production Operations Visibility & Reporting** — the digital service that aggregates **offshore platform / production unit** telemetry, downtime events, and **production deferment** data for operations, engineering, and leadership.

Why this service works for the demo:

- **Business impact:** Minutes of incorrect or delayed production data affect **production targets**, **regulatory reporting**, and **safety decisions**.
- **Natural incident volume:** Integrations, data latency, authentication, and third-party SCADA/historian links create realistic **P1/P2** scenarios.
- **Cross-persona story:** Field users, corporate analysts, service desk, infrastructure, applications, and vendor/partner teams all touch the same service.

Use this document with your SE team to align **record names**, **catalog items**, **integrations**, and **AI agent personas** to your lab tenant.
