# API-Driven Data Load — What to Provide (Handoff Template)

<!--
  @generated
  @context Enable collaborative REST-based ingestion design for Petronas demo data; checklist of artifacts user shares with implementer/AI.
  @decisions Template-only; no secrets stored in repo; references Helix REST patterns generically.
  @references petronas-demo-data-ingestion-checklist.md
  @modified 2025-03-21
-->

Use this when you want help **ingesting demo data via REST**. Share the sections below (redact secrets; use placeholders in docs).

---

## 1. Environment

| Item | Your notes |
|------|------------|
| **Base URL(s)** | e.g. `https://<tenant>/api/...` (per product if split: ITSM, DWP, Platform Core) |
| **Auth** | OAuth / JWT / API key / Basic — **how** tokens are obtained (doc link or steps) |
| **API version / doc** | Link to official BMC API doc or OpenAPI if you have it |

---

## 2. What you want loaded (targets)

Check what applies. Maps to `petronas-demo-data-ingestion-checklist.md`.

| Target | Load? | Notes |
|--------|-------|--------|
| Business service + CIs + relationships (CMDB) | ☐ | Record definition names if known |
| Incident template / sample incidents | ☐ | |
| Knowledge articles | ☐ | |
| DWP catalog / offerings (if API-exposed) | ☐ | Often configured in UI; note if only ITSM/CMDB APIs exist |
| AIOps events/metrics (if REST ingestion) | ☐ | |

---

## 3. Endpoints you already have

For **each** endpoint, paste (or attach) **one** of:

- OpenAPI snippet, or  
- Doc excerpt with **method, path, query/body schema**, or  
- Example **request + response** (sanitized)

| # | Purpose (your words) | Method | Path | Body summary |
|---|----------------------|--------|------|--------------|
| 1 | e.g. create CI | POST | | |
| 2 | | | | |

---

## 4. Constraints

| Item | Notes |
|------|--------|
| **Rate limits** | |
| **Idempotency** | Can we re-run creates? Need delete/cleanup APIs? |
| **Mandatory fields** | Per record type (list any that blocked you before) |
| **Environments** | Dev / lab only? |

---

## 5. What you can expect back from a collaborator (e.g. AI-assisted)

Given the above, we can help with:

- **Mapping table**: source JSON → Helix field IDs / record definitions  
- **Ordered sequence**: e.g. CI before relationship; service before incident  
- **curl or script** (Bash, Python, or Node) with **env vars** for URL/token  
- **Validation steps**: GET after POST to confirm  
- **Rollback**: delete sequence or test record naming prefix (`DEMO-POV-...`)

**Not in repo:** real tokens, passwords, or customer URLs—keep those in your vault / `.env` (gitignored).

---

## 6. Security

- Never commit **live credentials** or full production responses with PII.  
- Prefer **lab tenant** and **synthetic** names (`DEMO-*`) for CIs and incidents.

---

*Fill this in and share alongside your endpoint list to start ingestion design.*
