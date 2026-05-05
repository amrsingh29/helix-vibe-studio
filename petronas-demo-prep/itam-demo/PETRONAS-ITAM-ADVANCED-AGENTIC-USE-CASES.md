# Petronas ITAM — Advanced Agentic AI Use Cases (Flagship CIO / CTO Demo)

<!--
  @generated
  @context User requested a standalone document capturing advanced AI-driven ITAM capabilities: autonomous agents, human-in-the-loop, multi-agent systems, predictive intelligence, and decision optimization aligned to existing Petronas demo prep.
  @decisions Single consolidated markdown; 12 use cases with required structure; mix 4 autonomous, 6 human-in-the-loop, 2 multi-agent; bonus architecture, KPIs, competitive positioning; extends rather than replaces PETRONAS-ITAM-AGENTIC-AI-USE-CASES.md.
  @references petronas-itam-demo-blueprint.md; PETRONAS-ITAM-FULL-DEMO-GUIDE.md; PETRONAS-ITAM-AGENTIC-AI-USE-CASES.md.
  @modified 2026-04-30
-->

This document captures **advanced agentic AI** scenarios for **IT Asset Management (ITAM)** aligned to the Petronas demo materials: closed-loop automation, measurable business value, and **Helix-realistic** implementation paths (REST/Graph APIs, events, LLM, vector RAG, forecasting).

**Related prep (read first for continuity):**

| Document | Role |
|----------|------|
| [petronas-itam-demo-blueprint.md](./petronas-itam-demo-blueprint.md) | Narrative, personas, pain checkpoints |
| [PETRONAS-ITAM-FULL-DEMO-GUIDE.md](./PETRONAS-ITAM-FULL-DEMO-GUIDE.md) | Phase-by-phase demo sequence and catalog mapping |
| [PETRONAS-ITAM-AGENTIC-AI-USE-CASES.md](./PETRONAS-ITAM-AGENTIC-AI-USE-CASES.md) | Lighter advisory agents mapped to demo phases |

**Relationship:** `PETRONAS-ITAM-AGENTIC-AI-USE-CASES.md` focuses on **on-demand, advisory** patterns. This document adds **autonomous reconciliation**, **continuous entitlement governance**, **shadow IT / FinOps**, **vulnerability–asset–service orchestration**, **multi-agent SAM and AIOps convergence**, **contract intelligence**, and **portfolio-level refresh optimization**—suitable for a **flagship CIO / CTO** storyline.

---

## Grounding: demo phases → AI upgrade paths

| Demo phase (Full Demo Guide) | Typical friction | Agentic upgrade |
|------------------------------|------------------|-----------------|
| Discovery + reconcile | Rule-only normalization; unexplained deltas | Autonomous reconciliation + explainable exceptions |
| Batch upload + CMDB | Duplicate / stale rows after imports | Data-quality agents + closed-loop verification |
| Order / Transfer / Refresh | Human search; flat lists | Planning + policy + portfolio optimization |
| Dashboards (movement, cost) | Numbers without narrative | Decision intelligence + natural-language “why / what next” |
| SAM metering / reharvest | Manual prioritization | Optimization agent + policy-gated autonomous reclaim |
| Decommission / disposal | Compliance scatter | Governed agent with evidence pack and approvals |

---

## Use case coverage matrix

| # | Title | Agent type |
|---|--------|------------|
| 1 | Midnight CMDB Truth Engine | Autonomous |
| 2 | License Leak Sentinel | Autonomous |
| 3 | Shadow SaaS & Rogue Install Hunter | Autonomous |
| 4 | Cloud Sprawl Governor | Autonomous |
| 5 | Governed Fleet Retire & Sanitize Copilot | Human-in-the-loop |
| 6 | Cross-OPU Transfer Intelligence Desk | Human-in-the-loop |
| 7 | Vulnerability × Asset Remediation Orchestrator | Human-in-the-loop |
| 8 | Natural-Language Executive Command Center | Human-in-the-loop |
| 9 | Predictive Failure & Refresh Portfolio Optimizer | Human-in-the-loop |
| 10 | Contract & Warranty Intelligence Miner | Human-in-the-loop |
| 11 | The SAM Triad (Discovery × Compliance × Optimization) | Multi-agent |
| 12 | AIOps × ITAM Service Impact & Refresh Board | Multi-agent |

