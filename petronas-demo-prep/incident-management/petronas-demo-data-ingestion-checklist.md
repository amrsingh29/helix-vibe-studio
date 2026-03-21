# Petronas Demo — Data Ingestion & Platform Data Readiness

<!--
  @generated
  @context Petronas incident demo: what to load/ingest into Helix (CMDB, ITSM, DWP, AIOps, AI) vs. generic "data ingestion" product.
  @decisions Layered checklist by platform; AIOps called out as primary external/signal ingestion; optional minimum vs. wow path.
  @references petronas-incident-demo-blueprint.md
  @modified 2025-03-21
-->

This note answers: **what we need to do for “data ingestion”** so the **Production Operations Visibility & Reporting** incident story can run end-to-end across **DWP**, **ITSM**, **AIOps**, and **AI Agents**.

> **Clarification:** “Data ingestion” here means **getting the right data into the Helix estate** (configuration, tickets, monitoring signals, knowledge). It is **not** the same as the sample **DataIngest** Excel/template app under `my-components/helix-data-ingestion-app/` unless you explicitly use that for **bulk CMDB or custom record** loads.

---

## 1. How ingestion splits by product

| Area | What “ingestion” usually means | Why it matters for this demo |
|------|--------------------------------|------------------------------|
| **CMDB / Service model** | Services, CIs, relationships (manual, spreadsheet import, discovery, or integration) | **One** named business service; **dependencies** (app → integration → infra) for the “diagnose” beat |
| **ITSM** | Records created in-platform or via API; reference data (categories, priorities, templates) | **Incident** lifecycle, **tasks**, optional **problem** / **known error** |
| **DWP** | Catalog items, service offerings, links to fulfillment / ITSM | **Front door** + **service page** the user opens before AI |
| **AIOps** | **Events**, **metrics**, **logs**, **topology** from monitored sources | **Correlation** and **anomaly** story—this is the heaviest **signal ingestion** work |
| **AI Agents** | **Knowledge** articles, **curated Q&A**, **agent instructions**, **tools** (ICAs) | Grounded answers; **similar incident** / **draft comms** depend on **tenant content + tools** |

---

## 2. Minimum viable data (demo works without full AIOps)

If you must ship a **first dry run** quickly:

1. **CMDB (minimal graph)**  
   - One **business service**: *Production Operations Visibility & Reporting*.  
   - Linked **application** CI + **integration** / interface CI (names only are fine).  
   - Optional: **host/cluster** CI for plausibility.

2. **ITSM**  
   - **Incident** template** with **Service** field and **categorization** aligned to the story.  
   - **Assignment groups** for L1, App L3, Data/Integration (even if the same people log in as each).  
   - **One pre-staged or scripted P1** path you rehearse (create → tasks → resolve).

3. **DWP**  
   - **Catalog** path or **favorite** to report an issue against that service.  
   - **Service profile** text (owner, hours) so AI/DWP have something real to cite.

4. **AI Agent**  
   - **Knowledge articles** (2–4) scoped to that service: symptoms, **how to report**, **what info to include**.  
   - **Agent configuration** scoped to **that service / knowledge set** so prompts succeed reliably.

5. **AIOps**  
   - **Optional in MVP:** narrate correlation with **screenshots** or a **pre-recorded** clip; or show **empty** correlation with a verbal “in production we’d onboard…” (weakest but possible).

---

## 3. Full “wow” path — where real ingestion effort goes

### A. AIOps (primary technical ingestion)

To **show** (not only tell) **noise reduction** and **correlation**:

| Data type | Typical sources | Demo intent |
|-----------|-----------------|-------------|
| **Events** | Monitoring/alerting (e.g. enterprise monitor, cloud, SNMP traps) | Multiple raw alerts that **collapse** to one situation |
| **Metrics** | APM, infra, or custom KPIs (latency, error rate, job lag) | **Anomaly** aligned with “stale dashboards” timeframe |
| **Logs** | Log collectors / forwarders | Spike or error pattern matching **integration/batch** failure |
| **Topology / services** | CMDB sync or service models in AIOps | Map events to **same** business service / CIs as ITSM |

**Work items (conceptual):**

- Onboard **sources** that match your **scripted root cause** (e.g. batch job failures, auth errors, API latency).  
- **Tag or normalize** so **service name / CI** matches **CMDB** and **ITSM incident** (same vocabulary).  
- **Time-align** synthetic or test events with the **user symptom** window in the demo script.  
- Validate **one** correlation / situation in the UI before the customer session.

### B. CMDB ↔ AIOps alignment

Ingestion is not only “into AIOps”—it must **match** ITSM:

- Same **service ID or name** convention across **CMDB**, **Incident**, **DWP offering**, and **AIOps** service model.  
- If you use **discovery**, restrict or **curate** CIs so the demo graph isn’t noisy.

### C. Knowledge and AI (content ingestion)

| Content | Action |
|---------|--------|
| **Knowledge articles** | Author/import articles for the anchor service (symptoms, workarounds, escalation). |
| **Agent corpus** | Point the agent at **approved** sources; avoid unbounded web if you need predictable demos. |
| **Tools / ICAs** | If the agent **queries incidents** or **change calendar**, wire **integrations** and test with **demo identities**. |

### D. DWP (catalog and fulfillment)

- **Service offering** tied to the **same** service record used in ITSM.  
- **Request** or **incident** fulfillment so clicks **land** in the right template.

---

## 4. Suggested order of operations (project plan)

1. **Freeze the story** — root cause beat (e.g. credential / batch) and **symptom** wording.  
2. **CMDB + naming** — business service + 2–3 CIs + relationships.  
3. **ITSM** — templates, groups, SLA display (optional), **one** golden incident path.  
4. **DWP** — catalog + service page + links.  
5. **Knowledge + AI** — articles + agent scope + **rehearsed prompts**.  
6. **AIOps** — onboard sources, **time-sync** test events, **prove** one correlation in UI.  
7. **Dry run** — same clock as `petronas-demo-speaker-notes.md`; fix **vocabulary mismatches** first.

---

## 5. What you do *not* need for v1

- Full **historical** incident analytics for ML (nice for AI, not required for a **single-thread** demo).  
- Production-scale **log** volumes—**controlled** test volume is easier to narrate.  
- The **DataIngest** Excel pipeline **unless** your team uses it to **bulk-load** CMDB or custom staging records.

---

## 6. One-line summary

**Ingest configuration and content into CMDB, ITSM, DWP, and Knowledge/AI first; treat AIOps event/metric/log onboarding as the main “traditional” data-ingestion engineering work for the wow factor, and keep naming identical across all layers.**

---

*See also: `petronas-incident-demo-blueprint.md` §10 (prep checklist), `petronas-demo-speaker-notes.md` (recovery lines if data is thin).*
