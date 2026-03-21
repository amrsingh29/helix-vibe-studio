# Petronas ITAM Demo — Data Prep Checklist

<!--
  @generated
  @context Petronas ITAM demo: what to load into Helix (CMDB, ITSM, ITAM, Discovery, SAM) for end-to-end asset and software story.
  @decisions Layered checklist by platform; minimum vs full path; references blueprint anchor narrative.
  @references petronas-itam-demo-blueprint.md; petronas-itam-demo-speaker-notes.md.
  @modified 2025-03-21
-->

This note answers: **what we need to load** so the **One Day in the Life of Corporate Assets** ITAM story can run end-to-end across **End User**, **ITAM Admin**, **Management**, **Asset Admin**, and **SAM Admin** personas.

---

## 1. How data prep splits by product

| Area | What to load | Why it matters for this demo |
|------|--------------|------------------------------|
| **CMDB** | Cost Centres, Departments, OPUs, Locations; User/People records; Asset CIs | Linkage for batch upload; transfer targets; reconciliation |
| **ITAM / Asset Management** | Asset records; bulk import template; transfer workflow; movement history | Batch upload; transfers; approval; audit trail |
| **ITSM** | Request/incident definitions; catalog “Notify Asset Admin”; approval definitions | End-user request; appointment fulfillment |
| **DWP** | Catalog items; self-service asset view; service offerings | End-user entry point |
| **Discovery** | Scan scope; normalization rules; reconciliation mapping | Software discovery beat |
| **SAM** | Software CIs; classifications; license types; metering data | Manual reg; metering; reharvest; classification |
| **Notifications** | Workflow triggers; expiry email template; assignment/return email template | Proactive notifications beat |
| **Dashboards** | Asset movement; cost; utilization data sources | Management visibility |

---

## 2. Minimum viable data (demo works without full Discovery/SAM)

If you must ship a **first dry run** quickly:

1. **CMDB**  
   - At least **2 Cost Centres**, **2 Departments**, **2 OPUs**, **2 Locations**.  
   - **3+ People** records for demo personas (End User, ITAM Admin, Asset Admin).  
   - Optional: pre-created Asset CIs if batch import is not ready.

2. **ITAM**  
   - **Bulk import template** (CSV) with columns: Asset Type, Serial (optional), Cost Centre, Department, Assigned User.  
   - **5–10 sample assets** (laptops, printers) for import and transfer.  
   - **Transfer workflow** definition (even if single-step approval).

3. **ITSM / DWP**  
   - **Catalog item** “Notify Asset Admin” linked to Request or Incident.  
   - **Self-service asset view** or equivalent “Assigned to me” filter.  
   - **Approval definition** for asset transfer.

4. **Dashboards**  
   - **Asset movement** panels: stock-in, stock-out, transfers (can use pre-loaded demo data).  
   - **Cost/utilization** panels (can be placeholder or synthetic).

5. **Notifications**  
   - **Optional in MVP:** Show workflow/email design; narrate expiry and assignment behavior.

6. **Discovery / SAM**  
   - **Optional in MVP:** Prioritize **manual registration** + **classification** view; narrate discovery with screenshots.

---

## 3. Full “wow” path — where real prep effort goes

### A. CMDB foundation

| Data | Action | Notes |
|------|--------|-------|
| **Cost Centres** | Create 3–5 demo Cost Centres | Align with Petronas-neutral naming |
| **Departments** | Create 3–5 demo Departments | Link to Cost Centre |
| **OPUs** | Create 2–3 demo OPUs | If used in transfer/location model |
| **Locations** | Create 3–5 demo Locations (sites) | For transfer destination |
| **People** | Create demo users: End User, ITAM Admin, Asset Admin, SAM Admin, Manager | Map to login accounts |

### B. ITAM / Asset Management