**Counts:** Autonomous **4** · Human-in-the-loop **6** · Multi-agent **2**

---

## Use case 1 — Midnight CMDB Truth Engine

### 1. Use Case Title

**Midnight CMDB Truth Engine** — autonomous hardware/software alignment

### 2. Problem Statement

Discovery, procurement, and manual ITAM updates disagree; CMDB drifts within days. Traditional tools surface **exception lists** but rarely **resolve** discrepancies at scale without large data-steward teams.

### 3. Agent Type

**Autonomous Agent**

### 4. Detailed Flow

- **Trigger:** Nightly schedule and/or event on “Discovery job completed” or “bulk import finished.”
- **Data sources:** Discovery payloads, Asset records, normalization tables, People / Location / Cost Centre, last-known-good CMDB snapshot.
- **Reasoning:** Deterministic merge rules first; LLM for **ambiguous** matches (serial variants, model strings); confidence scoring per field.
- **Actions:** Auto-update low-risk attributes (e.g., OS version, software instance links); open **structured** data-quality tasks when confidence is below threshold; write full audit trail.

### 5. AI Capabilities Used

- **RAG:** Normalization playbooks, vendor KB, internal naming standards.
- **Planning / reasoning:** Ordered merge plan with dependencies (e.g., parent CI before child).
- **Memory:** Per-CI reconciliation history and prior human resolutions.
- **Tool usage:** Helix ITAM / CMDB REST (or Graph) APIs.
- **Anomaly detection (optional):** Sudden CI count or relationship spikes.

### 6. Human Interaction

None for **high-confidence** merges. Stewards see an **exception queue** with side-by-side diff, rule ID, source record IDs, and short LLM rationale for low-confidence cases.

### 7. Business Impact

- **Operational efficiency:** Target **30–60%** reduction in steward hours on routine reconciliation (enterprise benchmark band).
- **Risk reduction:** Fewer incorrect change or incident targets caused by stale CIs.
- **Compliance / audit:** Stronger evidence trail for auditors.

### 8. Demo Storyline

- **Initial situation:** SAM admin shows duplicate or mismatched software / hardware after import or Discovery.
- **What happens:** Run “reconcile now”; agent resolves the majority automatically; leaves a small exception set with explanations.
- **Outcome:** CMDB aligns with Discovery; subsequent dashboard and SAM views are consistent without manual row-by-row cleanup.

---

## Use case 2 — License Leak Sentinel

### 1. Use Case Title

**License Leak Sentinel** — continuous entitlement versus reality

### 2. Problem Statement

Organizations overbuy “safety stock” while **installations, SaaS logins, and true usage** diverge from entitlements. Audits and vendor true-ups are reactive and expensive.

### 3. Agent Type

**Autonomous Agent**

### 4. Detailed Flow

- **Trigger:** Metering batch, new install event, HR offboarding, subscription renewal window.
- **Data sources:** SAM inventory, metering, entitlement / contract records, IdP login telemetry (if integrated), purchase data.
- **Reasoning:** Rules for hard violations; LLM for ambiguous SaaS SKUs; **30 / 60 / 90-day** license gap forecast.
- **Actions:** Auto-tag CIs with compliance risk; trigger **low-touch** reclaim workflows or vendor seat APIs where supported; otherwise auto-create reclaim tasks for SAM.

### 5. AI Capabilities Used

- **Forecasting:** Run-rate and renewal cliff projections.
- **Tool usage:** SAM / ITAM / HR event hooks.
- **RAG:** Vendor license terms and enterprise agreements (PDF / clause index).
- **Memory:** Per-product reclaim policy and past outcomes.

