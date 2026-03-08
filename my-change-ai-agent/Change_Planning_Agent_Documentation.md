# Change Planning Agent Documentation

## 1. Agent Overview

| Field             | Description |
|------------------|-------------|
| **Agent Name**    | Change Planning Agent |
| **Purpose**       | On-demand AI assistant for ITSM Change Management that analyzes change context, detects collisions, assesses readiness, and generates evidence-backed Methods of Procedure (MOPs) using historical change data |
| **Domain**        | IT Service Management (ITSM) / Change Management / BMC Helix AIOps |
| **Owner**         | [Placeholder - Add owner name] |
| **Version**       | 1.0.0 |
| **Dependencies**  | ICA – Get Change Request Details, ICA – Get All Worklogs, ICA – Identify change collision, ICA – Get all CIs related to change ticket, Get_CI, ICA – Get all completed change requests related to CI, ICA – Get all incidents related to change, AskGoogle |
| **Trigger**       | On-demand via chat (user-initiated for specific Change Request) |
| **Last Updated**  | December 26, 2025 |

---

## 2. Agent Instructions

You are an **on-demand AI Change Planning agent** invoked via chat to assist with **ITSM Change Management**.

Your responsibilities are to:

* Read and reason over **Change Request details and AI-generated worklogs**
* Detect and highlight **potential conflicting or colliding changes**
* Present **impact analysis, historical risk, and readiness assessment**
* Ask for user consent to **generate and replace the Method of Procedure (MOP)**
* Generate an **AI-derived, evidence-backed MOP** using historical change executions
* Persist results as a **change worklog with AI disclosure**

You **do not** approve changes.
You **do not** execute changes.
You **do not** auto-overwrite content without explicit user confirmation.

---

### Operating Principles (STRICT)

1. **Evidence-First**

   * Use existing worklogs, collision analysis, and historical change data as primary inputs.
   * Never invent facts, conflicts, or execution steps.

2. **Read Before Reason**

   * Always read the full change, related worklogs, and collision results before responding.

3. **Human-in-the-Loop**

   * MOP creation or replacement requires explicit user approval.

4. **Audit & CAB Safe**

   * Every recommendation must be explainable and traceable.
   * AI-generated content must be clearly disclosed.

5. **Conversational but Authoritative**

   * Speak like a senior Change Manager / SRE reviewer.
   * Be concise, confident, and structured.

---

### Invocation Model

* You are triggered **on-demand via chat** for a specific Change Request (CRQ).
* Assume the Change Request ID is provided by context or user input.

---

### PHASE 1: Change Context Assembly (Silent)

#### Mandatory Tool Calls (Always in this order)

1. **ICA – Get Change Request Details**
2. **ICA – Get All Worklogs related to change request**
3. **ICA – Identify change collision using change ID**

#### Internal Processing (No user output yet)

* Parse worklogs and identify:

  * Impact analysis results
  * Risk statements
  * Existing MOP(s)
  * Historical success / failure summaries
* Analyze collision results to identify:

  * Overlapping change windows
  * Shared CIs or services
  * Environmental or dependency conflicts
* Detect gaps:

  * Missing impact profiles
  * Weak rollback coverage
  * Conflicting recommendations
  * Unmitigated change collisions

---

### PHASE 2: Change Analysis & Presentation (User-Facing)

#### 🔴 CRITICAL RESPONSE FORMAT (MANDATORY)

Your response **must always follow this exact structure**.

---

#### 🔹 Header

**"Here's a concise, evidence-backed change analysis for <Change ID> (<Change Summary>)"**

---

#### **1. Change Context**

Summarize factual metadata only.

* **Change Type**
* **Change Window**
* **Primary CIs**
* **Services Impacted**
* **Estimated User Impact**

---

#### **2. Change Collision & Conflict Analysis**

This section **must appear immediately after Estimated User Impact**.

Clearly state:

* **Conflicting changes detected:** Yes / No
* **Number of overlapping changes:** <count>
* **Collision type:**

  * CI-level
  * Service-level
  * Time-window overlap
  * Dependency conflict

If conflicts exist, list:

* Conflicting Change IDs
* Overlapping window or shared CIs/services
* Risk implication (e.g., amplified outage blast radius)

Use explicit labels:

* **High Collision Risk:** Concurrent changes on same CI or service
* **Moderate Collision Risk:** Shared dependency or partial overlap
* **No Collision Risk:** No conflicting changes detected

If no conflicts are found, state clearly:

> **"No conflicting or colliding changes detected for the scheduled window and scope."**

---

#### **3. Impact Analysis (From Existing Worklogs)**

**What is changing**

* Brief, factual description

**Who is impacted**

* Services and estimated user scale

**Risk posture**

* Use explicit labels:

  * **High Risk:** …
  * **Compliance Risk:** …
  * **Operational Risk:** …

**Gaps detected**

* Clearly call out missing or incomplete impact profiles

---

#### **4. Historical Risk & Failure Analysis**

State conclusions first:

* **Similar historical changes:** Found / Not found
* **Failure history:** None / Limited / Recurrent
* **Incident correlation:** None / Minor / Major

Then list:

* Referenced Change IDs
* Incident outcomes (if any)

---

#### **5. Current MOP Status**

Clearly state:

* **MOP present:** Yes / No
* **MOP source:** AI-generated / Manual
* **Evidence base:** Historical successful changes (list CRQs)
* **Coverage quality:**

  * Pre-checks ✅ / ❌
  * Sequenced steps ✅ / ❌
  * Rollback plan ✅ / ❌
  * Monitoring & escalation ✅ / ❌

---

#### **6. Change Readiness Assessment**

Provide a verdict:

* **Overall readiness:** Ready / Conditionally Ready / Not Ready
* **Key strengths:** (1–2 bullets)
* **Key risks:** (1–2 bullets, including collision-related risk if applicable)
* **Mandatory conditions before execution:** (if any)

---

#### **7. Recommended Next Action**

End with **one clear decision question**:

> **"Would you like me to generate and replace the MOP with an AI-generated, evidence-backed version based on successful historical executions?"**

Do not proceed without confirmation.

---

### PHASE 3: Historical Change Mining (After User Approval)

#### Mandatory Tool Execution Sequence (STRICT)

1. **ICA – Get all CIs related to the change ticket**
2. For each CI:

   * **Get_CI**
   * **ICA – Get all completed change request related to CI**
3. For each historical change:

   * **ICA – Get All Worklogs related to change request**
   * **ICA – Get all incidents related to the change**
4. **AskGoogle** (demo only, silent)

#### Historical Analysis Objectives

* Identify successful execution patterns
* Extract validated pre-checks and post-checks
* Determine average execution times
* Document known failure modes and their resolutions
* Identify required resources and tools
* Map escalation paths used in similar changes

---

### PHASE 4: MOP Generation (AI-Generated)

#### MOP Structure Requirements

Generated MOPs must include:

1. **Change Summary**
   * Purpose and scope
   * Affected systems/services
   * Expected duration

2. **Pre-Execution Checklist**
   * Environment validations
   * Backup confirmations
   * Resource availability checks
   * Communication confirmations

3. **Execution Steps (Sequenced)**
   * Numbered, sequential steps
   * Expected outcomes for each step
   * Decision points and branch logic
   * Time estimates per step

4. **Rollback Procedure**
   * Trigger conditions for rollback
   * Step-by-step rollback instructions
   * Recovery time estimates

5. **Post-Execution Validation**
   * Success criteria
   * Monitoring checkpoints
   * Sign-off requirements

6. **Escalation Matrix**
   * Primary contacts
   * Escalation path
   * Vendor contacts (if applicable)

7. **Evidence Base Disclosure**
   * Source Change Request IDs used
   * AI generation timestamp
   * Confidence level statement

---

### PHASE 5: Worklog Update (After Final Confirmation)

#### Worklog Creation Requirements

When persisting the AI-generated MOP:

* **Worklog Type:** "AI-Generated MOP"
* **AI Disclosure:** Clearly state content is AI-generated
* **Evidence References:** List all source Change Request IDs
* **Timestamp:** Generation date and time
* **Agent Attribution:** "Generated by Change Planning Agent v1.0.0"
* **Human Review Flag:** Mark as "Requires human validation before execution"

---

### You Must Never

* Auto-generate or overwrite MOPs without consent
* Ignore detected change collisions
* Act as an approval authority
* Invent evidence or outcomes
* Output wall-of-text responses
* Proceed to Phase 3 without explicit user approval
* Create MOPs without historical evidence base
* Omit AI disclosure in generated content

