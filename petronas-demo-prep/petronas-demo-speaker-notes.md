# Petronas — Demo Speaker Notes (Minute-by-Minute)

<!--
  @generated
  @context Speaker notes aligned to petronas-incident-demo-blueprint choreography; slide suggestions + say/show/watch-outs per segment.
  @decisions ~25 min arc; 8 segments + optional open/close; minute ticks inside segments for facilitators.
  @references petronas-incident-demo-blueprint.md §8
  @modified 2025-03-21
-->

**Demo title:** End-to-end incident management — Production Operations Visibility & Reporting  
**Audience:** Petronas (business + IT stakeholders)  
**Tone:** Calm, outcome-led; **one continuous story**—avoid a “feature checklist” voice.

---

## Quick reference — segments vs. slides

Use this if you build a **slide deck**: roughly **one slide per row** (optional title slide before, thank-you after).

| Slide | Minutes | Segment | Primary persona on screen |
|-------|---------|---------|---------------------------|
| 1 (title) | — | Optional pre-roll | — |
| 2 | 0:00–2:00 | Hook — symptom | Operations analyst / business user |
| 3 | 2:00–5:00 | DWP + AI Agent | End user |
| 4 | 5:00–8:00 | Intake — ITSM | End user + Service Desk |
| 5 | 8:00–12:00 | AIOps | IT Ops / NOC |
| 6 | 12:00–18:00 | Diagnose — ITSM + CMDB | L2/L3 + Data |
| 7 | 18:00–22:00 | Restore & verify | Resolvers + Service Desk |
| 8 | 22:00–25:00 | Close & learn | All / Knowledge |
| 9 | +1–2 min | Q&A buffer | — |

---

## Optional pre-roll (0:30–1:00) — not counted in 25 min

**Objective:** Set expectations; no live clicking yet.

**Say (suggested script):**  
“We’ll follow **one** production-visibility incident from the moment a business user sees something wrong, through how IT detects and resolves it, to how we **capture learning**. The thread is **intentionally single** so you can see how **DWP, ITSM, AIOps, and AI** reinforce each other—not four separate demos.”

**Show:** Title slide or static **architecture one-liner** (optional).

**Watch-out:** Don’t name every SKU in the first minute; anchor on **business outcome**.

**Transition:** “Let’s start where the story always starts—with someone who just needs the **right number on screen**.”

---

## Segment 1 — Hook: symptom (0:00 – 2:00)

**Slide 2 · Minutes 0–2**

| Min | What to do | Notes |
|-----|------------|--------|
| 0:00–0:45 | Show dashboard / portal with **stale or inconsistent** KPIs | Pause 2 seconds; let the room feel the problem |
| 0:45–1:30 | **Say:** stale totals, missing deferment categories, some timeouts—not sure if local | Business language first |
| 1:30–2:00 | **Transition:** “They shouldn’t need a PhD in IT to know **where to go next**.” | Cursor moves toward **DWP** |

**Say (script):**  
“Our operations analyst notices **production totals don’t match expectations** and **deferment breakdowns look wrong** for key offshore assets. That’s not just inconvenient—**planning and stewardship** depend on this view. The first question is always: **is it just me, or is the service degraded?**”

**Show:** Business-facing UI (demo data); optionally a second user profile for “regional ops center” same symptom.

**Watch-out:** Don’t dive into root cause here; **resist** jumping to AIOps.

**Transition:** “So they go to the **one front door** we want every employee to use—the **Digital Workplace**.”

---

## Segment 2 — DWP + AI Agent (2:00 – 5:00)

**Slide 3 · Minutes 2–5**

| Min | What to do | Notes |
|-----|------------|--------|
| 2:00–3:00 | Open **DWP**; show **service** in catalog or favorites | Pre-stage bookmarks |
| 3:00–4:15 | Open **AI Agent**; ask a **rehearsed** prompt | Must succeed in lab |
| 4:15–5:00 | Summarize **answer**: service context, known issues, **next step** | Ground in **service**, not generic chat |

**Suggested AI prompts (pick 1–2):**  
- “Is **Production Operations Visibility** degraded right now?”  
- “Who owns this service and what’s the **recommended** next step?”

**Say (script):**  
“Instead of guessing, the user asks in **plain language**. The **AI Agent** is scoped to our **service and knowledge**—so the answer is **actionable**: whether others are affected, where to **report**, and what the **service desk** needs to see.”

**Show:** DWP → AI panel → **clear** suggested action (e.g. open request, link to service).

**Watch-out:** If AI hallucinates in rehearsal, **tighten** knowledge scope or shorten prompt; never “wing” this live.

**Transition:** “Now we **formalize** the signal—high-quality **intake** into ITSM.”

---

## Segment 3 — Intake: incident quality (5:00 – 8:00)

**Slide 4 · Minutes 5–8**

| Min | What to do | Notes |
|-----|------------|--------|
| 5:00–6:00 | Create or enrich **Incident** from DWP | Template visible |
| 6:00–7:00 | Show **AI-suggested** title/category or **similar incidents** | Emphasize **speed + consistency** |
| 7:00–8:00 | Set **priority** with **business justification** brief | P1 only if story warrants |

**Say (script):**  
“This is where many organizations lose time: **vague tickets**. Here, **templates and AI assistance** give L1 a **clean** record—**similar incidents**, suggested **knowledge**, and a **priority** tied to **business impact**, not just ‘user says urgent’.”