### 6. Human Interaction

**Fully autonomous** only for **pre-approved** products and policy envelopes (e.g., dev tools in sandbox). Otherwise autonomous **draft** plus SAM approval for production-sensitive suites.

### 7. Business Impact

- **License savings:** Illustrative **5–15%** on major suites in year one when metering exists (industry-quoted band—demo with conservative numbers).
- **Risk reduction:** Fewer audit findings and surprise true-ups.

### 8. Demo Storyline

- **Before:** Metering shows unused installs; no automatic link to procurement or renewals.
- **During:** Agent ties **installed + zero usage for 90 days** to pool balance and simulates reclaim.
- **After:** Dollarized monthly savings and a one-click path to governed reclaim (aligned to Full Demo Guide Phase 14).

---

## Use case 3 — Shadow SaaS & Rogue Install Hunter

### 1. Use Case Title

**Shadow SaaS & Rogue Install Hunter**

### 2. Problem Statement

Unapproved SaaS and desktop tools bypass procurement; security and finance often discover them only at **breach** or **invoice** time.

### 3. Agent Type

**Autonomous Agent**

### 4. Detailed Flow

- **Trigger:** New DNS / proxy SaaS signature, corporate card line item, Discovery “new publisher,” or SSO gap for a known app class.
- **Data sources:** Egress classifications, expense feeds, Discovery software inventory, CMDB authorized software catalog.
- **Reasoning:** Graph links **user ↔ expense ↔ domain ↔ install**; LLM classifies business purpose and **risk tier**.
- **Actions:** Auto-open governance request (catalog-aligned SR), propose SAM **classification** draft, attach evidence bundle (logs, spend, installs).

### 5. AI Capabilities Used

- **Anomaly detection** on spend and install velocity.
- **RAG:** Acceptable-use and procurement policy.
- **Tool usage:** Create SR, update SAM / asset attributes.

### 6. Human Interaction

**Security / governance** approves final classification or formal exception; no human required for **detection and routing**.

### 7. Business Impact

- **Risk:** Faster identification of data paths via ungoverned SaaS.
- **Cost:** Reduces duplicate tooling (e.g., overlapping collab or design stacks).

### 8. Demo Storyline

- **Before:** Static “Unauthorized” bucket in classification view (Phase 15).
- **After:** Agent narrates a concrete shadow pattern (“new vendor + N users + no SSO = Tier-2 shadow IT”) and routes to the correct workflow with citations.

---

## Use case 4 — Cloud Sprawl Governor

### 1. Use Case Title

**Cloud Sprawl Governor** — rightsizing linked to corporate identity and assets

### 2. Problem Statement

Cloud cost views are **account- and tag-centric**; ITAM holds **ownership, cost centre, and lifecycle**. FinOps and ITAM drift apart.

### 3. Agent Type

**Autonomous Agent**

### 4. Detailed Flow

- **Trigger:** Daily cost anomaly, budget threshold, or HR termination event.
- **Data sources:** Cloud billing (e.g., CUR), resource tags, CMDB People / Department, SSO last-login.
- **Reasoning:** Attribution model with confidence; LLM explains weak or missing tags.
- **Actions:** Auto-stop **policy-approved** non-prod windows; auto-file tagging / ownership correction SR for ambiguous resources; **no** destructive production actions without explicit policy.

### 5. AI Capabilities Used

- **Anomaly detection** and **forecasting** on burn rate.
- **Tool usage:** Cloud provider APIs + CMDB / ITAM.
- **RAG:** FinOps and tagging standards.

### 6. Human Interaction

None for tagged dev sandboxes in allow-listed accounts; human approval for production-adjacent or ambiguous attribution.

### 7. Business Impact

- **Cost:** Illustrative **10–25%** reduction in non-prod waste (FinOps-style claim—stage conservatively in demo).
- **Governance:** Higher tag compliance and ownership accuracy.

