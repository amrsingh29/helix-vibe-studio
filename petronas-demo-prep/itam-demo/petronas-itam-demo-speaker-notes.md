# Petronas — ITAM Demo Speaker Notes (Minute-by-Minute)

<!--
  @generated
  @context Speaker notes aligned to petronas-itam-demo-blueprint; tell-show-tell format; minute ticks + recovery lines per segment.
  @decisions ~55–60 min arc; 9 acts; tell-show-tell structure for each beat.
  @references petronas-itam-demo-blueprint.md; plan petronas_itam_demo_plan.
  @modified 2025-03-21
-->

**Demo title:** IT Asset Management — One Day in the Life of Corporate Assets  
**Audience:** Petronas (business + IT stakeholders)  
**Tone:** Calm, outcome-led; **one continuous story**—avoid a “feature checklist” voice.

---

## Quick reference — segments vs. slides

Use this if you build a **slide deck**: roughly **one slide per row** (optional title slide before, thank-you after).

| Slide | Minutes | Act | Primary persona on screen |
|-------|---------|-----|---------------------------|
| 1 (title) | — | Optional pre-roll | — |
| 2 | 0:00–7:00 | Act 1: End User — view assets + notify | End User |
| 3 | 7:00–15:00 | Act 2: ITAM Admin — batch upload | ITAM Admin |
| 4 | 15:00–22:00 | Act 3: ITAM Admin — transfers + approval | ITAM Admin |
| 5 | 22:00–27:00 | Act 4: Management — movement dashboard | Management |
| 6 | 27:00–32:00 | Act 5: Management — cost/utilization | Management |
| 7 | 32:00–39:00 | Act 6: Asset Admin — expiry + assignment email | Asset Admin |
| 8 | 39:00–45:00 | Act 7: SAM Admin — discovery + reconcile | SAM Admin |
| 9 | 45:00–55:00 | Act 8: SAM Admin — manual + metering + classification | SAM Admin |
| 10 | 55:00–58:00 | Act 9: Wrap — Asset Management dashboard | Management |
| 11 | +2–3 min | Q&A buffer | — |

---

## Optional pre-roll (0:30–1:00) — not counted in 55 min

**Objective:** Set expectations; no live clicking yet.

**Say (suggested script):**  
“We’ll follow **one** asset lifecycle—from an end user checking what’s assigned to them, through ITAM batch registration and governed transfers, to management dashboards, proactive notifications, and software discovery through optimization. The thread is **intentionally single** so you can see how **ITSM, ITAM, CMDB, and Discovery** work together.”

**Show:** Title slide or static **architecture one-liner** (optional).

**Watch-out:** Don’t name every SKU in the first minute; anchor on **business outcome**.

**Transition:** “Let’s start where the story always starts—with an **end user** who just wants to see **what’s assigned to them**.”

---

## Act 1 — End User: view assets + notify (0:00 – 7:00)

**Slide 2 · Minutes 0–7**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 0:00–0:45 | “Employees need one place to see what’s assigned to them and a simple way to request corrections.” | Outcome-first |
| **Show** | 0:45–5:30 | Open DWP/ITSM self-service asset view; filter by “Assigned to me”; show one incorrect asset; use catalog request “Notify Asset Admin” | Pre-stage demo user with 2–3 assets |
| **Tell** | 5:30–7:00 | “Data quality improves when users can flag issues without calling the helpdesk.” | Recap |

**Say (script):**  
“Our end user opens the **self-service asset view** and filters to **what’s assigned to me**. They notice one asset has the wrong Cost Centre. Instead of calling the helpdesk, they use the **catalog request** to **Notify Asset Admin**. That creates a structured request—traceable, auditable, and actionable.”

**Show:** DWP → Asset view → “Assigned to me” → one asset → Catalog “Notify Asset Admin” → submit.

**Watch-out:** Don’t dive into CMDB structure; keep it user-facing.

**Transition:** “Now we flip to **ITAM Admin**—how did those assets get there? **Batch upload**.”

---

## Act 2 — ITAM Admin: batch upload (7:00 – 15:00)

**Slide 3 · Minutes 7–15**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 7:00–7:45 | “New hardware arrives daily. Batch upload with auto AssetID and linkage to Cost Centre, Department, and users avoids manual data entry.” | Outcome-first |
| **Show** | 7:45–13:30 | Asset Management bulk import (CSV/Excel); show auto AssetID; show Cost Centre, Department, User linkage in CMDB | Pre-stage CSV with laptops/printers |
| **Tell** | 13:30–15:00 | “Single import, complete traceability.” | Recap |

