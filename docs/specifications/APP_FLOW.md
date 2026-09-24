# APP FLOW — Agentic Fraud Investigation & Next-Best-Action Platform

**Hackathon:** TigerGraph Agentic Fraud Investigation HHGOA  
**Document Type:** Application Flow / UX Flow  
**Purpose:** Define the complete user-facing and agent-facing application journey from fraud trigger to final case resolution.

---

# 1. Application Purpose

The application is an **AI-powered fraud investigation workspace** for fraud analysts.

It does not simply classify a transaction as fraud or not fraud.

Its purpose is to:

```text
Detect Trigger
    ↓
Investigate Connected Context
    ↓
Collect Evidence
    ↓
Assess Risk + Uncertainty
    ↓
Decide Whether More Evidence Is Needed
    ↓
Acquire Additional Evidence
    ↓
Reassess
    ↓
Recommend Next-Best-Action
    ↓
Apply Policy + Permission Controls
    ↓
Request Approval When Required
    ↓
Execute / Record Action
    ↓
Explain Decision
    ↓
Store Case Memory
```

---

# 2. Primary Application Users

## Fraud Analyst

Uses the application to:

- inspect triggered cases,
- review graph relationships,
- analyze evidence,
- understand uncertainty,
- review additional evidence requests,
- approve/reject eligible actions,
- inspect prior cases,
- review the final recommendation.

## Fraud Supervisor

Uses the application to:

- review escalated cases,
- approve restricted actions,
- inspect investigation history,
- audit agent decisions.

## Investigation Agent

Acts as the application intelligence layer.

It:

- investigates,
- selects tools,
- gathers evidence,
- detects patterns,
- evaluates uncertainty,
- chooses evidence requests,
- recommends actions,
- updates the case,
- generates explanations.

---

# 3. Global Navigation

The application should use a simple analyst-oriented navigation.

```text
┌──────────────────────────────────────────────────────────────┐
│ LOGO / PRODUCT NAME                                         │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Dashboard     │                                              │
│ Investigations│              Main Workspace                  │
│ Cases         │                                              │
│ Graph         │                                              │
│ Approvals     │                                              │
│ Memory        │                                              │
│ Audit Log     │                                              │
│ Benchmark     │                                              │
│ Settings      │                                              │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

---

# 4. Application Entry Flow

```text
Application Launch
       ↓
Authentication / Demo User
       ↓
Role Loaded
       ↓
Dashboard
```

For the hackathon prototype, authentication may be simplified, but the user's role should still affect permissions.

Suggested roles:

```text
ANALYST
SENIOR_ANALYST
SUPERVISOR
ADMIN
AGENT
```

---

# 5. Dashboard Flow

The Dashboard is the application entry point.

## Dashboard Sections

```text
┌────────────────────────────────────────────────────────────┐
│ FRAUD OPERATIONS OVERVIEW                                  │
├─────────────┬──────────────┬──────────────┬───────────────┤
│ Active Cases│ Awaiting     │ Approvals    │ Escalations   │
│             │ Evidence     │              │               │
├─────────────┴──────────────┴──────────────┴───────────────┤
│                                                            │
│ Recent Investigations                                     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Agent Activity                                             │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ High-Risk / Priority Cases                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Dashboard Actions

The analyst can:

```text
Open Case
View Active Investigations
View Pending Evidence
View Pending Approvals
Search Customer / Transaction
Open Graph Explorer
Review Recent Cases
```

---

# 6. Investigation Trigger Flow

An investigation can begin from:

```text
Fraud Risk Signal
Customer Report
Analyst Request
Other Supported Event
```

## Trigger Example

```text
Transaction:
TXN-10293

Risk Score:
87

Trigger:
High Fraud Risk Signal
```

When selected:

```text
Trigger
  ↓
Create / Open Investigation
```

---

# 7. Case Creation Flow

When investigation starts:

```text
Trigger Received
     ↓
Check Existing Case
     ↓
 ┌───────────────┐
 │ Existing Case?│
 └──────┬────────┘
     YES│NO
        │
   ┌────┴─────┐
   ↓          ↓
Open Case   Create Case
   │          │
   └────┬─────┘
        ↓
Investigation Workspace
```

## Initial Case State

```text
Case ID
Trigger
Customer
Account
Transaction
Risk Score
Timestamp
Status = INVESTIGATING
```

---

# 8. Main Investigation Workspace

This is the core screen of the application.