### 8. Demo Storyline

- **Initial situation:** “Zombie” dev cluster still billing.
- **What happens:** Agent correlates spend to **ex-employee** identity tied to a laptop record from the ITAM narrative.
- **Outcome:** Auto ticket + **estimated monthly savings** counter.

---

## Use case 5 — Governed Fleet Retire & Sanitize Copilot

### 1. Use Case Title

**Governed Fleet Retire & Sanitize Copilot**

### 2. Problem Statement

Decommission and disposal (Full Demo Guide Phase 16) fail when **data wipe, certificate of destruction, license reclaim, and CMDB retirement** are mis-sequenced—creating legal and security exposure.

### 3. Agent Type

**Human-in-the-loop Agent**

### 4. Detailed Flow

- **Trigger:** **Computer Return Request**, **Asset Decommission**, or **Asset Disposal** submission.
- **Data sources:** CMDB asset, encryption posture, last assignee, installed software, open incidents / changes, contract / warranty.
- **Reasoning:** LLM-generated checklist from policy docs (**RAG**) plus deterministic ordering rules.
- **Actions:** Pre-fill disposal attributes, propose CMDB transitions, assemble **evidence pack** (links to wipe logs when integrated).

### 5. AI Capabilities Used

- **RAG** on security and disposal policy.
- **Planning** for ordered steps and blockers.
- **Tool usage:** SR / WO / Asset APIs.
- **Memory** from similar prior assets.

### 6. Human Interaction

**Asset Admin** and **Security** confirm wipe verification and final disposal sign-off. UI shows **policy citations** and blockers (e.g., “open Adobe installation request on this device”).

### 7. Business Impact

- **Compliance:** Stronger chain-of-custody for audits.
- **Efficiency:** **40–70%** faster preparation of disposal dossiers when templated (realistic band).

### 8. Demo Storyline

- **Before:** Approver chases multiple tabs and emails.
- **During:** Single dossier with blockers and suggested order of operations.
- **After:** One governed path to compliant retirement.

---

## Use case 6 — Cross-OPU Transfer Intelligence Desk

### 1. Use Case Title

**Cross-OPU Transfer Intelligence Desk**

### 2. Problem Statement

**IT Asset Transfer** across OPUs (Phase 5) intersects **tax, capitalization, and budget** rules that approvers cannot memorize.

### 3. Agent Type

**Human-in-the-loop Agent**

### 4. Detailed Flow

- **Trigger:** Transfer SR created or approval step opened.
- **Data sources:** Asset book value, cost centre budgets, transfer history, OPU / finance policy library.
- **Reasoning:** Combined policy engine + LLM **approver brief**; flags materiality and approval-chain gaps.
- **Actions:** No automatic transfer; attaches risk score, suggested approvers, and draft justification text.

### 5. AI Capabilities Used

- **RAG** on finance and OPU policy.
- **Planning** for approval graph.
- **Tool usage:** Budget and asset financial APIs.

### 6. Human Interaction

Approver consumes explainable memo; optional what-if questions (“target OPU B vs C”) before approve.

### 7. Business Impact

- **Cycle time:** **20–40%** faster approvals with fewer returns for missing data.
- **Financial risk:** Fewer mis-capitalized or non-compliant transfers.

### 8. Demo Storyline

Same transfer UI as today; side panel: “OPU-B requires dual approval; threshold exceeded; suggest split transfer”—**governance at scale** for CIO audience.

---

## Use case 7 — Vulnerability × Asset Remediation Orchestrator

### 1. Use Case Title

**Vulnerability × Asset Remediation Orchestrator**

### 2. Problem Statement

Vulnerability scanners output **CVE lists** disconnected from **ownership, warranty, refresh eligibility, and licensing**—patch and refresh decisions slip.

### 3. Agent Type

**Human-in-the-loop Agent**

### 4. Detailed Flow