**Say (script):**  
“ITAM Admin receives a batch of new **laptops and printers**. Instead of keying each one manually, they use **bulk import**. The system generates **Asset IDs** automatically and maps each asset to **Cost Centre**, **Department**, and **assigned User**. One import, full **traceability**.”

**Show:** Asset Management → Bulk import → upload CSV → results; CMDB view showing linkages.

**Watch-out:** Keep CSV simple; avoid field overload.

**Transition:** “Assets don’t stay static—they **move**. Next: **transfers** with **approval**.”

---

## Act 3 — ITAM Admin: transfers + approval (15:00 – 22:00)

**Slide 4 · Minutes 15–22**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 15:00–15:45 | “Transfers between users, departments, OPUs, and locations must be controlled and auditable.” | Outcome-first |
| **Show** | 15:45–20:30 | Create transfer request; show approval workflow (user → dept → location); show inventory movement history | Pre-stage one golden path |
| **Tell** | 20:30–22:00 | “Governed movement, full audit trail.” | Recap |

**Say (script):**  
“An asset moves from one **user** to another, or from one **department** to another, or across **locations**. We create a **transfer request**—and an **approval workflow** runs. Once approved, the movement is recorded. **Inventory history** shows exactly where the asset was and when.”

**Show:** Transfer request → approval steps → movement history.

**Watch-out:** Rehearse approval path; avoid branching.

**Transition:** “Management doesn’t want to dig—they want **visibility**. **Dashboards**.”

---

## Act 4 — Management: movement dashboard (22:00 – 27:00)

**Slide 5 · Minutes 22–27**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 22:00–22:30 | “Management needs real-time visibility of stock-in, stock-out, transfers, and current location.” | Outcome-first |
| **Show** | 22:30–26:00 | Interactive dashboard: stock-in/out counts; transfer timeline; asset location table or map | Pre-load demo data |
| **Tell** | 26:00–27:00 | “One pane of glass for asset movement.” | Recap |

**Say (script):**  
“On the **Asset Movement dashboard**, we see **stock-in** and **stock-out** counts, a **transfer timeline**, and **current location** by asset or by site. No more spreadsheets—**one pane of glass**.”

**Show:** Dashboard panels (stock-in, stock-out, transfers, location).

**Watch-out:** If data is thin, use fixed date range and narrate “in production…”

**Transition:** “Movement is one lens. **Cost** and **utilization** are another.”

---

## Act 5 — Management: cost/utilization (27:00 – 32:00)

**Slide 6 · Minutes 27–32**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 27:00–27:30 | “Hardware and software cost, utilization, and optimization planning drive budget decisions.” | Outcome-first |
| **Show** | 27:30–31:00 | Cost spend by category (HW/SW); utilization %; underused vs overused licenses; optimization recommendations | Pre-load metrics |
| **Tell** | 31:00–32:00 | “Data-backed planning for cost saving.” | Recap |

**Say (script):**  
“The **Cost and Utilization dashboard** shows **hardware spend** and **software spend** by category. We see **utilization**—what’s used vs. what’s sitting idle. For software, we identify **reharvest candidates**—licenses we can reclaim. That’s **data-backed planning** for **cost saving**.”

**Show:** Cost panels; utilization %; reharvest / optimization view.

**Watch-out:** Keep numbers plausible; avoid decimal overload.

**Transition:** “Back to **Asset Admin**—proactive **notifications**.”

---

## Act 6 — Asset Admin: expiry + assignment email (32:00 – 39:00)

**Slide 7 · Minutes 32–39**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 32:00–32:45 | “Devices near end-of-life need proactive scheduling; users should receive clear asset details when assigned or returning.” | Outcome-first |
| **Show** | 32:45–37:30 | Expiry notification for asset expiring in 3 months; embedded link to set appointment; assignment/return email with asset details | Pre-stage sample email |
| **Tell** | 37:30–39:00 | “Reduces last-minute scrambles; clear handoff, fewer support calls.” | Recap |

**Say (script):**  
“When an asset is **within 3 months of expiry**, the user gets an **auto-notification** with an **embedded link** to **set an appointment** for replacement—right within the system. And when we **assign** or **return** an asset, the user gets an **auto-email** with **asset details** and next steps. **Proactive**, not reactive.”

**Show:** Notification template or sample email; link opening ITSM request.

**Watch-out:** If notifications aren’t configured, show **workflow design** and narrate behavior.

**Transition:** “We’ve covered **hardware**. **Software** is next—**discovery**, **metering**, and **classification**.”

