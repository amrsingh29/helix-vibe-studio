# IT Asset Transfer — Inter-Site Relocation with Fulfillment (HAM Use Case)

<!--
  @generated
  @context User requested an updated asset-transfer storyline: employee relocates between locations with existing laptop/desktop physically moved; fulfillment work order; all systems reflect the change; mandatory workflow task catalog with task names and descriptions per task.
  @decisions Document as extended scenario vs administrative-only transfer; SR approval then WO for logistics; CMDB/asset update tied to WO completion; optional Discovery reconciliation; tasks grouped into SR phase, WO fulfillment, system/automation, and closeout.
  @references PETRONAS-ITAM-FULL-DEMO-GUIDE.md Phase 5; NEOMED TeamDynamix relocating employee technology KB; Gartner HAM category themes; chain-of-custody industry articles (E-XPIRE, HOBI).
  @modified 2026-04-30
-->

This document defines a **high-fidelity HAM use case**: an employee **keeps the same assigned device** but **moves workplace** from **Location A → Location B** (e.g. different city, campus, or OPU). The device may be a **laptop** or a **heavy desktop** (plus dock/monitors where applicable). The process must include a **fulfillment / execution track** (typically a **Work Order** or equivalent) so logistics and IT field work are not “paper only,” and **all authoritative systems** reflect the move.

**Baseline in your pack:** `PETRONAS-ITAM-FULL-DEMO-GUIDE.md` Phase 5 today describes **approval → update asset record** without an explicit fulfillment ticket. This document **extends** that pattern for **physical relocation**.

---

## 1. Research: what enterprises actually execute

Practitioner and industry material consistently separates **(a) governance & record updates** from **(b) physical handling & verification**. Common real-world steps:

| Theme | What gets done | Why it matters |
|--------|------------------|----------------|
| **Pre-move prep** | Backup reminder; power-down / disconnect guidance; label/tag assets; list peripherals (dock, monitors, phone) | Reduces loss/damage; clarifies scope ([NEOMED — Relocating Employee Technology](https://neomed.teamdynamix.com/TDClient/1938/Portal/KB/ArticleDet?ID=168629)) |
| **Scheduling** | Move window, access to old/new site, dock/loading bay | Avoids unattended equipment in transit |
| **Physical logistics** | Internal courier / facilities / approved vendor; packaging for sensitive gear | Transport is a **risk window** (custody, tampering, loss) ([E-XPIRE — chain of custody in logistics](https://e-xpire.com/blog/secure-it-asset-logistics-transportation/)) |
| **Chain of custody** | Manifest (serials), handoff signatures or scans at pickup and delivery | Audit and security evidence ([HOBI — chain of custody guide](https://hobi.com/secure-chain-of-custody-a-practical-guide-for-multisite-enterprises/)) |
| **Post-move technical** | Reconnect at new desk; network drop / port; login and smoke test | Confirms service restoration |
| **Post-move administrative** | **Update authoritative inventory** (location/site/room, cost centre if policy triggers) | CMDB/ITAM stays aligned with reality ([xAssets — transfers and history](https://www.xassets.com/docs/itam-guide/asset-management/transfers)) |
| **Verification** | Optional second pass: Discovery/MDM “last seen” at new site, or spot audit | Closes the loop when automation updates lag |

**Note:** For **simple same-building desk moves**, some orgs use **employee self-move + ticket to update location** only. For **inter-site** or **heavy equipment**, a **fulfillment WO** (or vendor task) is the norm.

---

## 2. Storyline (demo-friendly)

**Persona:** **Alex** (same employee before and after the move).  
**Asset:** Assigned **laptop** or **desktop workstation** (and optionally **dock + dual monitors** as child items or line items on the request).  
**Trigger:** Alex is **relocating** from **Kuala Lumpur Office (KL-01)** to **Kuantan Regional Hub (KU-02)** (use your neutral site names).  
**Requirement:** Equipment must be **formally packed, transported, and received** at the destination; **IT Asset Transfer** is approved; a **Work Order** tracks pickup → in-transit → delivery → reconnect support; **CMDB / Asset** shows new **Site / Location / Room** and correct **Assigned User**; **movement dashboard** shows the event.

**Twist for “heavy desktop”:** Fulfillment includes **two-person handling** or **vendor crate** flag; WO task template differs from laptop-only.

---

## 3. End-to-end use case flow (recommended steps)

### Phase A — Intake & planning

1. **Request created** (catalog): *Inter-site equipment relocation* or extended **IT Asset Transfer** with fields: Asset ID(s), serials, **From site / building / room**, **To site / building / room**, planned move date, peripherals list, special handling (desktop/heavy), data classification (standard vs sensitive—optional).
2. **Validation**: Asset exists; assigned to Alex; status allows move (e.g. not already in transit, not disposed).
3. **Approvals**: Manager (org change); optional **ITAM** (cross-OPU/cost centre); optional **Site lead** at destination (space/network readiness).

### Phase B — Fulfillment (Work Order)

4. **WO generated** on approval (or on approval of a specific fulfillment phase): owner = **Logistics / Field Services / IT Support** queue.
5. **Pre-move tasks** (WO line or tasks): Notify Alex of backup / shutdown checklist; confirm **pickup window**; confirm **destination desk** and network port (if Facilities/Telecom use separate SR, link as **related**).
6. **Pickup**: Field tech scans serial / asset tag; records condition; **chain-of-custody** handoff (sign-off or digital acknowledgment); package for transport.
7. **In transit**: Status on WO; optional carrier tracking ID (if vendor).
8. **Delivery**: Receive at KU-02; scan serial; deliver to desk/storage; handoff to Alex or onsite IT.
9. **Reconnect / smoke test** (optional WO task): Power, network, monitors; basic login test; escalate if port/VLAN wrong.

### Phase C — System of record updates (must align)

10. **Update Asset / CI** (automated on WO completion or manual with guardrails): **Location, Site, Building, Room**; **Assigned User** unchanged (Alex); update **Department / Cost Centre** only if the relocation policy requires it (many orgs: user org changes → cost centre changes).
11. **Inventory movement / audit**: Movement history entry tied to SR + WO IDs.
12. **Notifications**: Alex, manager, ITAM; optional security if asset class is sensitive.

### Phase D — Verification & close

13. **Discovery / reconciliation** (scheduled or on-demand after device on new network): CI reflects new network context; confirm **no duplicate** location records.
14. **Close SR** after WO complete and asset verified (or define “complete” as WO + successful Discovery ping within N days).
15. **Dashboards**: Phase 6 movement panel shows transfer event; location report shows asset under **KU-02**.

---

## 4. Mandatory workflow tasks — task names and descriptions

Implement these as **workflow activities** on the Service Request, **tasks or labor lines** on the Work Order, **automated transitions**, or **approval gates**—depending on your Helix configuration. Every row is part of the **complete** inter-site relocation story (same user, physical move, systems aligned).

### 4.1 Service Request phase (intake, validation, approval)

| # | Task name | Description |
|---|-----------|-------------|
| **SR-01** | **Validate relocation request** | Confirm the request is complete (from/to site, building, room, planned date, asset IDs, peripherals, heavy-item flag). Validate that each asset exists, is **not** disposed, and is **assigned to the requester** (or policy-allowed delegate). |
| **SR-02** | **Check relocation policy rules** | Evaluate cross-OPU / cross–cost centre rules, data classification constraints, and whether **ITAM** or **Security** approval is required before logistics starts. |
| **SR-03** | **Manager approval — relocation** | Line manager confirms the employee move is legitimate, dates are acceptable, and business justification is recorded. |
| **SR-04** | **ITAM approval — asset relocation** (conditional) | ITAM confirms the asset may leave the origin cost centre/site, financial/stock rules are satisfied, and the target location is a **valid** asset location in the CMDB. Skip if policy does not require ITAM for this path. |
| **SR-05** | **Destination site readiness approval** (conditional) | Site lead or facilities delegate confirms **desk/space** and **logistics access** at the destination (dock, receiving hours, escort). Skip if folded into a related Facilities SR. |
| **SR-06** | **Security approval — high-risk asset** (conditional) | For regulated or encrypted-device policies, security confirms transport controls and encryption posture are acceptable before pickup. Skip for standard corporate devices. |
| **SR-07** | **Spawn fulfillment work order** | On successful approvals, **create and link** the Work Order to this Service Request; copy asset list, serials, from/to addresses, move window, and special-handling flags onto the WO. |
| **SR-08** | **Notify requester — approvals complete** | Inform the employee that logistics will schedule pickup; include link to WO and pre-move checklist (or attach KB). |

### 4.2 Work Order phase — planning and pre-move

| # | Task name | Description |
|---|-----------|-------------|
| **WO-01** | **Assign fulfillment owner** | Assign the Work Order to the **Logistics / Field Services / IT Support** group (or named coordinator) and set priority/target dates from the SR. |
| **WO-02** | **Confirm destination desk and space** | Verify cube/office number, building access, and where equipment will be **placed** (desk vs secure holding). Update WO notes with confirmed drop point. |
| **WO-03** | **Coordinate network and voice at destination** (conditional) | If required, open or reference a **Telecom / Network** child request for port, VLAN, patch, or desk phone extension; link ticket ID to the WO. |
| **WO-04** | **Schedule pickup window with requester** | Agree date/time for pickup at origin; confirm requester availability for handoff and power-down. |
| **WO-05** | **Confirm origin site access** | Arrange building access, escort, parking, or loading bay as required by site security; record contact and access instructions for field tech. |
| **WO-06** | **Prepare packaging and handling plan** | Select appropriate packaging (laptop bag/carton, desktop crate, anti-static materials, monitor boxes). For **heavy desktop**, flag **two-person lift** or vendor crate per safety policy. |
| **WO-07** | **Send pre-move checklist to requester** | Send backup reminder, save-work reminder, shutdown steps, peripheral disconnect order, and “do not leave equipment unattended” guidance; confirm receipt or acknowledgment if required. |

### 4.3 Work Order phase — pickup, custody, and transport

| # | Task name | Description |
|---|-----------|-------------|
| **WO-08** | **Execute pickup at origin** | Field tech arrives at scheduled window; identifies workspace; powers down equipment if still on (per checklist). |
| **WO-09** | **Verify asset identity at pickup** | Scan or manually verify **asset tag** and **serial number** against the WO manifest; record any variance as an exception for ITAM. |
| **WO-10** | **Record physical condition at pickup** | Capture cosmetic damage, missing peripherals, or cable issues with **photos and notes** for chain-of-custody and dispute avoidance. |
| **WO-11** | **Collect bundled peripherals** | Verify dock, monitors, keyboard, mouse, power bricks, and cables against the SR peripheral list; bag and label cables; update manifest if items are missing or left behind intentionally. |
| **WO-12** | **Chain-of-custody — origin handoff** | Requester (or delegate) and field tech **sign off** (digital or paper) that listed assets left custody of the employee/site at recorded time; attach manifest snippet to WO. |
| **WO-13** | **Pack and seal for transport** | Pack equipment per handling plan; apply **tamper-evident** or security seals where policy requires; label packages with destination, WO number, and serial. |
| **WO-14** | **Mark asset in transit** (optional system task) | If your process uses an interim state, set asset status to **In transit** (or equivalent) from pickup completion until delivery acceptance. |
| **WO-15** | **Execute transport** | Move sealed equipment via approved internal courier or **vendor** route; record carrier name and tracking ID on the WO if external. |
| **WO-16** | **In-transit checkpoint** (conditional) | For long-haul or multi-stop moves: verify seal integrity at hub or handoff point; log time and handler ID. |

### 4.4 Work Order phase — delivery, install, and technical verification

| # | Task name | Description |
|---|-----------|-------------|
| **WO-17** | **Receive shipment at destination site** | Receiving dock or IT intake scans packages against manifest; note discrepancies before unpack. |
| **WO-18** | **Verify asset identity at delivery** | Unpack and re-scan **asset tag** and **serial** against WO; confirm match before install. |
| **WO-19** | **Chain-of-custody — destination handoff** | Sign-off that custody transferred from transport to **onsite IT** or **requester** at destination location and time. |
| **WO-20** | **Deliver to final desk location** | Move equipment from receiving to the assigned office/cube; confirm floor/room matches SR **To** location. |
| **WO-21** | **Reconnect hardware at new desk** | Reconnect power, network, monitors, dock, and peripherals per standard desk setup; cable-manage per site standards. |
| **WO-22** | **Validate network connectivity** | Confirm link light, IP/DHCP or static assignment, domain reachability; if failure, capture error and **escalate** to Telecom with port/VLAN details. |
| **WO-23** | **Smoke test — user session** | Boot OS, login test (or IT test account), verify dual monitors, dock USB/DisplayLink if used, and critical apps reach corporate resources. |
| **WO-24** | **Requester acceptance** | Employee confirms equipment works at new location (or declines with defect list); capture sign-off date/time for closure policy. |

### 4.5 System of record and automation (often workflow automation on WO completion)

| # | Task name | Description |
|---|-----------|-------------|
| **SYS-01** | **Update ITAM asset — location** | Set **Site, Location, Building, Room** (and floor/region if modeled) to destination values from the approved SR; keep **Assigned User** unchanged unless policy also changes person. |
| **SYS-02** | **Update financial / org attributes** (conditional) | If relocation changes **Cost Centre, Department, or OPU** per HR move, update those fields on the asset from authoritative HR or approval payload; otherwise skip. |
| **SYS-03** | **Update CMDB / CI relationships** | Point the device CI’s relationship to the **new Location / Site** CI; ensure no orphaned links to old location. |
| **SYS-04** | **Clear in-transit status** | Return asset operational status to **In use / Deployed** after successful delivery and acceptance. |
| **SYS-05** | **Write inventory movement / audit entry** | Persist a dated **movement record** (from → to, SR ID, WO ID, actors, serials) for ITAM audit and dashboard feeds. |
| **SYS-06** | **Attach fulfillment evidence to SR/WO** | Consolidate photos, manifests, sign-offs, and carrier tracking as **attachments or work log** for future audits. |

### 4.6 Verification, notifications, and closeout

| # | Task name | Description |
|---|-----------|-------------|
| **CL-01** | **Notify stakeholders — move complete** | Notify employee, manager, and ITAM that physical move and asset update are complete; include asset ID and new location summary. |
| **CL-02** | **Trigger Discovery scan or reconciliation** | Schedule or run Discovery for the destination subnet/site so the **discovered inventory** aligns with the updated CMDB record. |
| **CL-03** | **Reconcile Discovery vs CMDB** | Compare last-seen location, hostname, or IP context to expected destination; open **exception task** if mismatch (wrong VLAN, duplicate CI, ghost record). |
| **CL-04** | **Close work order** | Set WO to **Completed/Closed** with resolution notes, actual dates/times, and final handler. |
| **CL-05** | **Close service request** | Close SR as **Fulfilled** with links to WO and movement record; ensure SLA timers stop. |
| **CL-06** | **Refresh movement dashboard / metrics** | Confirm the transfer appears in **management movement** views (Phase 6) per your reporting data source (event, WO, or asset history). |

### 4.7 Optional tasks (include when your org requires them)

| # | Task name | Description |
|---|-----------|-------------|
| **OPT-01** | **Lease / finance notification** | If asset is leased, notify lessor or update lease location per contract. |
| **OPT-02** | **Insurance / declared value** | For high-value moves, record declared value and policy reference on WO. |
| **OPT-03** | **MDM / endpoint sync check** | Confirm device checks in on new network in Intune/JAMF/etc. for policy compliance reporting. |
| **OPT-04** | **Related Facilities move ticket** | Track furniture/non-IT move separately but **link** as related for same employee move date. |

### 4.8 Mapping hint for Helix builders

| Group | Typical Helix artifact |
|-------|-------------------------|
| **SR-01 … SR-08** | Service Request workflow stages, approvals, and **Create WO** transition |
| **WO-01 … WO-24** | Work Order **tasks** or **labor templates** (sequence may be parallelized where safe, e.g. WO-03 while WO-04 runs) |
| **SYS-01 … SYS-06** | Workflow automation, integration, or **Fulfillment application** actions on WO status change |
| **CL-01 … CL-06** | Notifications, Discovery job hooks, SR/WO closure rules |

**Demo minimum:** If time is short, **collapse** tasks into fewer WO lines but still **narrate** custody (WO-09, WO-12, WO-18, WO-19), install (WO-21–WO-23), and system update (**SYS-01**, **SYS-05**, **CL-02**).

---

## 5. “All systems must reflect this change” — checklist

| System / record | What must change |
|-----------------|------------------|
| **ITAM Asset** | Site, location, room (and department/cost centre if policy says so); status e.g. *In use* / *In transit* during WO if you model interim states |
| **CMDB / CI** | Same identifiers; relationship to **Location / Site** CI; optional link to **People** unchanged |
| **Work Order** | Lifecycle: Open → In Progress → Closed; proves fulfillment happened |
| **Service Request** | Approved → Fulfilled → Closed; linked to WO |
| **Movement / audit** | Dated event: from → to, actor, evidence (work notes, scans) |
| **Facilities / Telecom** (if in scope) | New cube/office, patch panel, voice—either updated via related tickets or referenced in WO notes |
| **MDM / Endpoint tool** (optional demo) | Last-seen site after enrollment on new VLAN (nice-to-have proof) |
| **Reporting** | Asset movement dashboard picks up the transfer |

---

## 6. How to build this on BMC Helix (plan)

### 6.1 Design choice

| Option | Description | When to use |
|--------|-------------|-------------|
| **A. Extend IT Asset Transfer** | Same catalog item; workflow after approval **creates WO** and only **auto-updates asset on WO closure** | Minimal catalog sprawl; one front door |
| **B. New catalog item** | e.g. **“Inter-site equipment relocation”** distinct from quick administrative transfers | Clearer UX for heavy logistics vs simple data fix |

**Recommendation for Petronas demo:** **Option B** if you want a crisp story; **Option A** if catalog governance limits new items.

### 6.2 Workflow building blocks

1. **Service request model / questionnaire**: From/To location hierarchy; asset picker constrained to “assigned to requester”; peripherals; move date; heavy-item flag.
2. **Approval flow**: Manager (+ ITAM for cross-OPU if aligned to your Phase 5 narrative).
3. **Fulfillment**: **Work Order template** whose tasks map to **§4** (SR through WO, system, and closeout groups). Default narrative: Prepare → Pickup → Transit → Deliver → Reconnect → Verify.
4. **Automation** (workflow or integration): On **WO Resolved/Completed**, run **Update Asset** (REST or native action) with target location from SR; clear “In transit” if used; write work note with WO number.
5. **Related records**: SR ↔ WO linkage; optional Related Item to Facilities ticket.
6. **Notifications**: Email/in-app at approval, pickup complete, delivery complete.
7. **Discovery**: Schedule scan post-move or show manual “reconcile” in demo script.

### 6.3 Data prep (demo)

- Pre-stage **Alex**, asset **AST-#####**, **KL-01** and **KU-02** as valid **Location/Site** CIs.  
- Ensure **movement dashboard** data source includes **WO completion** or **asset history** events (whatever your dashboard uses today).  
- Script **one** full happy path + **one** recovery line (e.g. wrong room → corrective task).

### 6.4 Roles

| Role | Responsibility in flow |
|------|-------------------------|
| **Alex** | Submit request; prep device; accept at destination |
| **Manager** | Approve relocation |
| **ITAM** | Policy / cross-OPU approval if needed |
| **Field / Logistics** | Execute WO, custody, scans |
| **Service Desk / Local IT** | Reconnect / port issues |

---

## 7. Final outcome (success criteria)

After the flow completes:

1. **SR** and **WO** are **Closed** with a clear **audit trail** (who moved what, when, from where to where).  
2. **Asset record** shows **new site/location** (and other attributes per policy) while **ownership remains Alex** unless you explicitly model user change.  
3. **Movement dashboard** reflects the **transfer** (or “relocation completed” event per your metric definition).  
4. **Discovery** (or manual verification) **confirms** the device is visible in the **new** environment—narrative: “systems agree.”  
5. **Stakeholder story:** “This was not only a CMDB edit—we **executed** a governed physical move and **proved** it.”

---

## 8. Demo script (short)

1. Show Alex **My Assets** — device at **KL-01**.  
2. Submit **relocation** request → approval.  
3. **WO appears** — walk through tasks or at minimum **Open → Closed** with pickup/delivery notes and serial scan.  
4. Open same asset — **KU-02**; Alex still assignee.  
5. Open **movement** view — event visible.  
6. (Optional) Run or show **Discovery** delta / last scan for that CI.

---

## 9. References (external)

- [NEOMED — Relocating Employee Technology](https://neomed.teamdynamix.com/TDClient/1938/Portal/KB/ArticleDet?ID=168629) — practical pre/during/post move steps for assigned equipment.  
- [xAssets — Transfers](https://www.xassets.com/docs/itam-guide/asset-management/transfers) — classification updates and history for location/cost centre moves.  
- [Gartner Peer Insights — Hardware Asset Management Tools](https://www.gartner.com/reviews/market/hardware-asset-management-tools) — category emphasis on lifecycle, custody, integration.  
- [E-XPIRE — Secure IT asset logistics & chain of custody](https://e-xpire.com/blog/secure-it-asset-logistics-transportation/) — why transport is a controlled process.  
- [HOBI — Chain of custody for multisite enterprises](https://hobi.com/secure-chain-of-custody-a-practical-guide-for-multisite-enterprises/) — identification, verification, traceability at handoffs.

---

*Use alongside `PETRONAS-ITAM-FULL-DEMO-GUIDE.md` Phase 5 (see Phase 5 extension for fulfillment path).*