```text
┌────────────────────────────────────────────────────────────────────┐
│ CASE-10293                       HIGH RISK      MEDIUM CONFIDENCE  │
├───────────────────────────────┬────────────────────────────────────┤
│                               │                                    │
│        GRAPH EXPLORER         │         EVIDENCE PANEL             │
│                               │                                    │
│ Customer                      │ Evidence #1                        │
│   │                           │ Evidence #2                        │
│   ├── Device                  │ Evidence #3                        │
│   ├── Account                 │                                    │
│   └── Transaction             │ Findings                           │
│                               │                                    │
├───────────────────────────────┴────────────────────────────────────┤
│                    INVESTIGATION TIMELINE                          │
├────────────────────────────────────────────────────────────────────┤
│                    UNCERTAINTY / MISSING EVIDENCE                  │
├────────────────────────────────────────────────────────────────────┤
│                    NEXT-BEST-ACTION                                │
├────────────────────────────────────────────────────────────────────┤
│                    APPROVAL / ACTION                               │
└────────────────────────────────────────────────────────────────────┘
```

---

# 9. Agent Investigation Flow

When the case opens, the agent automatically begins investigation.

## Agent Activity

```text
Case created
   ↓
Load transaction context
   ↓
Identify customer/account
   ↓
Inspect customer history
   ↓
Inspect device
   ↓
Inspect connection/IP
   ↓
Inspect merchant
   ↓
Search related entities
   ↓
Search previous cases
   ↓
Run relevant graph patterns
   ↓
Build evidence set
```

The UI should show this activity as a live timeline.

Example:

```text
✓ Transaction context retrieved
✓ Customer history retrieved
✓ Device relationships found
✓ 3 connected customers discovered
✓ Previous related case found
✓ Temporal transaction sequence analyzed
```

---

# 10. Graph Explorer Flow

The Graph Explorer visualizes the connected investigation context.

## Starting Point

```text
Transaction
```

or:

```text
Customer
Account
Device
Case
Merchant
```

## Expansion

The analyst can expand:

```text
Customer
   ↓
Account
   ↓
Transactions

Customer
   ↓
Device
   ↓
Other Customers

Device
   ↓
Connections
   ↓
Transactions

Customer
   ↓
Previous Cases
```

## Example

```text
              Customer C123
               /    |     \
              /     |      \
        Account    Device   Case
           │         │       │
       Transactions  │    Previous Fraud
                     │
             Customer C811
```

The graph should distinguish normal context from investigation-relevant relationships.

---

# 11. Evidence Discovery Flow

As the agent investigates:

```text
Graph Result
     ↓
Transaction Result
     ↓
Behavior Result
     ↓
Prior Case Result
     ↓
Policy Result
     ↓
Evidence Normalization
```

Each evidence item becomes a structured object.

## UI Example

```text
EVIDENCE #001
Type: Shared Device

Customer C123 and Customer C811
both use Device D77.

Source:
TigerGraph

Strength:
82%

Supports:
Known Pattern FP-03

[View Graph]
[View Provenance]
```

---

# 12. Evidence Classification

Each discovered item can be classified as:

```text
SUPPORTING
CONTRADICTING
NEUTRAL
CONTEXTUAL
```

Example:

```text
Supporting:
Shared device with previously investigated account

Contradicting:
Customer has previously completed legitimate
transactions from the same location/device

Contextual:
Transaction occurred outside normal spending time
```

This prevents the investigation from becoming a one-sided evidence collector.

---

# 13. Fraud Pattern Analysis Flow

After collecting evidence:

```text
Evidence
   ↓
Known Fraud Pattern Matching
   +
Graph / Temporal Analysis
   +
Historical Case Similarity
   ↓
Pattern Assessment
```

Output:

```text
Matched Pattern
Potential Pattern
Undocumented Pattern Signal
No Strong Pattern
```

The application should show:

```text
Fraud Pattern:
Pattern FP-03

Match Strength:
HIGH

Supporting Evidence:
E-001
E-004
E-009
```

---

# 14. Temporal Investigation Flow

The analyst can inspect events as an ordered sequence.

```text
09:21  New Device
   ↓
09:25  Login
   ↓
09:28  IP Change
   ↓
09:31  High Value Transaction
   ↓
09:34  Related Transaction
```

The system highlights suspicious temporal sequences discovered through the graph.

The purpose is to understand not only:

> What is connected?

but:

> What happened, in what order, and within what time window?

---

