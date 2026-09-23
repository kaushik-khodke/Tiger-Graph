# UI/UX BRIEF — Agentic Fraud Investigation & Next-Best-Action Platform

**Hackathon:** TigerGraph Agentic Fraud Investigation HHGOA  
**Document Type:** UI/UX Brief  
**Product:** Agentic Fraud Investigation & Next-Best-Action Platform  
**Primary User:** Fraud Analyst  
**Secondary Users:** Fraud Supervisor, Fraud Operations  
**Core UX Principle:** Make the investigation, evidence, uncertainty, recommendation, approval, and audit trail visible and understandable.

---

# 1. UX Vision

The application should feel like a **professional fraud investigation command center**, not a generic AI chatbot.

The interface must help an analyst quickly answer:

> **Why was this case triggered?**

> **What evidence has the agent found?**

> **What is still uncertain?**

> **What should happen next, and why?**

The primary experience is built around the investigation loop:

```text
Trigger
  ↓
Investigate
  ↓
Evidence
  ↓
Risk + Uncertainty
  ↓
Enough Evidence?
  ├── YES → Next-Best-Action
  └── NO  → Request Most Useful Evidence
                ↓
             Reassess
                ↓
           Next-Best-Action
  ↓
Policy + Permission
  ↓
Approval / Execution
  ↓
Explain
  ↓
Audit + Memory
```

The UI should make this journey immediately visible.

---

# 2. Design Personality

## Overall Feel

The visual language should communicate:

```text
Trust
Precision
Control
Speed
Evidence
Professionalism
```

Avoid making the interface look like:

- a consumer finance app,
- a flashy AI chatbot,
- a generic SaaS dashboard,
- a cyberpunk movie interface,
- a dense spreadsheet.

The product should look like software that a real fraud operations team could understand and use.

---

# 3. Visual Direction

## Recommended Style

**Dark-first enterprise investigation interface**

Use a restrained dark workspace with high-contrast data surfaces.

Concept:

```text
Dark Application Shell
        +
Muted Graph Workspace
        +
Bright Evidence Highlights
        +
Clear Risk States
        +
Minimal, Professional Cards
```

The graph should be the most visually distinctive element, but it should remain readable.

---

# 4. Color Strategy

Use semantic colors rather than decorative colors.

## Base

- Deep charcoal / near-black application shell.
- Dark slate panels.
- Slightly lighter surfaces for cards.
- Neutral borders.

## Semantic States

```text
High Risk       → Red family
Warning         → Amber family
Safe / Cleared  → Green family
Information     → Blue family
Neutral         → Gray family
AI Activity     → Violet / indigo family
```

Do not use color alone to convey meaning.

Every state should also have:

- label,
- icon,
- text,
- status indicator.

Example:

```text
● HIGH RISK
```

rather than only a red background.

---

# 5. Typography

Use a modern enterprise sans-serif.

Recommended hierarchy:

```text
Page Title
22–28 px
Semi-bold

Section Title
16–18 px
Semi-bold

Body
13–15 px

Supporting Metadata
11–13 px
```

Numbers such as:

- risk score,
- transaction amount,
- confidence,
- case ID,

should use visually stable numeric typography.

---

# 6. Application Shell

## Desktop Layout

The application should primarily target desktop because the core workflow is analyst-oriented.

```text
┌─────────────────────────────────────────────────────────────┐
│ TOP BAR                                                      │
│ Product | Search | Notifications | User                     │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ SIDEBAR      │                CONTENT AREA                  │
│              │                                              │
│ Dashboard    │                                              │
│ Cases        │                                              │
│ Investigate  │                                              │
│ Graph        │                                              │
│ Approvals    │                                              │
│ Memory       │                                              │
│ Audit        │                                              │
│ Benchmark    │                                              │
│ Settings     │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

# 7. Navigation

## Sidebar

Primary navigation:

```text
⌂ Dashboard

◈ Investigations

▣ Cases

◎ Graph Explorer

✓ Approvals

◌ Case Memory