- **Trigger:** New CVE above organizational CVSS threshold or material scan delta.
- **Data sources:** Vuln feed, CMDB (owner, tier), AIOps service topology, patch catalog, **Computer Refresh** pipeline.
- **Reasoning:** Prioritize by **business service impact × exploitability × asset age**; LLM drafts grouped change narrative.
- **Actions:** Create grouped changes or incidents; recommend **patch vs refresh** cohorts with evidence.

### 5. AI Capabilities Used

- **RAG:** Vendor bulletins and internal runbooks.
- **Planning:** Cohort selection and sequencing.
- **Tool usage:** ITSM change, asset and service queries.
- **Forecasting (optional):** Historical patch success or failure patterns.

### 6. Human Interaction

**CAB / infrastructure** approves grouped change; asset or service owner confirms maintenance window.

### 7. Business Impact

- **Risk:** Lower MTTR for **critical** CVEs on tier-1 services (demo as percentage improvement on a staged cohort).
- **Cost / CapEx:** Avoids blind “patch everything” by targeting high-value CIs.

### 8. Demo Storyline

Bridge from a **named business service** to **affected laptops**: CVE → service map → device cohort → one approved bulk remediation path (pairs with incident / AIOps demo themes).

---

## Use case 8 — Natural-Language Executive Command Center

### 1. Use Case Title

**Natural-Language Executive Command Center**

### 2. Problem Statement

Movement and cost dashboards (Phases 6–7) show **what** happened; executives need **why** and **what next** without waiting for analysts.

### 3. Agent Type

**Human-in-the-loop Agent**

### 4. Detailed Flow

- **Trigger:** Natural-language question after viewing dashboards.
- **Data sources:** Stock-in/out events, transfers, PO lines, utilization, related incidents.
- **Reasoning:** NL → query plan → aggregates + **counterfactual** (“if reharvest had been executed…”).
- **Actions:** Read-only insights by default; optional “generate briefing” or “open SR template” with explicit human confirmation for writes.

### 5. AI Capabilities Used

- **Planning / reasoning** over multi-step queries.
- **Tool usage:** Analytics and ITAM APIs.
- **RAG:** Internal glossaries (OPU, cost centre naming).

### 6. Human Interaction

User confirms any **write**; all numeric answers carry **citations** (time range, query, source).

### 7. Business Impact

- **Productivity:** Fewer one-off reporting cycles.
- **Decisions:** Faster reallocation of underutilized assets (extends cost/utilization dashboard story).

### 8. Demo Storyline

Elevate the existing “Why did stock-in spike?” beat to a **root narrative + recommended actions** with CFO-friendly figures.

---

## Use case 9 — Predictive Failure & Refresh Portfolio Optimizer

### 1. Use Case Title

**Predictive Failure & Refresh Portfolio Optimizer**

### 2. Problem Statement

Expiry notifications (Phase 8) are **calendar-driven**, not **risk- and utilization-driven**—budget spent on stable gear while higher-risk devices wait.

### 3. Agent Type

**Human-in-the-loop Agent** (optimization with human capex gate)

### 4. Detailed Flow

- **Trigger:** Monthly portfolio review or warranty cliff batch.
- **Data sources:** Warranty, hardware telemetry when available (e.g., SMART, battery), helpdesk tickets per asset, utilization.
- **Reasoning:** Risk-ranked survival-style signals + **portfolio** optimization under budget constraint; LLM narrative for leadership.
- **Actions:** Proposed **refresh waves**; targeted user communications for top cohort first.

### 5. AI Capabilities Used

- **Forecasting** and **optimization** under CapEx envelope.
- **RAG:** OEM bulletins and internal refresh standards.
- **Tool usage:** Asset queries, notification templates, refresh SR linkage.

### 6. Human Interaction

ITAM and **finance** approve annual or quarterly **wave** and budget envelope.

### 7. Business Impact

- **CapEx smoothing:** Fewer emergency purchases.
- **User productivity:** Fewer disruptive mid-cycle failures.

### 8. Demo Storyline