# 15. Uncertainty Assessment Flow

After the first investigation pass:

```text
Evidence
   ↓
Risk Assessment
   ↓
Confidence Assessment
   ↓
Evidence Sufficiency Assessment
```

UI:

```text
┌─────────────────────────────────────────┐
│ INVESTIGATION ASSESSMENT                │
├─────────────────────────────────────────┤
│ Risk              HIGH                  │
│ Confidence        MEDIUM                │
│ Evidence          INSUFFICIENT          │
│                                         │
│ Strong Signals:                         │
│ • New device                            │
│ • Unusual amount                        │
│ • Shared device                         │
│                                         │
│ Contradicting Signals:                  │
│ • Device used legitimately before       │
│                                         │
│ Missing Evidence:                       │
│ • Customer recognition                  │
└─────────────────────────────────────────┘
```

---

# 16. Decision Point — Is Evidence Sufficient?

This is the central application branch.

```text
             Evidence Assessment
                    ↓
         ┌─────────────────────┐
         │ Enough to act?      │
         └──────────┬──────────┘
                    │
              ┌─────┴─────┐
             YES          NO
              │            │
              ↓            ↓
       NBA Decision     Evidence Planner
```

---

# 17. Evidence Planner Flow

When evidence is insufficient:

```text
Uncertainty
     ↓
Identify Missing Information
     ↓
Generate Candidate Evidence Actions
     ↓
Policy Check
     ↓
Estimate Decision Value
     ↓
Select Evidence Action
```

Potential options:

```text
Customer Transaction Validation
Step-Up Authentication
Request Analyst Information
Retrieve Approved Additional Data
Escalate to Analyst
```

---

# 18. Evidence Request UI

The application should explicitly explain why the request exists.

Example:

```text
ADDITIONAL EVIDENCE RECOMMENDED

Action:
Customer Transaction Validation

Purpose:
Determine whether the account owner recognizes
the suspicious transaction.

Uncertainty Target:
Legitimate activity vs account compromise

Expected Decision Impact:
HIGH

Policy:
ALLOWED

Approval:
NOT REQUIRED

[REQUEST EVIDENCE]
```

This is a core product experience.

---

# 19. Evidence Acquisition Flow

When the analyst/agent requests evidence:

```text
Evidence Request
      ↓
Permission Check
      ↓
Mock / Approved API
      ↓
Evidence Response
      ↓
Validate Response
      ↓
Attach Evidence to Case
```

Example:

```text
Customer Validation

Question:
Did you authorize transaction TXN-10293?

Response:
NO

Evidence:
Customer does not recognize transaction
```

---

# 20. After-Evidence Reassessment

New evidence should trigger a new assessment.

```text
New Evidence
     ↓
Add to Case
     ↓
Recalculate Risk
     ↓
Recalculate Confidence
     ↓
Check Contradictions
     ↓
Update Fraud Pattern Assessment
     ↓
Re-evaluate Evidence Sufficiency
```

UI should explicitly show:

```text
BEFORE
Risk: HIGH
Confidence: MEDIUM
NBA: REQUEST CUSTOMER VALIDATION

AFTER
Risk: VERY HIGH
Confidence: HIGH
NBA: ESCALATE / BLOCK / REPORT
```

The exact action depends on the applicable benchmark policy.

---

# 21. Next-Best-Action Flow

Once evidence is sufficient:

```text
Verified Evidence
      ↓
Risk + Confidence
      ↓
Fraud Pattern
      ↓
Policy Retrieval
      ↓
Candidate Actions
      ↓
Permission Filter
      ↓
Approval Check
      ↓
Final Recommendation
```

---

# 22. Next-Best-Action UI

Example:

```text
┌───────────────────────────────────────────────┐
│ NEXT-BEST-ACTION                              │
├───────────────────────────────────────────────┤
│ Recommended Action: ESCALATE                  │
│                                               │
│ Risk: VERY HIGH                               │
│ Confidence: 91%                               │
│                                               │
│ Why:                                          │
│ • Customer denied transaction                  │
│ • Shared device with prior fraud case         │
│ • Suspicious temporal sequence                 │
│                                               │
│ Policy Reference: POLICY-4.2                  │
│                                               │
│ Approval Required: YES                        │
│ Required Role: Fraud Supervisor               │
│                                               │
│ [VIEW EVIDENCE] [VIEW POLICY] [REQUEST APPROVAL]│
└───────────────────────────────────────────────┘
```