◷ Audit Log

◫ Benchmark

⚙ Settings
```

Each item should have:

- icon,
- label,
- active state,
- optional unread/pending count.

Example:

```text
Approvals  3
Evidence  5
```

---

# 8. Global Top Bar

The top bar should contain:

```text
Product Logo / Name
Global Search
Current Environment
Notifications
User / Role
```

## Global Search

Search by:

```text
Case ID
Transaction ID
Customer ID
Account ID
Device ID
Merchant ID
```

Search results should clearly distinguish entity types.

Example:

```text
Search: TXN-10293

Transactions
TXN-10293
Risk Score: 87

Cases
CASE-001
Related transaction
```

---

# 9. Dashboard UX

The dashboard should answer:

> **What needs attention right now?**

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ FRAUD OPERATIONS                                             │
│ Good morning, Analyst                                        │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ Active   │ Evidence │ Approval │ Escalated│ Resolved        │
│ Cases    │ Pending  │ Pending  │          │ Today           │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│ Priority Investigations                                     │
│                                                              │
│ Case | Risk | Confidence | Status | NBA | Updated           │
├──────────────────────────────────────────────────────────────┤
│ Agent Activity                                               │
│ ✓ Retrieved graph evidence                                   │
│ ✓ Identified shared device                                  │
│ ! Evidence requested                                        │
├──────────────────────────────────────────────────────────────┤
│ Recent Cases                                                 │
└──────────────────────────────────────────────────────────────┘
```

---

# 10. Dashboard Prioritization

Do not make the dashboard a collection of decorative charts.

Priority should be:

```text
Cases requiring human attention
        ↓
Pending evidence
        ↓
Pending approvals
        ↓
High-risk investigations
        ↓
Recent activity
        ↓
General statistics
```

The dashboard should drive action.

---

# 11. Investigation Workspace

This is the **hero screen of the application**.

The analyst should be able to understand the full case without navigating through many pages.

## Recommended Layout

```text
┌───────────────────────────────────────────────────────────────────┐
│ CASE-10293       HIGH RISK       MEDIUM CONFIDENCE      ACTIVE    │
├─────────────────────────────┬─────────────────────────────────────┤
│                             │                                     │
│       GRAPH EXPLORER        │        EVIDENCE & FINDINGS          │
│                             │                                     │
│        ● Customer           │  Evidence #001                     │
│       /       \             │  Shared Device                     │
│   Account    Device         │  Strength: Strong                  │
│      │          │           │                                     │
│ Transactions  Customer     │  Evidence #002                     │
│                             │  Unusual transaction                │
│                             │                                     │
├─────────────────────────────┴─────────────────────────────────────┤
│ INVESTIGATION TIMELINE                                           │
├───────────────────────────────────────────────────────────────────┤
│ UNCERTAINTY / MISSING EVIDENCE                                   │
├───────────────────────────────────────────────────────────────────┤
│ NEXT-BEST-ACTION + POLICY + APPROVAL                             │
└───────────────────────────────────────────────────────────────────┘
```

---

# 12. Case Header

The case header should always remain visible.

Show:

```text
Case ID
Status
Risk
Confidence
Trigger
Transaction
Customer
Last Updated
```

Example:

```text
CASE-10293

HIGH RISK
MEDIUM CONFIDENCE
INVESTIGATING

Trigger:
High-risk transaction

TXN-10293
Customer C123
```

---

# 13. Risk & Confidence Design

Risk and confidence should be **separate**.

Example:

```text
RISK
HIGH
87

CONFIDENCE
MEDIUM
62%
```

This is important because:

```text
High Risk ≠ High Confidence
```

The UI should reinforce this concept.

---

# 14. Graph Explorer UX

The graph is the main visual investigation component.

## Visual Hierarchy

The analyst should immediately identify:

```text
Current Case
       ↓
Target Transaction
       ↓
Primary Customer
       ↓
Connected Entities
       ↓
Historical Cases
```

## Node Categories

Use distinct node shapes or icons:

```text
Customer
Account
Transaction
Device
Connection/IP
Merchant
Case
```

Do not depend only on color.

---

# 15. Graph Interactions

Support:

```text
Click node
Expand neighbors
Collapse branch
Focus node
Center graph
Filter entity type
Filter time range
Show only suspicious relationships
Open case
View transaction
View prior case
```

## Node Selection

When clicking a node:

```text
Node
 ↓
Context Panel
```

Example:

```text
DEVICE D77

Used by:
4 customers

Transactions:
82

First Seen:
...

Last Seen:
...

Related Cases:
2

[Expand]
[View Cases]
```

---

# 16. Graph Controls

Recommended floating control bar:

```text
[ + ] [ − ] [ Fit ] [ Reset ]

Entity Filter
Time Range
Relationship Filter
Suspicious Only
```

The graph should not visually overwhelm the rest of the case.

---

# 17. Evidence Panel

The Evidence panel is the second most important component.

Each evidence card should answer:

```text
WHAT?
FROM WHERE?
HOW STRONG?
WHY DOES IT MATTER?
```

Example:

```text
┌──────────────────────────────────────┐
│ EVIDENCE #004                        │
│ Shared Device Relationship           │
│                                      │
│ Customer C123                        │
│     ↓ uses                           │
│ Device D77                           │
│     ↓ also used by                   │
│ Customer C811                        │
│                                      │
│ Strength        STRONG               │
│ Source          TigerGraph           │
│ Supports       Pattern FP-03         │
│                                      │
│ [View in Graph] [Provenance]        │
└──────────────────────────────────────┘
```

---

# 18. Evidence States

Every evidence item can show:

```text
Supporting
Contradicting
Neutral
Contextual
```

Example:

```text
✓ Supporting Evidence
⚠ Contradicting Evidence
• Contextual Evidence
```

This makes the investigation visibly balanced.

---

# 19. Evidence Provenance UX

Clicking `Provenance` should open a trace:

```text
Finding
  ↓
Evidence
  ↓
Entity / Transaction
  ↓
Graph Relationship
  ↓
Query / Tool
  ↓
Source
```

Example:

```text
WHY DID THE AGENT FIND THIS?

Finding:
Connected to previous fraud case.

Evidence:
E-004

Graph:
C123 → Device D77 → C811

Previous Case:
CASE-103

Query:
find_prior_cases

Source:
TigerGraph
```

The user should never have to trust an unexplained AI statement.

---

# 20. Investigation Timeline UX

The timeline should make agent activity understandable.

Example:

```text
10:01  ● Investigation triggered

10:01  ● Case created

10:02  ✓ Transaction context retrieved

10:02  ✓ Customer history analyzed

10:03  ✓ Shared device discovered

10:03  ✓ Previous case found

10:04  ! Evidence insufficient

10:05  → Customer validation requested

10:06  ✓ Evidence received

10:06  ↻ Case reassessed

10:07  → Recommendation updated

10:08  ⏳ Approval requested

10:08  ✓ Approved

10:09  ✓ Action executed
```

---

# 21. AI Activity Design

Do not show chain-of-thought.

Instead show concise **operational activity**.

Good:

```text
Analyzing transaction context…
Searching connected entities…
Checking prior cases…
Evaluating evidence sufficiency…
```

Avoid:

```text
[long hidden reasoning]
```

The UI should expose what the agent **did**, what it **found**, and what it **decided**, not private internal reasoning.

---

# 22. Uncertainty Panel

This should be a highly visible component.

Example:

```text
┌─────────────────────────────────────────┐
│ INVESTIGATION UNCERTAINTY               │
├─────────────────────────────────────────┤
│ Evidence Sufficiency                    │
│ INSUFFICIENT                            │
│                                         │
│ Confidence                              │
│ 62%                                     │
│                                         │
│ What is known                           │
│ ✓ Unusual transaction                   │
│ ✓ New device                            │
│ ✓ Shared device                         │
│                                         │
│ What is uncertain                       │
│ ? Customer recognizes transaction       │
│                                         │
│ Missing evidence                        │
│ • Customer validation                   │
└─────────────────────────────────────────┘
```