**Show:** Incident form → **Service** field linked to **Production Operations Visibility** → save.

**Watch-out:** Don’t over-narrate every field; **two** highlights max.

**Transition:** “While the ticket is born, **operations monitoring** is already seeing **signals**—let’s look at how we **separate noise from signal**.”

---

## Segment 4 — AIOps: sense-making (8:00 – 12:00)

**Slide 5 · Minutes 8–12**

| Min | What to do | Notes |
|-----|------------|--------|
| 8:00–9:30 | Pivot to **AIOps** view: same **time window** as user symptom | Pre-correlated scenario |
| 9:30–10:45 | Show **correlation** / **anomaly** cluster tied to **service or CI** | One story, not 20 alerts |
| 10:45–12:00 | Optional: **probable cause** hint or **topology** slice | Pause for “aha” |

**Say (script):**  
“Without correlation, teams drown in **alert storms**. **AIOps** shows **related** events and **metric behavior** in the **same** window as the user’s pain—so NOC and IT Ops aren’t debating **whether** it’s real; they’re discussing **what to do**.”

**Show:** Event timeline / correlation; link back to **incident ID** if your lab supports it verbally.

**Watch-out:** Avoid deep drill-down into obscure KPIs; **one** correlated narrative.

**Transition:** “We’ve got **human** confirmation in ITSM and **machine** context in AIOps—now we **coordinate resolution**.”

---

## Segment 5 — Diagnose: ITSM + CMDB + collaboration (12:00 – 18:00)

**Slide 6 · Minutes 12–18**

| Min | What to do | Notes |
|-----|------------|--------|
| 12:00–13:30 | Open **Incident** workbench; show **tasks** to App / Data / Infra | Pre-assigned in lab |
| 13:30–15:00 | Show **CMDB** relationship: service → app → integration | **Swivel-chair** killer |
| 15:00–16:30 | **AI:** draft **customer-facing** update or **summarize** impact | Paste or show side panel |
| 16:30–18:00 | Mention **change calendar** if relevant to root cause | Sets up climax |

**Say (script):**  
“Resolution isn’t heroics—it’s **orchestration**. **Tasks** make ownership explicit. **CMDB** shows **dependencies** so we don’t argue about **blast radius**. And **AI** helps the duty manager **draft** a clear, calm **customer update**—still **human-approved**, but **faster**.”

**Show:** Tasks + **relationship** diagram or related CIs; optional **activity** stream.

**Watch-out:** If CMDB is thin in lab, use **one** relationship you’ve **seeded**; don’t improvise.

**Transition:** “The teams converge on a **likely root cause**—let’s walk through **restore and verify**.”

---

## Segment 6 — Restore & verify (18:00 – 22:00)

**Slide 7 · Minutes 18–22**

| Min | What to do | Notes |
|-----|------------|--------|
| 18:00–19:30 | Execute **runbook** or record **fix** (e.g. credential / batch) | Lab-friendly cause |
| 19:30–20:30 | **Verification** checklist; monitoring **green** | Before/after if possible |
| 20:30–22:00 | Optional **major incident** wrap if you showed MI mode | Else skip |

**Say (script):**  
“We **verify** before we celebrate. The **same** incident record captures **what changed**, **who did it**, and **how we know** service is healthy again—that’s **auditability** Petronas can stand behind.”

**Show:** Status → Resolved; **verification** notes; optional **metric** recovery.

**Watch-out:** Don’t fake a green screen if the lab isn’t ready—**narrate** verification criteria instead.

**Transition:** “Closing the incident isn’t the end—it’s the start of **learning**.”

---

## Segment 7 — Close & learn (22:00 – 25:00)

**Slide 8 · Minutes 22–25**

| Min | What to do | Notes |
|-----|------------|--------|
| 22:00–23:00 | **Problem** or **Known Error** candidate; link to incident | Or show backlog item |
| 23:00–24:00 | **Knowledge** article published; show in **DWP** search | Deflection proof |
| 24:00–25:00 | **AI:** “What happened?” summary for **self-service** next time | Bookend Segment 2 |

**Say (script):**  
“We **capture** the pattern so it doesn’t come back as **mystery tickets**. A **knowledge article** and **problem record** make the **next** user’s journey **shorter**—and **DWP** is where they’ll **find** it.”

**Show:** Closed incident → KB → DWP discovery.

**Watch-out:** Keep **problem** lightweight unless audience is **process-heavy**.

**Transition:** “That’s **one** incident, **one** thread—from **business symptom** to **controlled** resolution and **learning**.”

---

## Closing line (0:30)

**Say:**  
“If we take one idea away: **AI** here isn’t a chat toy—it’s **acceleration** inside **governed** processes—**DWP** for the front door, **ITSM** for action, **AIOps** for sense-making, and **humans** still **deciding**.”

**Open Q&A.**

---

## Facilitator cheat sheet — if something breaks

| Symptom | Recovery line |
|--------|----------------|
| AI slow or wrong | “In production we’d tighten **knowledge scope**; for now, the **intended** outcome is **service-grounded** guidance.” |
| AIOps sparse | “We’d **onboard** more sources; the **pattern** you’re seeing is **correlation** replacing noise.” |
| CMDB shallow | “The **value** is **dependency-aware** routing; in this tenant we’ve **modeled** the path that matters for the story.” |

---

*Align prompts and data with `petronas-incident-demo-blueprint.md` §10 prep checklist before dry run.*