---

# 23. Action & Approval Flow

```text
NBA Selected
     ↓
Policy Check
     ↓
Permission Check
     ↓
Approval Required?
    /       \
  NO         YES
  │           │
  ↓           ↓
Execute     Send Approval
              ↓
          Supervisor Review
              ↓
        ┌─────┴─────┐
      APPROVE      REJECT
        │             │
        ↓             ↓
     Execute       Reassess
```

The system must clearly distinguish:

```text
Recommended
Approved
Executed
Rejected
```

---

# 24. Action Execution Flow

For permitted or approved actions:

```text
Action Approved
      ↓
Mock Action API
      ↓
Execution Result
      ↓
Case Updated
      ↓
Audit Event Created
      ↓
Timeline Updated
```

Example:

```text
✓ Account placed under monitoring
✓ Action recorded
✓ Policy reference stored
✓ Supervisor approval stored
```

---

# 25. Explanation Flow

After the final decision:

```text
Decision
   ↓
Collect Supporting Evidence
   ↓
Collect Policy Context
   ↓
Collect Uncertainty Resolution
   ↓
Generate Explanation
   ↓
Validate Evidence References
   ↓
Display Explanation
```

The explanation should be structured around:

```text
WHAT HAPPENED?
WHAT EVIDENCE WAS FOUND?
WHAT PATTERN WAS IDENTIFIED?
WHAT REMAINED UNCERTAIN?
WHAT ADDITIONAL EVIDENCE WAS REQUESTED?
WHY DID THE RECOMMENDATION CHANGE?
WHY WAS THE FINAL ACTION SELECTED?
WHAT POLICY/APPROVAL RULE APPLIES?
```

---

# 26. Evidence Provenance Flow

The analyst can click any finding.

Example:

```text
Finding:
Customer C123 is connected to a previously investigated
fraud entity.

       ↓

Evidence:
E-004

       ↓

Graph Relationship:
C123 → Device D77 → C811

       ↓

Previous Case:
CASE-103

       ↓

Graph Query:
find_prior_cases()

       ↓

Policy:
FP-03 / Policy Section X
```

This creates transparent evidence lineage.

---

# 27. Case Timeline

Every case should have an event timeline.

```text
10:01 — Investigation Triggered
10:01 — Case Created
10:02 — Transaction Context Retrieved
10:02 — Customer History Retrieved
10:03 — Shared Device Discovered
10:03 — Previous Case Retrieved
10:04 — Fraud Pattern Identified
10:04 — Risk Assessed
10:04 — Evidence Determined Insufficient
10:05 — Customer Validation Requested
10:06 — Evidence Received
10:06 — Case Reassessed
10:07 — NBA Updated
10:07 — Approval Requested
10:08 — Supervisor Approved
10:08 — Action Executed
10:09 — Case Resolved
```

---

# 28. Case Memory Flow

After resolution:

```text
Resolved Case
     ↓
Extract:
- Findings
- Evidence
- Fraud Pattern
- Graph Structure
- Actions
- Outcome
     ↓
Store in Case Memory
     ↓
Index for Future Retrieval
```

Future case:

```text
New Case
   ↓
Entity/Graph Similarity
   +
Semantic Similarity
   ↓
Retrieve Similar Cases
   ↓
Add Relevant Cases to Investigation Context
```

---

# 29. Graph + Memory Combination

The most useful historical retrieval should combine:

```text
Current Case Graph
        +
Current Case Narrative
        +
Historical Graph Structure
        +
Historical Case Outcome
```

Example:

```text
Current Case
    ↓
Device D77
    ↓
3 connected customers
    ↓
Similar graph structure found
    ↓
CASE-103
    ↓
Previous outcome: Confirmed Fraud
    ↓
Used as contextual evidence
```

---

# 30. Unknown Pattern Flow

When evidence does not match the five documented patterns:

```text
Graph Investigation
       ↓
Known Pattern Matching
       ↓
No Strong Match
       ↓
Graph / Temporal Anomaly Detection
       ↓
Potential Undocumented Pattern
       ↓
Flag for Analyst Attention
```

The UI should use wording such as:

```text
Potential Undocumented Pattern
```

rather than presenting the discovery as confirmed fraud without sufficient evidence.

---

# 31. Analyst Override Flow

The analyst may review agent findings and recommendations.

```text
Agent Recommendation
      ↓
Analyst Review
      ↓
Accept / Modify / Reject
      ↓
Reason Recorded
      ↓
Case Updated
      ↓
Outcome Stored
```