| Data | Action | Notes |
|------|--------|-------|
| **Bulk import template** | CSV with: Asset Type, Serial (opt), Cost Centre, Department, Assigned User, Location | Match CMDB values exactly |
| **Sample CSV** | 10–20 rows (laptops, printers) | Use for live import in demo |
| **Transfer workflow** | Approval definition: User → Dept → Location (or simplified) | Rehearse one golden path |
| **Movement history** | Ensure transfer records create movement entries | For dashboard and audit |

### C. ITSM / DWP

| Data | Action | Notes |
|------|--------|-------|
| **Request/Incident** | Definition for “Notify Asset Admin” | Link Asset ID or description field |
| **Catalog item** | “Notify Asset Admin” in catalog | Fulfillment → Request/Incident |
| **Self-service asset view** | Configure “Assigned to me” filter | Or equivalent DWP widget |
| **Appointment request** | Definition for “Schedule replacement” (expiry link) | For expiry notification beat |

### D. Notifications

| Data | Action | Notes |
|------|--------|-------|
| **Expiry notification** | Workflow/notification triggered when asset within 3 months of EOL | Embedded link → Appointment request |
| **Assignment email** | Template: asset details, Assigned User, next steps | Trigger on assignment |
| **Return email** | Template: asset returned, next steps | Trigger on return |

### E. Discovery (if licensed)

| Data | Action | Notes |
|------|--------|-------|
| **Scan scope** | Configure Discovery to scan demo servers/laptops | Or use pre-staged Discovery results |
| **Normalization rules** | Map product variants to standard names | For reconciliation demo |
| **Reconciliation** | Map discovered software to CMDB Software CI | Prove one reconciliation path |

### F. SAM (if licensed)

| Data | Action | Notes |
|------|--------|-------|
| **Software classifications** | Licensed, Freeware, Shareware, Open Source, SaaS, Unauthorized | For classification view |
| **License types** | Per user, per device, per subscription, Enterprise agreement | For inventory columns |
| **Metering data** | Installed vs usage (or synthetic) | For metering / reharvest beat |
| **Manual registration** | 2–3 manually created Software CIs | For manual reg demo |

### G. Dashboards

| Data | Action | Notes |
|------|--------|-------|
| **Stock-in / stock-out** | Ensure asset creation/retirement generates events | Or pre-load synthetic events |
| **Transfer records** | Enough transfers in date range for timeline | For movement dashboard |
| **Cost metrics** | HW spend, SW spend by category | Can be synthetic for demo |
| **Utilization** | License utilization % | Can be synthetic for demo |

---

## 4. Suggested order of operations (project plan)

1. **CMDB** — Cost Centres, Departments, OPUs, Locations, People.  
2. **ITAM** — Bulk import template + sample CSV; transfer workflow.  
3. **ITSM / DWP** — Catalog “Notify Asset Admin”; self-service asset view; appointment request.  
4. **Approval** — Transfer approval definition.  
5. **Notifications** — Expiry and assignment/return (or workflow design for dry run).  
6. **Dashboards** — Asset movement; cost/utilization (pre-load data if needed).  
7. **Discovery** — Scope, normalization, reconciliation (or narrate).  
8. **SAM** — Classifications, manual reg, metering (or narrate).  
9. **Dry run** — Follow `petronas-itam-demo-speaker-notes.md`; fix vocabulary mismatches.

---

## 5. What you do *not* need for v1

- Full **production-scale** Discovery runs—controlled demo scope is easier to narrate.  
- **Historical** cost analytics (synthetic or recent window is fine).  
- Every **software classification** populated—2–3 examples suffice.

---

## 6. One-line summary

**Load CMDB (Cost Centre, Dept, OPU, Location, People) first; then ITAM bulk import + transfer workflow; then ITSM/DWP catalog and self-service; then notifications and dashboards; Discovery and SAM can be narrated or minimal for MVP.**

---

*See also: `petronas-itam-demo-blueprint.md` §10 (prep checklist), `petronas-itam-demo-speaker-notes.md` (recovery lines if data is thin).*