Upgrade Phase 8 from a flat “expiring in 3 months” list to a **heat map**: “These 22 devices drive 40% of related tickets—refresh first.”

---

## Use case 10 — Contract & Warranty Intelligence Miner

### 1. Use Case Title

**Contract & Warranty Intelligence Miner**

### 2. Problem Statement

Warranties and support entitlements live in **PDFs and email**, not CMDB fields—refresh timing and support levels are wrong at scale.

### 3. Agent Type

**Human-in-the-loop Agent**

### 4. Detailed Flow

- **Trigger:** Contract upload, vendor renewal event, or annual mining job.
- **Data sources:** PDF / CLM exports, serial lists in CMDB, support portal entitlements.
- **Reasoning:** Document extraction + LLM validation against CMDB serial and model patterns; clause versioning.
- **Actions:** Proposed CMDB attribute updates; co-terminus renewal calendar; alerts before SLA gaps.

### 5. AI Capabilities Used

- **RAG** + structured extraction pipelines.
- **Tool usage:** Document store, CMDB / ITAM writes (draft).
- **Memory:** Clause and amendment history per vendor.

### 6. Human Interaction

**Procurement / legal** confirms extracted clauses before production CMDB write.

### 7. Business Impact

- **Opex:** Fewer emergency support uplifts.
- **Compliance:** Correct entitlement evidence during audits.

### 8. Demo Storyline

Upload a redacted OEM PDF; agent proposes **warranty end dates** for a batch of laptops used in the batch-upload / order-computer story.

---

## Use case 11 — The SAM Triad (multi-agent)

### 1. Use Case Title

**The SAM Triad** — Discovery × Compliance × Optimization agents in concert

### 2. Problem Statement

A single assistant cannot simultaneously **normalize inventory**, **enforce compliance**, and **maximize savings** without explicit **trade-offs** and arbitration.

### 3. Agent Type

**Multi-Agent System**

### 4. Detailed Flow

- **Trigger:** Post-Discovery reconciliation job (Phase 11).
- **Discovery Agent:** Proposes CI graph updates and normalization rules.
- **Compliance Agent:** Vetoes or escalates high-risk classifications (unauthorized, export-controlled, privacy-sensitive).
- **Optimization Agent:** Proposes reharvest, downgrade, or defer-purchase scenarios with **currency impact**.
- **Coordinator:** Merges outputs into a **single ranked backlog** with explicit trade-offs.

### 5. AI Capabilities Used

- **Multi-agent** negotiation / arbitration under org policy.
- **RAG** for license and export rules.
- **Tool usage:** SAM / CMDB APIs.
- **Forecasting** for renewal cliffs.

### 6. Human Interaction

SAM lead **signs** the ranked backlog; sensitive vendor actions may remain human-per-step.

### 7. Business Impact

- **Joint optimization** of license savings and compliance (not sequential silo projects).
- **Throughput:** More software decisions per SAM FTE.

### 8. Demo Storyline

One ambiguous SKU: Discovery wants normalization X, Compliance demands legal review, Optimization suggests deferring purchase—**one screen**, three perspectives, **one** leadership decision.

---

## Use case 12 — AIOps × ITAM Service Impact & Refresh Board (multi-agent)

### 1. Use Case Title

**AIOps × ITAM Service Impact & Refresh Board**

### 2. Problem Statement

AIOps and incidents name **services**, not **end-user devices**; ITAM holds the fleet. Bridging them is manual and slow.

### 3. Agent Type

**Multi-Agent System**

### 4. Detailed Flow

- **Trigger:** Repeated degradation on a business service or major incident pattern.
- **Topology Agent:** Maps service → supporting CIs.
- **Asset Agent:** Pulls warranty, age, refresh eligibility, spare pool.
- **Risk Agent:** Correlates vuln and patch posture with incident history.
- **Output:** “Replace or patch cohort A before next maintenance window” with links to **Computer Refresh Request** at scale.

### 5. AI Capabilities Used