An analyst override becomes useful future case-memory information.

---

# 32. Approval Center Flow

The Approvals page displays all cases requiring human authorization.

```text
┌──────────────────────────────────────────────────────────┐
│ PENDING APPROVALS                                        │
├─────────┬────────────┬─────────────┬────────────────────┤
│ Case ID │ Risk       │ Action      │ Required Role      │
├─────────┼────────────┼─────────────┼────────────────────┤
│ C-101   │ VERY HIGH  │ BLOCK       │ Supervisor         │
│ C-104   │ HIGH       │ ESCALATE    │ Supervisor         │
└─────────┴────────────┴─────────────┴────────────────────┘
```

Selecting a case opens:

```text
Case Evidence
+
Graph Context
+
Policy
+
Agent Recommendation
+
Approval Decision
```

---

# 33. Audit Log Flow

The Audit page provides a system-wide history.

Filters:

```text
Case
User
Agent
Action
Date
Event Type
```

Example:

```text
CASE-101
|
├── Agent tool call
├── Graph query
├── Evidence discovered
├── Policy check
├── Evidence request
├── Approval
├── Action execution
└── Case resolution
```

---

# 34. Benchmark Mode

A dedicated Benchmark page should support the HHGOA 20-case evaluation.

```text
Benchmark
   ↓
20 Cases
   ↓
Select Case
   ↓
Run Investigation
   ↓
Capture Before-Evidence NBA
   ↓
Run Evidence Step
   ↓
Capture After-Evidence NBA
   ↓
Write Case to Graph
   ↓
Generate Output
```

## Benchmark UI

```text
┌──────────────────────────────────────────────┐
│ HHGOA BENCHMARK                              │
├──────────────────────────────────────────────┤
│ Cases Processed: 17 / 20                    │
│ Successful: 15                               │
│ Needs Review: 2                              │
│ Failed: 0                                    │
├──────────────────────────────────────────────┤
│ CASE-001   ✓                                 │
│ CASE-002   ✓                                 │
│ CASE-003   ! Review                          │
│ ...                                          │
└──────────────────────────────────────────────┘
```

---

# 35. Benchmark Case Detail

Show:

```text
Initial Trigger
       ↓
Initial Investigation
       ↓
Initial Evidence
       ↓
Initial NBA
       ↓
Additional Evidence
       ↓
Updated Evidence
       ↓
Final NBA
       ↓
Case Output
       ↓
Graph Write Status
```

---

# 36. Final Case Resolution

A case reaches `RESOLVED` when:

- sufficient evidence exists,
- a defensible action has been selected,
- required approval has been obtained,
- action is executed/recommended as applicable,
- required report has been generated,
- case record is complete.

Flow:

```text
Final Action
    ↓
Case Record Completed
    ↓
Audit Log Completed
    ↓
Memory Updated
    ↓
Case = RESOLVED
```

---

# 37. Complete End-to-End App Flow

```text
                         ┌──────────────┐
                         │   DASHBOARD  │
                         └──────┬───────┘
                                │
                                ▼
                      ┌───────────────────┐
                      │ Investigation     │
                      │ Trigger           │
                      └────────┬──────────┘
                               ▼
                      ┌───────────────────┐
                      │ Create / Open Case│
                      └────────┬──────────┘
                               ▼
                      ┌───────────────────┐
                      │ Agent Investigation│
                      └────────┬──────────┘
                               ▼
              ┌─────────────────────────────────┐
              │ TigerGraph + GraphRAG           │
              │ Transactions / Entities / Cases │
              └────────────────┬────────────────┘
                               ▼
                      ┌───────────────────┐
                      │ Evidence Engine   │
                      └────────┬──────────┘
                               ▼
                      ┌───────────────────┐
                      │ Pattern Analysis  │
                      └────────┬──────────┘
                               ▼
                      ┌───────────────────┐
                      │ Risk + Uncertainty│
                      └────────┬──────────┘
                               ▼
                 ┌────────────────────────────┐
                 │ Is evidence sufficient?   │
                 └────────────┬───────────────┘
                         YES  │  NO
                              │
                  ┌───────────┴────────────┐
                  ▼                        ▼
          ┌──────────────┐       ┌──────────────────┐
          │ NBA Engine   │       │ Evidence Planner │
          └──────┬───────┘       └────────┬─────────┘
                 │                        ▼
                 │               ┌──────────────────┐
                 │               │ Evidence Request│
                 │               └────────┬─────────┘
                 │                        ▼
                 │               ┌──────────────────┐
                 │               │ New Evidence     │
                 │               └────────┬─────────┘
                 │                        ▼
                 │               ┌──────────────────┐
                 │               │ Reassessment     │
                 │               └────────┬─────────┘
                 └────────────────────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Policy + Permission│
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │ Approval Required? │
                    └─────────┬──────────┘
                         NO   │   YES
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
            ┌──────────┐           ┌────────────┐
            │ Execute  │           │ Approval   │
            └────┬─────┘           └──────┬─────┘
                 │                        ▼
                 │                  ┌────────────┐
                 │                  │ Supervisor │
                 │                  └──────┬─────┘
                 │                        │
                 └────────────┬───────────┘
                              ▼
                    ┌────────────────────┐
                    │ Explanation        │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │ Audit Trail        │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │ Case Memory        │
                    └─────────┬──────────┘
                              ▼
                    ┌────────────────────┐
                    │ CASE RESOLVED      │
                    └────────────────────┘
```