The user should understand why the agent has not acted yet.

---

# 23. Evidence Planner UX

The evidence planner is a key differentiator.

Instead of simply:

```text
REQUEST MORE INFORMATION
```

show:

```text
WHY:
Customer recognition is unresolved.

BEST NEXT EVIDENCE:
Transaction validation

EXPECTED IMPACT:
High

WHY THIS EVIDENCE:
It directly resolves whether the transaction
was authorized by the account owner.

POLICY:
Allowed

APPROVAL:
Not required
```

Button:

```text
[ REQUEST EVIDENCE ]
```

---

# 24. Evidence Action Confirmation

Before executing an evidence request:

```text
┌──────────────────────────────────────────────┐
│ CONFIRM EVIDENCE REQUEST                    │
├──────────────────────────────────────────────┤
│ Action: Customer transaction validation       │
│                                              │
│ Purpose:                                     │
│ Resolve customer authorization uncertainty    │
│                                              │
│ Impact: High                                 │
│ Policy: Allowed                              │
│ Approval: Not required                       │
│                                              │
│ [Cancel]          [Request Evidence]         │
└──────────────────────────────────────────────┘
```

Avoid unnecessary confirmation dialogs for low-risk read-only operations.

---

# 25. Before / After Decision UX

This should be one of the most visually memorable sections.

## Before

```text
BEFORE ADDITIONAL EVIDENCE

Risk: HIGH
Confidence: 62%

Recommendation:
REQUEST CUSTOMER VALIDATION
```

## Evidence

```text
NEW EVIDENCE RECEIVED

Customer:
Transaction NOT recognized
```

## After

```text
AFTER ADDITIONAL EVIDENCE

Risk: VERY HIGH
Confidence: 91%

Recommendation:
ESCALATE / POLICY-DEFINED ACTION
```

Use a visual transition:

```text
BEFORE
  ↓
Evidence
  ↓
AFTER
```

This demonstrates the agent actually changed its decision based on new information.

---

# 26. Next-Best-Action Card

The NBA card should be the clear action center.

```text
┌───────────────────────────────────────────────┐
│ NEXT-BEST-ACTION                              │
├───────────────────────────────────────────────┤
│ ESCALATE CASE                                 │
│                                               │
│ Risk         VERY HIGH                        │
│ Confidence   91%                              │
│                                               │
│ Reason                                         │
│ Customer denied the transaction and graph      │
│ evidence connects the activity to a previous   │
│ fraud case.                                    │
│                                               │
│ Policy Reference                              │
│ POLICY-4.2                                    │
│                                               │
│ Approval Required                             │
│ YES — Fraud Supervisor                        │
│                                               │
│ [View Evidence] [View Policy] [Request Approval]│
└───────────────────────────────────────────────┘
```

---

# 27. Action States

Every action must show one explicit state:

```text
RECOMMENDED
PENDING APPROVAL
APPROVED
REJECTED
EXECUTED
FAILED
```

Avoid ambiguous labels such as:

```text
Done
Processed
Completed
```

unless their meaning is clear.

---

# 28. Approval UX

The Approvals page should show only decisions requiring human involvement.

## Approval Detail

```text
CASE-10293

Recommended:
BLOCK ACCOUNT

Why:
...
Evidence:
...
Policy:
...
Required Role:
Fraud Supervisor

[Approve]
[Reject]
[Request More Information]
```

When rejecting, require an optional/appropriate reason field because it can be useful for case memory and auditability.

---

# 29. Case Summary

At the top of a resolved case:

```text
CASE SUMMARY

Trigger:
High-risk transaction

Assessment:
High risk / High confidence

Fraud Pattern:
FP-03

Key Evidence:
3 strong signals
1 contextual signal

Additional Evidence:
Customer validation

Final Recommendation:
...

Outcome:
...
```