---

## Act 7 — SAM Admin: discovery + reconcile (39:00 – 45:00)

**Slide 8 · Minutes 39–45**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 39:00–39:45 | “Software must be discovered, normalized, and reconciled to the CMDB.” | Outcome-first |
| **Show** | 39:45–44:00 | Helix Discovery (or equivalent): discovered software; normalization rules; reconciliation into CMDB | Pre-stage discovery run |
| **Tell** | 44:00–45:00 | “Automated, accurate software inventory.” | Recap |

**Say (script):**  
“**Helix Discovery** scans our environment and **discovers** installed software. **Normalization rules** map variants to standard product names. **Reconciliation** pushes the reconciled data into the **CMDB**. The result: **automated**, **accurate** software inventory.”

**Show:** Discovery results; normalization; reconciliation view.

**Watch-out:** If Discovery isn’t configured, use **screenshots** or **manual registration** as primary; narrate “in production we’d run…”

**Transition:** “Discovery doesn’t catch everything. **Manual registration** fills gaps. Then **metering** and **classification**.”

---

## Act 8 — SAM Admin: manual + metering + classification (45:00 – 55:00)

**Slide 9 · Minutes 45–55**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Tell** | 45:00–45:30 | “Some software isn’t discoverable; manual registration fills gaps. Usage vs installed and unused licenses drive cost savings. View by classification and license type.” | Outcome-first |
| **Show** | 45:30–53:30 | Manual software registration; metering report (installed vs usage); reharvest candidates; classification views (Licensed, Freeware, Shareware, Open Source, SaaS, Unauthorized); license types (per user, per device, Enterprise); detailed inventory (Name, Version, Published, Classification, user, BU) | Pre-stage SAM data |
| **Tell** | 53:30–55:00 | “Complete coverage; right-size licensing; full visibility for compliance.” | Recap |

**Say (script):**  
“We **manually register** software that Discovery can’t see. **Metering** compares **installed** vs. **actual usage**—so we identify **reharvest candidates**. We view by **classification**: Licensed, Freeware, Shareware, Open Source, SaaS, Unauthorized—and by **license type**: per user, per device, Enterprise. The **detailed inventory** shows Software Name, Version, Published, Classification, user login, Business Unit—everything needed for **compliance** and **planning**.”

**Show:** Manual reg form; metering report; classification filter; inventory table.

**Watch-out:** Don’t enumerate every classification; pick 2–3 examples.

**Transition:** “We close with the **stakeholder view**—the **Asset Management dashboard**.”

---

## Act 9 — Wrap: Asset Management dashboard (55:00 – 58:00)

**Slide 10 · Minutes 55–58**

| Phase | Min | What to do | Notes |
|-------|-----|------------|--------|
| **Show** | 55:00–57:00 | Stakeholder / Management Asset Management dashboard—high-level KPIs | Same or summary of earlier dashboards |
| **Tell** | 57:00–58:00 | “One narrative—from end-user view through management visibility, with governed movement, proactive notifications, and software optimization.” | Recap full story |

**Say (script):**  
“For **Stakeholders and Management**, this **Asset Management dashboard** is the **one pane of glass**—movement, cost, utilization, optimization. We’ve followed **one narrative**: end user → ITAM registration → governed transfers → dashboards → proactive notifications → software discovery and optimization.”

**Show:** Summary dashboard or return to movement/cost view.

**Transition:** “That’s **one** asset lifecycle—**traceability**, **visibility**, **compliance**.”

---

## Closing line (0:30)

**Say:**  
“If we take one idea away: **ITAM** here isn’t a spreadsheet—it’s **traceability** from creation to retirement, **governance** on every movement, **visibility** for management, and **software optimization** for cost and compliance—all in one platform.”

**Open Q&A.**

---

## Facilitator cheat sheet — if something breaks

| Symptom | Recovery line |
|--------|----------------|
| Discovery not configured | “In production we’d run **Discovery**; for now we’re showing **manual registration** and **classification**—the **pattern** is the same.” |
| Approval workflow complex | “We’ve **pre-staged** one transfer path; the **value** is **governed movement** and **audit trail**.” |
| Dashboard data sparse | “We’ve loaded **demo data** for this window; in production you’d see **live** movement and cost.” |
| Notifications not configured | “Here’s the **workflow design** and **email template**; the **behavior** is: user gets link to set appointment when asset expires soon.” |

---

*Align prompts and data with `petronas-itam-demo-blueprint.md` §10 prep checklist before dry run.*