- **Event / anomaly streams** from AIOps.
- **Graph reasoning** across service and asset layers.
- **Tool usage:** AIOps + CMDB + ITAM APIs.
- **Memory:** Prior incident fingerprints.

### 6. Human Interaction

Service owner approves **refresh wave**; finance may approve capex band.

### 7. Business Impact

- **Availability:** Fewer repeat incidents driven by aging endpoint cohorts.
- **CapEx / OpEx:** Data-driven refresh versus break-fix.

### 8. Demo Storyline

Same **business service** name as in the incident design pack; board shows **asset-led** remediation—**ITSM + ITAM + AIOps** convergence for CIO storytelling.

---

## Appendix A — Reference architecture (representative)

Applicable especially to **Use case 1 (Midnight CMDB Truth Engine)** and **Use case 11 (SAM Triad)**.

```text
Sources: Discovery, ITAM, SAM, IdP, FinOps billing export, vuln scanner, CLM PDFs
          │
          ▼
    Event bus (Kafka / platform webhooks / scheduled jobs)
          │
    ┌─────┴─────┐
    ▼           ▼
Policy / rules Feature store (asset facts, usage, risk embeddings)
engine           │
    │            ▼
    │       Vector DB (policies, vendor docs, playbooks)
    │            │
    └─────► Orchestrator (explicit state machine / graph)
                  │
         ┌────────┼────────┐
         ▼        ▼        ▼
     Worker    Worker   Worker
     agents    agents   agents
         │        │        │
         └────────┼────────┘
                  ▼
     Helix REST (ITSM / ITAM / CMDB / SAM) + immutable audit log
                  ▼
     Verify agent (post-conditions, rollback on failure)
                  ▼
     Human task queue (low confidence or high materiality)
```

**Design notes:**

- **Closed loop:** detect → decide → act → **verify** → audit.
- **Policy-gated autonomy:** autonomous writes only inside signed policy envelopes.
- **Human queue:** confidence and materiality thresholds—not “LLM decides everything.”

---

## Appendix B — Example KPIs

| KPI | Example direction |
|-----|-------------------|
| CMDB accuracy (sampled CIs) | Increase by X percentage points per quarter |
| Mean time to reconcile Discovery delta | Reduce 40–70% versus manual baseline |
| License true-up exposure | Reduce $ or % of renewal at risk |
| Shadow IT time-to-detect | Days → hours |
| Refresh cycle cost | Reduce % versus calendar-only scheduling |
| Critical CVE MTTR on tier-1 services | Reduce % versus baseline |
| Autonomous action rollback rate | Keep below agreed safety threshold (e.g., &lt; 1–2%) |

---

## Appendix C — Competitive positioning (illustrative)

| Theme | Message |
|-------|---------|
| **Convergence** | ITAM + ITSM + AIOps + DWP on **one CMDB-backed reality**—agents orchestrate across products, not as a disconnected chat layer. |
| **Closed loop** | Detect → decide → act → **verify** with audit—not only GenAI summaries on static dashboards. |
| **Governance** | **Policy-gated autonomy** (OPU, finance, security) addresses enterprise skepticism of “auto-magic.” |
| **SAM depth** | Metering, classification, and reharvest (already in demo) become **multi-objective optimization** with explicit compliance veto (SAM Triad). |

*Versus platforms such as ServiceNow:* competitors also ship ITAM and GenAI assistants. Differentiation is **auditable multi-agent orchestration**, **native Helix integration**, and a **single executive narrative** from asset to service to incident—demonstrated on **customer-shaped** tenant data.

---

## Document control

| Version | Date | Notes |
|---------|------|--------|
| 1.0 | 2026-04-30 | Initial publication from architecture analysis |

---

*Use with `PETRONAS-ITAM-FULL-DEMO-GUIDE.md` for demo sequencing and with `PETRONAS-ITAM-AGENTIC-AI-USE-CASES.md` for phase-mapped lighter-weight agents.*