Keep this compact and scannable.

---

# 30. Case Memory UX

The Memory page should show relevant historical investigations.

Example:

```text
SIMILAR PAST CASES

CASE-103
Similarity: 91%
Outcome: Confirmed Fraud

Shared:
• Device relationship
• Merchant cluster
• Similar transaction sequence

[View Case]
```

Similarity should never imply that the previous case automatically determines the current decision.

---

# 31. Audit Log UX

The Audit Log should feel like an operational ledger.

Columns:

```text
Timestamp
Case
Actor
Event
Tool / Action
Result
```

Example:

```text
10:04
CASE-10293
Agent
Evidence request
Customer validation
Requested
```

Clicking the event opens detailed metadata.

---

# 32. Benchmark UX

Benchmark mode should be separated from normal operational workflows.

Purpose:

- run benchmark cases,
- see completion status,
- inspect outputs,
- identify failures,
- export required files.

## Benchmark Dashboard

```text
HHGOA BENCHMARK

20 Cases

Processed      17
Successful     15
Review          2
Failed          0

[Run All]
[Run Failed]
[Export Outputs]
```

---

# 33. Responsive Design

Desktop is the primary target.

Still support smaller screens by prioritizing:

```text
Case Header
↓
Risk / Confidence
↓
Evidence
↓
NBA
↓
Timeline
↓
Graph
```

On smaller screens:

- convert side-by-side panels into stacked sections,
- keep critical action buttons sticky,
- use a collapsible graph,
- preserve the case status and NBA.

---

# 34. Interaction Rules

## Rule 1 — Read Before Act

The action panel should show supporting context before the user commits to an action.

## Rule 2 — Evidence Is Clickable

Every important evidence item should link to its source context.

## Rule 3 — Graph and Evidence Stay Synchronized

Selecting an evidence item should highlight its relevant graph nodes/edges.

Selecting a graph relationship should reveal related evidence.

## Rule 4 — Timeline Is the System Story

The timeline should remain available throughout the case.

## Rule 5 — Don't Hide Uncertainty

If the system does not have enough evidence, clearly say so.

---

# 35. Graph ↔ Evidence Interaction

This interaction is particularly important.

```text
Click Evidence
      ↓
Highlight related graph path
      ↓
Open evidence detail
```

And:

```text
Click Graph Edge
      ↓
Find linked Evidence
      ↓
Show evidence card
```

Example:

```text
C123
  │
  │ USES
  │
D77
  │
  │ ALSO USED BY
  ▼
C811
```

Selecting this path highlights:

```text
E-004 Shared Device Evidence
```

---

# 36. Visualizing Uncertainty

Use a structured uncertainty visualization.

Possible format:

```text
CONFIDENCE

0% ──────── 50% ─────────── 100%
              ●
             62%
```

And separate:

```text
EVIDENCE SUFFICIENCY
[████████░░] INSUFFICIENT
```

Do not imply false mathematical precision beyond what the backend actually computes.

---

# 37. Empty States

Every empty state should explain what the user can do next.

Example:

```text
NO ACTIVE INVESTIGATIONS

New fraud triggers will appear here.

[View Cases]
```

Graph:

```text
NO RELATIONSHIPS FOUND

No connected entities were discovered
within the selected scope.

[Expand Search]
```

Evidence:

```text
NO ADDITIONAL EVIDENCE

The agent has not requested additional
evidence for this case.
```

---

# 38. Loading States

Avoid generic spinners for long agent tasks.

Use meaningful progress:

```text
Investigating customer...
✓

Analyzing device network...
●

Searching historical cases...
○

Assessing uncertainty...
○
```

This gives the analyst confidence that the system is doing useful work.

---

# 39. Error States

Errors should be operationally useful.

Bad:

```text
Something went wrong.
```

Better:

```text
TigerGraph query failed.

The case has not been modified.

[Retry Query]
[Continue Investigation]
[View Error Details]
```

For agent failures:

```text
Agent tool execution failed.

No evidence was added to the case.

[Retry]
[Escalate]
```

