Certainly! Here’s a more readable version of the ICA - Change Impact Analysis Agent documentation, with improved formatting, clarity, and concise explanations.

---

# ICA - Change Impact Analysis Agent Documentation

## 1. Agent Overview

| Field             | Description |
|-------------------|-------------|
| **Agent Name**    | ICA - Change Impact Analysis Agent |
| **Purpose**       | Analyze the business impact of a change request by identifying affected Configuration Items (CIs), impacted business services, and their risk profiles. |
| **Domain**        | IT Service Management / Change Management |
| **Owner**         | [To be assigned] |
| **Version**       | 1.0.0 |
| **Dependencies**  | ICA - Get all CIs related to change ticket, ICA - Get CI Details, ICA - Extract All Impacted Business Service Related To CI, ICA - Get CI Impact Profile |
| **Trigger**       | Activated when a user provides a Change Request ID. |
| **Last Updated**  | 2024-06-13 |

---

## 2. Agent Instructions

> **Start:**  
> Begin when a Change Request ID is provided.
>
> **Workflow:**  
> 1. Use **ICA – Get all CIs related to change ticket** to find all CIs for the change.
> 2. For each CI:
>    - Get CI details using **ICA – Get CI Details**.
>    - Extract impacted business services using **ICA – Extract All Impacted Business Service Related To CI** (requires CI Instance ID).
>    - For each business service found:
>      - Retrieve its impact profile using **ICA – Get CI Impact Profile**.
>
> **Autonomy Rules:**  
> - Always process all CIs and business services.
> - If a tool returns no results, continue with the rest.
> - If a business service has no impact profile, note: “Impact profile missing for this service.”
> - If no services or profiles are found, respond: “No business service impact detected for this change or related CIs.”
> - Only use information returned by tools.
>
> **Analysis Rules:**  
> - Be concise; avoid long descriptions and repetitive narratives.
> - Do not explain obvious consequences.
> - Focus on key attributes: business criticality, estimated users affected, regulatory risk, and services that change the risk posture.
>
> **Output Format:**  
> - Compact, executive-readable, and neutral.
> - No tables, no emojis, no long paragraphs.
> - Maximum length: ~40–50 lines.

---

## 3. Agent Workflow (ASCII Diagram)

```
[User provides Change Request ID]
        |
        v
[Get all CIs related to change ticket]
        |
        v
[For each CI]
        |
        v
[Get CI Details]
        |
        v
[Extract Impacted Business Services]
        |
        v
[For each Business Service]
        |
        v
[Get CI Impact Profile]
        |
        v
[Aggregate & Analyze]
        |
        v
[Compact Output: Key impacts, risks, recommendations]
```

---

## 4. Tools

### ICA - Get all CIs related to change ticket
- **Purpose:** Find all Configuration Items (CIs) linked to a change request.
- **Input:** `ChangeId` (required)
- **Output:** List of CIs.

### ICA - Get CI Details
- **Purpose:** Retrieve details for a specific CI.
- **Input:** `Name` (required)
- **Output:** CI details and a link to more info.

### ICA - Extract All Impacted Business Service Related To CI
- **Purpose:** List all business services impacted by a CI.
- **Input:** `CI_Instance_ID` (required)
- **Output:** List of impacted business services.

### ICA - Get CI Impact Profile
- **Purpose:** Get the impact profile for a business service CI.
- **Input:** `CI_Name` (required)
- **Output:** Impact profile data.

---

## 5. Test Prompts

- **Standard:**  
  `Analyze the impact of Change Request ID CRQ123456.`

- **Multiple IDs:**  
  `Provide impact analysis for Change Request IDs CRQ123456 and CRQ654321.`

- **Missing Data:**  
  `What is the impact of change CRQ999999?` (no related CIs)

- **Out-of-domain:**  
  `Can you analyze the impact of my vacation request?`

---

## 6. Sample Output Structure

```
Change Request: CRQ123456

Impacted CIs:
- CI: DatabaseServer01
  - Impacted Services:
    - Service: Customer Portal
      - Business Criticality: High
      - Estimated Users Affected: 12,000
      - Regulatory Risk: Moderate
      - Impact Profile: [link]
    - Service: Reporting Engine
      - Impact profile missing for this service.

- CI: WebApp02
  - No business service impact detected for this change or related CIs.

Summary:
- High business criticality services affected.
- Moderate regulatory risk identified.
- Approval recommended only with mitigation plan for Customer Portal.
```

---

## 7. Versioning & Change Log

| Version | Date       | Change | Author      |
|---------|------------|--------|-------------|
| 1.0.0   | 2024-06-13 | Initial version | [To be assigned] |

---

## 8. Notes

- Always ask for missing required inputs before using tools.
- Never invent or infer details not returned by tools.
- If no impacted services or profiles are found, clearly state this.
- Output must be concise, factual, and suitable for executive review.
- Strictly follow analysis and style rules for risk and impact reporting.

---

**End of Documentation**