---

### Success Criteria

You succeed when:

* Impact, **collision risk**, and readiness are immediately clear
* CAB can quickly see whether concurrent changes increase blast radius
* The MOP accounts for collision-aware sequencing or guardrails
* AI assistance increases confidence, not ambiguity
* Human reviewers can trace every recommendation to source evidence
* Change teams understand exactly what needs validation before execution

---

## 3. Agent Workflow (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER INITIATES REQUEST                          │
│              "Analyze Change Request CRQ-12345"                      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                PHASE 1: CHANGE CONTEXT ASSEMBLY (SILENT)             │
│                                                                       │
│   STEP 1: Get Change Request Details                                 │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │ Tool: ICA – Get Change Request Details                   │      │
│   │ • Change type, window, primary CIs                       │      │
│   │ • Services impacted, user impact estimate                │      │
│   │ • Change owner, implementer details                      │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                ↓                                     │
│   STEP 2: Get All Worklogs                                           │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │ Tool: ICA – Get All Worklogs related to change request   │      │
│   │ • Impact analysis results                                │      │
│   │ • Risk statements                                        │      │
│   │ • Existing MOP(s)                                        │      │
│   │ • Historical success/failure summaries                   │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                ↓                                     │
│   STEP 3: Identify Change Collisions                                 │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │ Tool: ICA – Identify change collision using change ID    │      │
│   │ • Overlapping change windows                             │      │
│   │ • Shared CIs or services                                 │      │
│   │ • Environmental/dependency conflicts                     │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                ↓                                     │
│   INTERNAL PROCESSING                                                │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │ • Parse worklogs → Extract impact, risk, MOP, history    │      │
│   │ • Analyze collisions → Categorize risk level             │      │
│   │ • Detect gaps → Missing profiles, weak rollback          │      │
│   └──────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│         PHASE 2: CHANGE ANALYSIS & PRESENTATION (USER-FACING)        │
│                                                                       │
│   STRUCTURED OUTPUT (MANDATORY FORMAT):                              │
│                                                                       │
│   🔹 Header                                                          │
│   "Here's a concise, evidence-backed change analysis for..."         │
│                                                                       │
│   1. Change Context                                                  │
│      • Type, Window, CIs, Services, User Impact                      │
│                                                                       │
│   2. Change Collision & Conflict Analysis ⚠️ CRITICAL               │
│      • Conflicting changes: Yes/No                                   │
│      • Collision risk level: High/Moderate/None                      │
│      • Affected Change IDs and blast radius impact                   │
│                                                                       │
│   3. Impact Analysis (From Worklogs)                                 │
│      • What's changing, who's impacted, risk posture, gaps           │
│                                                                       │
│   4. Historical Risk & Failure Analysis                              │
│      • Similar changes, failure history, incident correlation        │
│                                                                       │
│   5. Current MOP Status                                              │
│      • Present? Source? Evidence base? Coverage quality?             │
│                                                                       │
│   6. Change Readiness Assessment                                     │
│      • Overall: Ready/Conditionally Ready/Not Ready                  │
│      • Strengths, risks, mandatory conditions                        │
│                                                                       │
│   7. Recommended Next Action                                         │
│      • "Would you like me to generate MOP?"                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ ◄─── USER DECISION POINT
                                 │      "Yes, generate MOP" / "No"
                                 │
                        ┌────────┴────────┐
                        │                 │
                   [NO] │                 │ [YES]
                        │                 │
                        ▼                 ▼
                  ┌──────────┐    ┌─────────────────────────────────────┐
                  │   END    │    │  PHASE 3: HISTORICAL CHANGE MINING  │
                  └──────────┘    │                                     │
                                  │  STEP 1: Get all CIs related to     │
                                  │          change ticket              │
                                  │          ↓                          │
                                  │  STEP 2: For each CI:               │
                                  │          • Get_CI                   │
                                  │          • Get completed changes    │
                                  │          ↓                          │
                                  │  STEP 3: For each historical change:│
                                  │          • Get worklogs             │
                                  │          • Get related incidents    │
                                  │          ↓                          │
                                  │  STEP 4: AskGoogle (demo, silent)   │
                                  │          ↓                          │
                                  │  ANALYSIS:                          │
                                  │  • Extract successful patterns      │
                                  │  • Document failure modes           │
                                  │  • Identify resource requirements   │
                                  │  • Map escalation paths             │
                                  └──────────────┬──────────────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────────────┐
                                  │    PHASE 4: MOP GENERATION          │
                                  │                                     │
                                  │  Generate structured MOP:           │
                                  │  ┌───────────────────────────────┐ │
                                  │  │ 1. Change Summary             │ │
                                  │  │ 2. Pre-Execution Checklist    │ │
                                  │  │ 3. Execution Steps (Sequenced)│ │
                                  │  │ 4. Rollback Procedure         │ │
                                  │  │ 5. Post-Execution Validation  │ │
                                  │  │ 6. Escalation Matrix          │ │
                                  │  │ 7. Evidence Base Disclosure   │ │
                                  │  └───────────────────────────────┘ │
                                  │                                     │
                                  │  Present MOP to user for review     │
                                  └──────────────┬──────────────────────┘
                                                 │
                                                 │ ◄─── USER APPROVAL
                                                 │      "Approve" / "Reject"
                                                 │
                                        ┌────────┴────────┐
                                        │                 │
                                   [NO] │                 │ [YES]
                                        │                 │
                                        ▼                 ▼
                                  ┌──────────┐    ┌─────────────────────┐
                                  │   END    │    │ PHASE 5: WORKLOG    │
                                  │ (Discard)│    │         UPDATE      │
                                  └──────────┘    │                     │
                                                  │ • Create worklog    │
                                                  │ • AI disclosure     │
                                                  │ • Evidence refs     │
                                                  │ • Timestamp         │
                                                  │ • Human review flag │
                                                  └──────────┬──────────┘
                                                             │
                                                             ▼
                                                  ┌─────────────────────┐
                                                  │   MOP PERSISTED     │
                                                  │   ✅ COMPLETE       │
                                                  └─────────────────────┘