---

# 38. Primary User Experience Principle

The analyst should always be able to answer four questions from the case workspace:

```text
1. WHY was this case investigated?
2. WHAT evidence does the agent have?
3. WHAT does the agent still not know?
4. WHAT should happen next, and WHY?
```

The application should make those four answers visible without requiring the analyst to inspect logs or raw LLM output.

---

# 39. Demo Flow

The recommended 3–5 minute demo should use one strong case and show the complete loop.

## Demo Sequence

```text
1. Open Dashboard
2. Select high-risk triggered transaction
3. Create/open case
4. Show agent investigating
5. Show TigerGraph connections
6. Show historical case relationship
7. Show evidence panel
8. Show uncertainty = insufficient
9. Show intelligent evidence request
10. Simulate customer response
11. Show reassessment
12. Show changed NBA
13. Show policy + approval route
14. Approve/execute mock action
15. Show explanation
16. Show final case timeline
17. Show case stored in memory
```

The demo should emphasize the **change in decision after new evidence**, because that is one of the clearest demonstrations of genuine agentic investigation.

---

# 40. App States

The frontend should support these major case states:

```text
TRIGGERED
INVESTIGATING
EVIDENCE_GATHERING
AWAITING_INFORMATION
REASSESSMENT
ACTION_RECOMMENDED
AWAITING_APPROVAL
ACTION_TAKEN
ESCALATED
RESOLVED
```

Visual state changes should be reflected in the case header and timeline.

---

# 41. Navigation-to-Action Map

| Screen | Primary Action |
|---|---|
| Dashboard | Open investigation |
| Investigations | Continue active investigation |
| Case Workspace | Investigate and decide |
| Graph Explorer | Explore relationships |
| Evidence | Inspect/support findings |
| Approvals | Approve/reject restricted actions |
| Memory | Review similar historical cases |
| Audit Log | Trace investigation actions |
| Benchmark | Run/evaluate HHGOA cases |
| Settings | Configure system |

---

# 42. MVP App Flow

For the first working version, only the following flow is mandatory:

```text
Dashboard
   ↓
Triggered Case
   ↓
Case Workspace
   ↓
TigerGraph Investigation
   ↓
Evidence
   ↓
Risk + Uncertainty
   ↓
Evidence Planner
   ↓
Mock Evidence
   ↓
Reassessment
   ↓
Next-Best-Action
   ↓
Policy Check
   ↓
Approval / Action
   ↓
Explanation
   ↓
Case Timeline
   ↓
Memory
```

Everything else should support this core path.

---

# 43. Product Experience Summary

The application should feel less like a chatbot and more like an **AI fraud investigator working inside an analyst case-management system**.

The expected experience is:

```text
Analyst:
"Why was this transaction flagged?"

Agent:
"Here is the connected evidence."

Analyst:
"What is still uncertain?"

Agent:
"The device relationship is suspicious, but historical
legitimate activity creates uncertainty."

Analyst:
"What should we do next?"

Agent:
"Customer verification has the highest expected value
for resolving that uncertainty."

Analyst:
"What changed after verification?"

Agent:
"The customer denied the transaction. Confidence increased,
the fraud assessment changed, and the recommended action
was updated according to policy."

Analyst:
"Why?"

Agent:
"Here is the evidence and policy trail."
```

That is the intended core product experience.