---

# 40. Notifications

Notifications should focus on meaningful events:

```text
New high-risk case
Additional evidence received
Approval required
Action approved
Action rejected
Investigation completed
Benchmark case failed
```

Avoid notifying for every internal agent step.

---

# 41. Accessibility

The UI should support:

- keyboard navigation,
- readable contrast,
- semantic labels,
- focus states,
- non-color status indicators,
- accessible graph controls,
- screen-reader-friendly tables and buttons.

Important actions must be identifiable without color.

---

# 42. Motion

Motion should communicate state changes rather than decorate the interface.

Useful:

```text
New evidence enters timeline
Graph node expansion
Before → after recommendation change
Approval status transition
```

Avoid:

- excessive glowing effects,
- constant animated particles,
- unnecessary dashboard motion.

---

# 43. Mobile / Small Screen Case Layout

```text
CASE HEADER
      ↓
RISK + CONFIDENCE
      ↓
KEY FINDINGS
      ↓
EVIDENCE
      ↓
UNCERTAINTY
      ↓
NBA
      ↓
APPROVAL / ACTION
      ↓
TIMELINE
      ↓
GRAPH
```

The graph becomes a focused exploration mode instead of occupying the entire case page.

---

# 44. Key Components

Recommended component inventory:

```text
AppShell
Sidebar
TopBar
GlobalSearch

Dashboard
MetricCard
CaseTable
PriorityCaseCard
AgentActivityFeed

CaseHeader
RiskBadge
ConfidenceMeter
StatusBadge

GraphExplorer
GraphNode
GraphEdge
GraphControls
NodeDetailsPanel

EvidencePanel
EvidenceCard
EvidenceTypeBadge
EvidenceStrength
EvidenceProvenance

FindingsPanel
FraudPatternCard

UncertaintyPanel
MissingEvidenceCard

EvidencePlannerCard
EvidenceRequestDialog

NBA Card
ActionState
PolicyCheck
ApprovalRoute

ApprovalPanel
ApprovalDialog

Timeline
TimelineEvent

MemoryPanel
SimilarCaseCard

AuditTable
AuditEventDrawer

BenchmarkDashboard
BenchmarkCaseTable
```

---

# 45. Design System Components

Create reusable primitives:

```text
Button
IconButton
Badge
Card
Panel
Tabs
Tooltip
Dropdown
Modal
Drawer
Table
Progress
Timeline
Toast
EmptyState
Skeleton
```

Use consistent spacing and radius throughout.

---

# 46. Recommended Spacing System

Use a compact enterprise spacing scale:

```text
4 px
8 px
12 px
16 px
20 px
24 px
32 px
```

Avoid huge whitespace around data-intensive areas.

The interface should feel information-dense but not cramped.

---

# 47. Recommended Layout Grid

Desktop target:

```text
Sidebar:        240 px
Main content:   Fluid
Case panels:    12-column grid
```

Example:

```text
Graph:       6 columns
Evidence:    6 columns

Timeline:   12 columns

Uncertainty: 6 columns
NBA:         6 columns
```

---

# 48. Case Workspace Responsive Grid

```text
Desktop:

┌───────────────┬───────────────┐
│ Graph         │ Evidence      │
│ 6 cols        │ 6 cols        │
├───────────────┴───────────────┤
│ Timeline       12 cols        │
├───────────────┬───────────────┤
│ Uncertainty   │ NBA            │
│ 6 cols        │ 6 cols         │
└───────────────┴───────────────┘
```

---

# 49. UX for Evidence Strength

Avoid arbitrary visual drama.

Recommended:

```text
STRONG
MODERATE
WEAK
```

or:

```text
High
Medium
Low
```

Always show text.

---

# 50. UX for Fraud Patterns

Pattern cards should show:

```text
Pattern ID
Pattern Name
Match Strength
Supporting Evidence
Contradicting Evidence
Policy Reference
```

Example:

```text
FP-03
Shared Device / Connected Account Pattern

Match:
HIGH

Supports:
E-001
E-004

Policy:
Section 4.2
```

---

# 51. UX for Undocumented Patterns

Use clearly differentiated language:

```text
POTENTIAL UNDOCUMENTED PATTERN

Graph structure differs from documented
fraud patterns.

Confidence:
Medium

[Inspect Pattern]
[Escalate for Review]
```

Do not style it as a confirmed fraud verdict.

---

# 52. UX for Policy

Policy context should be one click away from every decision.

Example:

```text
ACTION:
BLOCK ACCOUNT

POLICY:
Section 4.2

PERMISSION:
Supervisor approval required

[View Policy]
```

The analyst should not need to leave the case.

---

# 53. UX for Human-in-the-Loop

The application should clearly show where the human is required.

Example:

```text
AGENT RECOMMENDATION
        ↓
HUMAN APPROVAL REQUIRED
        ↓
SUPERVISOR
```

Use a dedicated state:

```text
AWAITING APPROVAL
```

with clear ownership.

---

# 54. Case Closure UX

Before closing:

```text
CASE COMPLETION CHECK

✓ Investigation completed
✓ Evidence recorded
✓ Final recommendation recorded
✓ Policy checked
✓ Approval recorded
✓ Action recorded
✓ Explanation generated
✓ Memory updated

[Resolve Case]
```

This prevents incomplete benchmark cases.

---

# 55. Final UX Flow

The ideal experience should visually communicate:

```text
                   ┌───────────────┐
                   │   DASHBOARD   │
                   └───────┬───────┘
                           ↓
                  ┌─────────────────┐
                  │   CASE TRIGGER  │
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │ CASE WORKSPACE  │
                  └────────┬────────┘
                           ↓
               ┌──────────────────────┐
               │ GRAPH + EVIDENCE     │
               └──────────┬───────────┘
                          ↓
                 ┌─────────────────┐
                 │ RISK + UNCERTAINTY│
                 └───────┬─────────┘
                         ↓
               ┌────────────────────┐
               │ ENOUGH EVIDENCE?   │
               └───────┬────────────┘
                  YES  │  NO
                       │
            ┌──────────┴───────────┐
            ↓                      ↓
       NBA ENGINE          EVIDENCE PLANNER
            │                      ↓
            │               ADDITIONAL EVIDENCE
            │                      ↓
            └────────────→ REASSESS
                                   │
                                   ↓
                          POLICY + PERMISSION
                                   │
                                   ↓
                          APPROVAL / ACTION
                                   │
                                   ↓
                              EXPLANATION
                                   │
                                   ↓
                            AUDIT + MEMORY
                                   │
                                   ↓
                              RESOLUTION
```

---

# 56. Design North Star

The application should make the agent feel like a **transparent investigator**, not an oracle.

The analyst should always see:

```text
WHAT IT FOUND
       +
HOW IT IS CONNECTED
       +
WHAT IT DOESN'T KNOW
       +
WHAT IT ASKED FOR
       +
WHAT CHANGED
       +
WHAT IT RECOMMENDS
       +
WHY
       +
WHO MUST APPROVE
```

That is the central UX requirement for the project.

---

# 57. Final UI/UX Direction

The final interface should combine:

```text
Enterprise case-management UX
+
Graph investigation workspace
+
Evidence-first reasoning
+
Visible uncertainty
+
Agent activity
+
Before/after decisioning
+
Policy-aware action controls
+
Human approval
+
Complete auditability
```

The **Graph + Evidence + Uncertainty + NBA** combination should define the product's visual identity.

The UI should make the following moment the hero interaction:

```text
Initial Suspicion
      ↓
Graph Discovery
      ↓
Evidence Conflict / Uncertainty
      ↓
Agent Selects Most Useful Evidence
      ↓
New Evidence Arrives
      ↓
Recommendation Changes
      ↓
Policy-Constrained Action
```

That interaction demonstrates the core product thesis without requiring the analyst to understand the underlying implementation.