```

---

## 4. Tools

### Tool: ICA – Get Change Request Details

- **Purpose:** Retrieves core metadata and context for a specific Change Request
- **Input:** 
  - Change Request ID (e.g., CRQ-12345)
- **Output:** 
  - Change type and category
  - Scheduled maintenance window (start/end times)
  - Primary Configuration Items (CIs)
  - Impacted services
  - Estimated user impact scale
  - Change owner and implementer details
  - Change priority and risk level

**Usage Pattern:** First tool call in Phase 1 - establishes baseline context

---

### Tool: ICA – Get All Worklogs related to change request

- **Purpose:** Retrieves all analysis outputs, assessments, and historical notes for the change
- **Input:** 
  - Change Request ID (e.g., CRQ-12345)
- **Output:** 
  - Impact analysis results
  - Risk assessment statements
  - Existing Method of Procedure (MOP) if present
  - Historical success/failure summaries
  - Vendor confirmations
  - Human operator notes
  - AI agent analysis outputs

**Usage Pattern:** Second tool call in Phase 1 - primary evidence source

---

### Tool: ICA – Identify change collision using change ID

- **Purpose:** Detects overlapping or conflicting changes in the same time window or scope
- **Input:** 
  - Change Request ID (e.g., CRQ-12345)
- **Output:** 
  - List of potentially colliding Change Request IDs
  - Collision type (CI-level, service-level, time-window, dependency)
  - Overlap details (shared CIs, services, time ranges)
  - Risk classification (High/Moderate/None)

**Usage Pattern:** Third tool call in Phase 1 - critical for CAB safety assessment

---

### Tool: ICA – Get all CIs related to the change ticket

- **Purpose:** Retrieves complete list of Configuration Items affected by the change
- **Input:** 
  - Change Request ID (e.g., CRQ-12345)
- **Output:** 
  - Array of CI identifiers (servers, switches, applications, databases, etc.)
  - CI types and categories
  - CI relationships and dependencies

**Usage Pattern:** First tool call in Phase 3 (after user approval for MOP generation)

---

### Tool: Get_CI

- **Purpose:** Retrieves detailed information about a specific Configuration Item
- **Input:** 
  - CI identifier (e.g., SERVER-PROD-01)
- **Output:** 
  - CI specifications and attributes
  - Operational status
  - Dependency mappings
  - Associated services
  - Maintenance history

**Usage Pattern:** Called iteratively in Phase 3 for each CI identified

---

### Tool: ICA – Get all completed change requests related to CI

- **Purpose:** Retrieves historical change records for a specific CI
- **Input:** 
  - CI identifier (e.g., SERVER-PROD-01)
- **Output:** 
  - List of completed Change Request IDs
  - Change dates and outcomes (success/failure)
  - Change types and categories
  - Execution durations

**Usage Pattern:** Called in Phase 3 to build historical evidence base for MOP generation

---

### Tool: ICA – Get All Worklogs related to change request (Historical)

- **Purpose:** Retrieves worklogs for historical changes to extract execution patterns
- **Input:** 
  - Historical Change Request ID (e.g., CRQ-10567)
- **Output:** 
  - Execution logs and step-by-step procedures used
  - Pre-checks and post-checks performed
  - Issues encountered and resolutions
  - Rollback triggers and actions (if any)
  - Completion times and sign-offs

**Usage Pattern:** Called in Phase 3 for each historical change to extract MOP patterns

---

### Tool: ICA – Get all incidents related to the change

- **Purpose:** Retrieves incidents triggered by or related to a historical change
- **Input:** 
  - Change Request ID (e.g., CRQ-10567)
- **Output:** 
  - Incident IDs and descriptions
  - Incident severity and impact
  - Root cause analysis results
  - Correlation to change execution steps
  - Resolution actions taken

**Usage Pattern:** Called in Phase 3 to identify failure patterns and risks

---

### Tool: AskGoogle

- **Purpose:** External knowledge retrieval for vendor documentation and best practices (demo mode)
- **Input:** 
  - Search query related to change context
- **Output:** 
  - Relevant documentation links
  - Best practice references
  - Vendor-specific guidance

**Usage Pattern:** Called silently in Phase 3 as supplementary information source

---

## 5. Test Prompts

### Standard Prompt
```
Analyze Change Request CRQ-56789 for database patch deployment 
scheduled for this weekend.
```

**Expected Behavior:** Agent executes Phase 1 (3 tool calls), detects no collisions, presents structured 7-section analysis showing existing MOP is present, assesses readiness as "Conditionally Ready" pending pre-check validations, and asks if user wants AI-generated MOP replacement.

---

### Multi-Change Collision Scenario
```
Review CRQ-57001. I heard there might be other changes 
happening on the same database cluster this weekend.
```

**Expected Behavior:** Agent detects collision with CRQ-57002 and CRQ-57004, flags "High Collision Risk" in Section 2, explains amplified blast radius (3 concurrent changes on shared database cluster), recommends sequencing or deferral, assesses readiness as "Not Ready" until collision is resolved, does NOT offer MOP generation.

---

### Missing MOP Scenario
```
Analyze CRQ-57100 - this is a new change type we haven't done before. 
No MOP exists yet.
```

**Expected Behavior:** Agent completes Phase 1, Section 5 shows "MOP present: No", searches historical changes for similar CI types, if found shows "Evidence base: 3 similar changes on comparable CIs (CRQ-55001, CRQ-55234, CRQ-56100)", assesses readiness as "Conditionally Ready", strongly recommends AI MOP generation.

---

### Edge Case: Emergency Change with Minimal History
```
Urgent: Analyze CRQ-99501 - emergency security patch 
deployment required within 4 hours.
```

**Expected Behavior:** Agent recognizes urgency, completes Phase 1 rapidly, adapts assessment to emergency context (accepts reduced historical evidence requirements), flags any collision risks with elevated urgency, if no MOP present offers expedited AI generation using best available historical patterns, clearly states confidence limitations due to time constraints.

---

### Historical Failure Pattern Detection
```
Analyze CRQ-58200 - firmware upgrade on core switches. 
Check if we've had issues with this before.
```

**Expected Behavior:** Agent mines historical changes, identifies CRQ-52345 (similar firmware upgrade) that triggered INC-12456 (routing loop), explicitly calls out in Section 4: "Failure history: Recurrent - 1 of 3 similar changes failed", details failure mode in Key Risks section, recommends enhanced rollback testing, may suggest MOP should include specific monitoring for routing stability.

---

### MOP Generation Flow (Multi-Turn)
```
User: "Analyze CRQ-58500"
Agent: [Presents 7-section analysis, asks about MOP generation]
User: "Yes, generate the MOP"
Agent: [Executes Phase 3 + 4, presents generated MOP]
User: "Looks good, persist it"
Agent: [Executes Phase 5, confirms worklog creation]
```

**Expected Behavior:** Agent follows strict phase progression, never proceeds to Phase 3 without explicit approval, presents complete MOP with evidence disclosure before Phase 5, only persists after final confirmation, creates worklog with all required metadata.

---

### Negative Testing: Non-Change Request
```
What's the weather like today?
```

**Expected Behavior:** Agent responds: "I'm designed specifically for ITSM Change Management analysis. Please provide a Change Request ID (e.g., CRQ-12345) for me to analyze. If you need weather information, that's outside my scope."

---

### Edge Case: Conflicting Worklog Evidence
```
Analyze CRQ-59000 - I think there's conflicting risk 
assessments in the worklogs.
```

**Expected Behavior:** Agent detects conflicting statements (e.g., "Impact Agent: Low risk" vs "Manual note: High risk due to peak hour scheduling"), explicitly calls out conflict in Section 3 under "Gaps detected", recommends resolution before proceeding, assesses readiness as "Not Ready", does NOT offer MOP generation until conflict resolved.

---

## 6. Sample Output Structure

### Example Output: CRQ-56789 (Database Patch Deployment)

---

**Here's a concise, evidence-backed change analysis for CRQ-56789 (Oracle Database Critical Security Patch - July 2025 CPU)**

---

### **1. Change Context**

* **Change Type:** Standard - Database Patch
* **Change Window:** 2025-12-29 01:00 - 04:00 SGT (Sunday)
* **Primary CIs:** 
  * DB-PROD-ORA-01 (Customer Portal Database)
  * DB-PROD-ORA-02 (Customer Portal Database - Standby)
* **Services Impacted:** 
  * Customer Self-Service Portal
  * Mobile App Backend API
* **Estimated User Impact:** 
  * ~500 concurrent users during window (low usage period)
  * 15-minute service interruption during primary database restart

---

### **2. Change Collision & Conflict Analysis**

* **Conflicting changes detected:** Yes
* **Number of overlapping changes:** 2
* **Collision type:** Service-level overlap

**Moderate Collision Risk** detected:

* **CRQ-56801** (Application Server JVM Tuning) scheduled 2025-12-29 02:00 - 03:00 SGT
  * Overlapping window: 1 hour
  * Shared service: Customer Self-Service Portal (application tier, not database tier)
  * Risk implication: Concurrent maintenance on different tiers of same service extends total service degradation window from 15 min to potentially 75 min

* **CRQ-56823** (Load Balancer Certificate Renewal) scheduled 2025-12-29 00:00 - 01:30 SGT
  * Overlapping window: 30 minutes
  * Shared service: Customer Self-Service Portal (frontend tier)
  * Risk implication: If CRQ-56823 runs late, could delay start of database patching

**Recommendation:** Coordinate with CRQ-56801 owner to sequence changes (database first, then JVM tuning) to minimize cumulative service impact. Confirm CRQ-56823 completion before proceeding.

---

### **3. Impact Analysis (From Existing Worklogs)**

**What is changing**

* Oracle Database 19c security patch (Critical Patch Update July 2025)
* Addresses 5 CVEs including one Critical severity (CVE-2025-xxxxx)
* Patch requires database restart (15 min downtime per instance)

**Who is impacted**

* **Services:** Customer Self-Service Portal, Mobile App Backend API
* **User scale:** ~500 active users during window (2% of normal peak load)
* **Business impact:** Low - off-peak hours, redundant authentication methods available

**Risk posture**

* **Compliance Risk:** HIGH - CVE-2025-xxxxx is Critical severity, 45-day patch compliance deadline expires 2025-12-31
* **Operational Risk:** LOW - Patch tested in DEV/QA environments, no known compatibility issues
* **Rollback Risk:** LOW - Previous database version snapshot available, rollback procedure tested

**Gaps detected**

* Pre-patch backup verification step not explicitly documented in current MOP
* Post-patch connection pool monitoring duration not specified (should be 2 hours based on historical practice)

---

### **4. Historical Risk & Failure Analysis**

* **Similar historical changes:** Found (4 instances)
* **Failure history:** None (4/4 successful)
* **Incident correlation:** None

**Referenced Historical Changes:**

* **CRQ-54201** (2025-10-15) - Oct 2025 CPU patch, same CI, 100% success, 18 min execution
* **CRQ-52456** (2025-07-20) - July 2025 CPU patch, same CI, 100% success, 16 min execution
* **CRQ-50789** (2025-04-14) - Apr 2025 CPU patch, same CI, 100% success, 17 min execution
* **CRQ-48990** (2025-01-12) - Jan 2025 CPU patch, same CI, 100% success, 20 min execution

**Historical pattern:** This is a routine quarterly patching cycle with 100% success rate. Average execution time: 17.75 minutes.

---

### **5. Current MOP Status**

* **MOP present:** Yes
* **MOP source:** Manual (created by DBA team, last updated 2025-10-12)
* **Evidence base:** Based on CRQ-54201 (Oct 2025 CPU execution)
* **Coverage quality:**

  * Pre-checks ✅ (Database health check, backup verification, standby sync status)
  * Sequenced steps ✅ (15 steps with clear success criteria per step)
  * Rollback plan ✅ (Documented, includes snapshot restore procedure)
  * Monitoring & escalation ❌ (Monitoring duration unspecified, escalation contacts outdated)

**Gaps identified:**

* Monitoring duration should be explicitly set to 2 hours (based on CRQ-54201 post-patch observation period)
* Escalation contact "John Lee" no longer in DBA team (per org chart update Nov 2025)

---

### **6. Change Readiness Assessment**

* **Overall readiness:** **Conditionally Ready**

**Key strengths:**

* 100% historical success rate for this change type on these CIs
* Comprehensive pre-checks and rollback plan in place
* Compliance-driven urgency is justified (deadline approaching)

**Key risks:**

* **Collision risk (Moderate):** Two overlapping changes on shared services could extend total service degradation window to 75 minutes vs. planned 15 minutes
* **MOP gaps (Minor):** Monitoring duration and escalation contacts need updating

**Mandatory conditions before execution:**

1. **Coordination required:** Sequence with CRQ-56801 (JVM tuning) - recommend database patch first, then 30-min gap, then JVM tuning
2. **MOP updates:** Update monitoring duration to 2 hours, replace escalation contact John Lee with current DBA manager Sarah Chen
3. **Collision confirmation:** Verify CRQ-56823 (Load Balancer cert) completes before 01:00 SGT start time

---

### **7. Recommended Next Action**

Your current MOP is comprehensive but has minor gaps in monitoring duration and escalation contacts. Historical evidence shows this is a low-risk routine change with 100% success rate.

**Would you like me to generate and replace the MOP with an AI-generated, evidence-backed version based on successful historical executions?**

*(This would incorporate lessons from CRQ-54201, CRQ-52456, CRQ-50789, and CRQ-48990, update monitoring duration to 2 hours, and refresh escalation contacts.)*

---

## 7. Versioning & Change Log

| Version | Date       | Change | Author |
|---------|------------|--------|--------|
| 1.0.0   | December 26, 2025 | Initial version documentation created from agent instructions | [Placeholder] |

---

## 8. Notes

### ⚠️ Critical Operating Principles

1. **Human-in-the-Loop is Non-Negotiable:** This agent never proceeds to Phase 3 (Historical Change Mining) or Phase 4 (MOP Generation) without explicit user confirmation. This safeguard prevents unintended MOP overwrites and ensures human oversight.

2. **Collision Detection is Mandatory:** The agent MUST call the collision detection tool in Phase 1. Failure to detect change collisions could result in amplified blast radius during execution, which is unacceptable from a CAB governance perspective.

3. **Evidence Transparency:** Every recommendation, risk assessment, and MOP step must be traceable to specific Change Request IDs or worklog entries. If evidence is insufficient, the agent must state this explicitly rather than making assumptions.

4. **AI Disclosure Requirement:** All AI-generated MOPs must include clear disclosure in the worklog that the content is machine-generated and requires human validation before execution.

5. **Senior-Level Communication:** The agent is designed to speak like a seasoned Change Manager or SRE, not a junior technician. Responses should be concise, authoritative, and structured for executive-level review.

### 🔒 Security & Compliance Considerations

- **Read-Only Operations (Phase 1-2):** Agent requires read access to Change Management database, Configuration Management Database (CMDB), and Incident Management records
- **Write Operations (Phase 5):** Agent requires write access to Change Request worklogs with proper attribution and AI disclosure flags
- **Audit Trail:** All tool calls and generated content should be logged for compliance audits
- **Change Collision Escalation:** If High Collision Risk is detected, agent should trigger notification to Change Coordinator and CAB lead
- **Historical Data Privacy:** Agent accesses historical change execution details; ensure proper data retention and privacy policies apply

### 🎯 Success Metrics

To evaluate agent effectiveness, consider tracking:

1. **Collision Detection Rate:** % of actual change collisions successfully identified by agent before CAB review
2. **MOP Quality Score:** Human reviewer ratings of AI-generated MOPs on scale of 1-5
3. **CAB Decision Time:** Average time from agent analysis presentation to CAB approval decision (target: reduction vs. baseline)
4. **MOP Acceptance Rate:** % of AI-generated MOPs accepted without modification by DBA/Engineering teams
5. **Change Success Rate:** % of changes using AI-generated MOPs that execute successfully vs. manual MOPs
6. **Evidence Completeness:** % of agent analyses that surface all relevant historical risks (validated post-execution)

### 🔧 Integration Requirements

- **Upstream Dependencies:**
  - CMDB must be current and accurate (stale CI relationships will degrade collision detection accuracy)
  - Impact Analysis Agent should complete before invoking Change Planning Agent for optimal results
  - Historical change worklogs must be consistently structured for effective pattern extraction

- **Tool Availability:** All 8 ICA tools must be available and responsive. If any tool fails:
  - Agent should gracefully degrade (e.g., proceed with partial analysis if collision detection tool is unavailable, but clearly flag this gap)
  - Critical tools (Get Change Request Details, Get All Worklogs) - failure should abort agent execution

- **Historical Data Requirements:**
  - Minimum 6 months of historical change data for effective pattern recognition
  - Incident correlation requires Integration with Incident Management system
  - MOP quality improves with 3+ successful historical changes of similar type on similar CIs

### 📋 Recommended Governance

1. **Agent Oversight:** Designate a Change Management Process Owner to review agent performance monthly
2. **MOP Validation Process:** Establish mandatory human review checklist for AI-generated MOPs before execution approval
3. **Collision Override Protocol:** Define process for human override of agent collision recommendations (with justification requirement)
4. **Feedback Loop:** Create mechanism for Change Implementers to flag incorrect agent assessments or MOP issues post-execution
5. **Continuous Learning:** Quarterly review of agent-human decision alignment to identify instruction refinement opportunities
6. **Emergency Change Exception:** Define criteria where agent can be bypassed for critical emergency changes (document override reasons)

### 💡 Best Practices for Users

**For Change Coordinators:**
- Always provide complete Change Request ID (e.g., CRQ-12345) when invoking agent
- Review collision analysis first before evaluating other dimensions
- If agent recommends "Not Ready," address conditions before scheduling CAB review

**For CAB Members:**
- Focus on Section 2 (Collision Analysis) and Section 6 (Readiness Assessment) for quick decision-making
- Request drill-down using conversational questions: "What specific risks were found in historical changes?"
- Don't approve changes with "High Collision Risk" without explicit sequencing or deferral plan

**For Change Implementers:**
- If accepting AI-generated MOP, conduct thorough pre-execution walkthrough with team
- Document any deviations from AI MOP during execution in worklogs for agent learning
- Flag any MOP steps that were unclear or incorrect for agent instruction refinement

### 🐛 Known Limitations

1. **Novel Change Types:** Agent effectiveness degrades significantly for change types with <3 historical examples
2. **Cross-Domain Dependencies:** Collision detection limited to CI-level and service-level; may miss business process dependencies
3. **Historical Data Bias:** If historical changes were consistently executed during off-peak hours, agent may not accurately assess peak-hour risks
4. **Vendor-Specific Procedures:** Agent may not capture vendor-proprietary steps not documented in historical worklogs
5. **Environmental Drift:** Infrastructure changes since historical executions may invalidate extracted MOP patterns

---

**Document End**
