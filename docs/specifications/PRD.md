# PRD — Agentic Fraud Investigation & Next-Best-Action Platform

**Hackathon:** TigerGraph Agentic Fraud Investigation HHGOA  
**Project Type:** AI Agent / Fraud Investigation / GraphRAG / Next-Best-Action  
**Primary Platform:** TigerGraph  
**Status:** Product Requirements Document — Research-Driven Draft  
**Target:** HHGOA 2026 benchmark and end-to-end hackathon demonstration

---

## 1. Product Summary

### Product Name
**Agentic Fraud Investigation & Next-Best-Action Engine**

### One-Line Description

A graph-native AI investigation agent that moves from a suspicious fraud signal to a defensible next action by exploring connected entities and transactions, evaluating evidence and uncertainty, requesting the most useful missing evidence when necessary, applying fraud policy and permission controls, and maintaining a complete case memory and audit trail.

### Product Vision

Transform fraud investigation from a fragmented manual workflow into an evidence-driven, graph-powered, auditable agentic workflow.

The goal is **not** to replace the bank's initial fraud detector.

The fraud/risk signal is treated as the investigation trigger. The product's responsibility is to determine:

> **What is happening, what evidence supports it, what is still uncertain, what evidence should be obtained next, and what should happen now?**

---

# 2. Problem Statement

Fraud teams often have to manually:

- gather transaction history,
- trace money or transaction relationships,
- identify connected accounts and entities,
- examine device and identity signals,
- review historical behavior,
- compare previous cases,
- interpret fraud policies,
- assess uncertainty,
- document findings,
- determine the next action,
- and maintain a case record.

The HHGOA problem statement explicitly asks for an agent that can investigate fraud, create and progress cases, use prior case memory, gather additional evidence through controlled actions, recommend or execute appropriate next actions, respect policy and permissions, determine when enough evidence exists, and explain its reasoning.

### Core Problem

Existing fraud systems and investigation workflows can provide detection, alerts, graphs, case management, analytics, and increasingly AI assistance. The opportunity for this project is to make the **investigation loop itself adaptive**:

```text
Fraud Signal
    ↓
Investigate
    ↓
Gather Evidence
    ↓
Assess Risk + Uncertainty
    ↓
Enough Evidence?
   /        \
 Yes         No
 |            |
Action     Select Next Evidence
              ↓
         Acquire Evidence
              ↓
        Re-assess the Case
              ↓
            Action
              ↓
        Explain + Record
              ↓
          Case Memory
```

---

# 3. Product Goals

## Primary Goals

### G1 — Graph-Native Investigation

Use TigerGraph as the core investigation layer for:

- entity relationships,
- transaction relationships,
- multi-hop traversal,
- fraud-pattern analysis,
- temporal relationship analysis,
- prior-case connections,
- graph-based evidence discovery.

### G2 — Explicit Uncertainty Reasoning

The agent must distinguish between:

- high risk with high confidence,
- high risk with low/medium confidence,
- low risk with strong evidence,
- conflicting evidence,
- insufficient evidence.

The agent must be able to decide whether to:

1. act,
2. gather more evidence,
3. monitor,
4. escalate to a human.

### G3 — Intelligent Evidence Acquisition

When evidence is insufficient, the agent should select an appropriate next evidence action rather than issuing a generic "request more information."

Candidate evidence actions include:

- transaction validation by account owner,
- step-up authentication,
- additional analyst information,
- additional approved data sources.

The product should eventually rank evidence requests by their expected usefulness to the decision.

### G4 — Next-Best-Action Decisioning

The agent must recommend one or more next actions based on:

- evidence,
- risk,
- uncertainty,
- fraud pattern,
- policy,
- permissions,
- approval requirements,
- previous case outcomes.

### G5 — Evidence-Grounded Explainability

Every important finding and recommendation should be traceable to concrete evidence.

The explanation should answer:

- What evidence was used?
- Which graph relationships mattered?
- What policy or fraud pattern supports the finding?
- What evidence was missing?
- Why was additional evidence requested?
- Why was the final action recommended?
- What approval route is required?

### G6 — Case Lifecycle and Memory

Create and progress cases throughout the investigation.

Persist:

- evidence,
- findings,
- risk assessments,
- confidence/uncertainty,
- evidence requests,
- decisions,
- actions,
- approvals,
- outcomes,
- explanations.

Use previous cases as investigative memory.

### G7 — Benchmark Performance

Generate the required output for all 20 HHGOA benchmark cases and support:

- case record,
- graph representation,
- evidence/finding record,
- decisions/actions,
- SAR when required,
- next-best-action before additional evidence,
- next-best-action after additional evidence.

---

# 4. Non-Goals

The project will **not** attempt to:

- replace the bank's upstream fraud scoring model,
- autonomously execute unrestricted financial actions,
- make unsupported claims about fraud without evidence,
- rely on an LLM alone for graph/fraud analysis,
- build a generalized banking core,
- replace human approval where policy requires it,
- claim that all real-world fraud patterns can be detected from this benchmark,
- create a production banking integration beyond mock/stub APIs where required for the demo.

---

# 5. Target Users

## Primary User — Fraud Analyst

Needs to:

- understand why a case was triggered,
- inspect connected entities,
- review evidence,
- understand uncertainty,
- request or approve additional evidence,
- review recommended actions,
- approve restricted actions,
- inspect prior cases,
- audit the complete investigation.

## Secondary User — Fraud Operations / Supervisor

Needs to:

- review escalated cases,
- see pending approvals,
- inspect case history,
- understand decision rationale,
- monitor investigation quality.

## System User — Investigation Agent

The AI agent operates tools and orchestrates the investigation.

---

# 6. Product Principles

### P1 — Evidence Before Conclusion

The agent must ground significant claims in retrieved evidence.

### P2 — Graph Before Guessing

Use graph traversal and structured data analysis to uncover relationships before relying on LLM inference.

### P3 — Risk Is Not the Decision

A risk score is an input to investigation, not automatically the final action.

### P4 — Uncertainty Is a First-Class State

The system should explicitly represent uncertainty instead of forcing a binary conclusion.

### P5 — Request Evidence With Purpose

Every evidence request should state what uncertainty it is intended to reduce.

### P6 — Policy Constrains Actions

The agent can recommend actions, but execution must follow permissions and approval requirements.

### P7 — Every Decision Is Auditable

Investigation steps, evidence, tool usage, decisions and actions should remain traceable.

### P8 — Memory Must Improve Future Investigations

Resolved cases should become structured investigative knowledge rather than isolated records.

---

# 7. Core User Journey

## Stage 1 — Trigger

Investigation starts from:

- fraud/risk signal,
- customer report,
- analyst request,
- another supported event.

### Example

```text
Transaction T12345
Risk Score: 87
Trigger: High-risk transaction
```

---

## Stage 2 — Case Creation

Create/open a case.

Record:

- case ID,
- trigger,
- transaction,
- customer/account,
- timestamp,
- initial risk,
- investigation status.

---

## Stage 3 — Initial Graph Investigation

The agent uses TigerGraph through the available graph interface/MCP tools to investigate:

- customer,
- account,
- transaction,
- device,
- identity,
- IP/connection,
- merchant,
- related customers/accounts,
- related transactions,
- previous cases.

### Example graph investigation

```text
Customer
   ↓
Device
   ↓
Other Customers
   ↓
Their Transactions
   ↓
Merchant / IP / Identity
   ↓
Previous Fraud Cases
```

---

## Stage 4 — Pattern Detection

The system evaluates:

### Known patterns

Compare discovered evidence against the fraud patterns and policy supplied with the benchmark.

### Behavioral patterns

Look for:

- unusual transaction amount,
- unusual frequency,
- unusual timing,
- unusual device behavior,
- new relationships,
- account/entity connections,
- repeated suspicious relationships.

### Network patterns

Look for:

- shared devices,
- shared IP/connection signals,
- shared identity attributes,
- suspicious merchant/customer clusters,
- repeated entity relationships,
- multi-hop links to known fraud cases.

### Unknown-pattern discovery

The system should also surface suspicious graph structures that do not cleanly map to the documented fraud patterns.

This is a discovery signal, not an automatic fraud conclusion.

---

# 8. Evidence Model

Evidence should be represented as structured objects.

## Evidence Object

```json
{
  "evidence_id": "E-001",
  "type": "shared_device",
  "source": "TigerGraph",
  "entities": ["C123", "D77", "C912"],
  "relationship": "Customer C123 uses Device D77 which is also used by C912",
  "timestamp_context": "2026-05-17",
  "strength": 0.82,
  "supports": "fraud_pattern_X",
  "contradicts": null,
  "provenance": "graph_query_17"
}
```

## Evidence Categories

- Transaction evidence
- Customer/account evidence
- Device evidence
- Identity evidence
- Behavioral evidence
- Temporal evidence
- Graph/network evidence
- Previous-case evidence
- Policy evidence
- External/approved evidence

---

# 9. Uncertainty Engine

Uncertainty is a central product capability.

## Required Inputs

- initial risk score,
- graph evidence,
- behavioral evidence,
- fraud-pattern match,
- previous-case similarity,
- contradictory evidence,
- policy requirements,
- evidence completeness.

## Required Outputs

```text
Risk Level
Confidence Level
Evidence Sufficiency
Contradictions
Missing Evidence
Recommended Next Step
```

### Example

```text
Risk: HIGH
Confidence: MEDIUM
Evidence Sufficiency: INSUFFICIENT

Strong signals:
- New device
- Unusual amount
- Shared device relationship

Contradictory signal:
- Similar device activity was previously legitimate

Recommended next evidence:
Customer transaction verification
```

---

# 10. Intelligent Evidence Planner

This is one of the primary differentiating capabilities.

When evidence is insufficient, the agent should select the evidence action that is most relevant to the unresolved uncertainty.

## Evidence Request Object

```json
{
  "request_id": "REQ-001",
  "action": "customer_transaction_validation",
  "reason": "Resolve whether the customer recognizes the transaction",
  "uncertainty_target": "legitimate_customer_activity_vs_account_compromise",
  "expected_decision_impact": "high",
  "policy_allowed": true,
  "approval_required": false
}
```

## Candidate Actions

```text
1. Customer transaction validation
2. Step-up authentication
3. Request analyst information
4. Retrieve additional approved data
5. Escalate to human analyst
```

The agent should not request evidence merely because it can.

It should request evidence because the evidence is expected to materially improve the decision.

---

# 11. Next-Best-Action Engine

The engine combines:

```text
Evidence
+
Risk
+
Confidence
+
Fraud Pattern
+
Policy
+
Permissions
+
Approval Rules
+
Prior Case Outcomes
```

## Candidate Actions

- Allow transaction
- Block transaction
- Monitor transaction/account
- Block account
- Warn customer
- Create/continue fraud case
- Request additional evidence
- Escalate to fraud analyst
- File report/SAR when policy requires it
- Other policy-defined mock actions

---

# 12. Policy & Permission Control Plane

The agent must never treat all actions as freely executable.

Each action should have metadata:

```json
{
  "action": "block_account",
  "allowed": true,
  "approval_required": true,
  "required_role": "fraud_supervisor",
  "policy_reference": "POLICY-4.2"
}
```

## Execution Rules

### Recommend only

The agent recommends the action but cannot execute it.

### Execute automatically

The action is within agent permissions and policy.

### Human approval

The agent prepares the action and sends it to an authorized reviewer.

### Prohibited

The action cannot be executed.

---

# 13. Case Management

Every investigation must have a persistent case.

## Case States

```text
TRIGGERED
    ↓
INVESTIGATING
    ↓
EVIDENCE_GATHERING
    ↓
AWAITING_INFORMATION
    ↓
REASSESSMENT
    ↓
ACTION_RECOMMENDED
    ↓
AWAITING_APPROVAL
    ↓
ACTION_TAKEN
    ↓
RESOLVED
```

Additional failure/escalation state:

```text
ESCALATED
```

## Case Record

```json
{
  "case_id": "CASE-001",
  "trigger": {},
  "entities": [],
  "transactions": [],
  "evidence": [],
  "findings": [],
  "risk_assessment": {},
  "uncertainty": {},
  "evidence_requests": [],
  "recommendations": [],
  "approvals": [],
  "actions": [],
  "outcome": {},
  "audit_log": []
}
```

---

# 14. Case Memory

The memory layer should support both:

## Semantic Memory

Retrieve similar historical investigations.

## Structured Case Memory

Store:

- fraud pattern,
- graph structure,
- involved entities,
- evidence,
- actions,
- approvals,
- final outcome.

## Memory Retrieval Example

```text
Current Case
    ↓
Find structurally/semantically similar resolved cases
    ↓
Retrieve:
- evidence patterns
- previous decisions
- outcomes
- analyst actions
    ↓
Use as supporting context
```

Historical cases should inform recommendations but must not blindly determine them.

---

# 15. Evidence Provenance Graph

Every important finding should have a traceable path.

```text
Recommendation
      ↓
Finding
      ↓
Evidence
      ↓
Graph Entity / Transaction
      ↓
TigerGraph Query
```

For policy-driven reasoning:

```text
Recommendation
      ↓
Policy Check
      ↓
Fraud Pattern / Policy Section
      ↓
Evidence
```

This allows the UI to answer:

> "Why did the agent recommend this?"

---

# 16. Temporal Investigation

The graph should support time-aware reasoning.

The system should be capable of asking:

```text
What happened?
Who was involved?
When did it happen?
What happened immediately before?
What happened immediately after?
How quickly did the relationships form?
```

### Example

```text
New Device Registered
        ↓ 4 min
Login
        ↓ 3 min
New IP
        ↓ 2 min
High-value Transaction
        ↓ 1 min
Another Related Account Activity
```

The sequence can become investigation evidence.

---

# 17. Unknown Fraud Pattern Discovery

Known fraud typologies will be explicitly represented.

However, the benchmark notes that not every fraud pattern present in the data is documented.

Therefore:

```text
Known Pattern Matching
        +
Graph Anomaly / Structural Discovery
        =
Broader Investigation
```

An unknown pattern should be surfaced as:

```text
Potential Undocumented Pattern
Confidence: Medium
Supporting structure: ...
```

rather than automatically classified as confirmed fraud.

---

# 18. Agent Architecture

## High-Level Architecture

```text
┌────────────────────────────────────────────┐
│                 Analyst UI                  │
│ Cases • Evidence • Graph • Actions • Audit │
└──────────────────────┬─────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────┐
│           INVESTIGATION AGENT              │
│                                            │
│ Planning                                   │
│ Tool Selection                             │
│ Evidence Synthesis                         │
│ Uncertainty Assessment                     │
│ Next-Best-Action                           │
└─────────┬────────────┬────────────┬────────┘
          │            │            │
          ▼            ▼            ▼
   TigerGraph       GraphRAG      Policy Engine
      / MCP             │             │
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                Evidence Context
                        │
                        ▼
              Case Memory / Vector
                        │
                        ▼
                 Case Management
                        │
                        ▼
                Mock Action APIs
```

---

# 19. Agent Toolset

The agent should have controlled tools rather than unrestricted database access.

## Required Tool Categories

### Graph Tools

- get entity
- get neighbors
- multi-hop traversal
- transaction history
- related entities
- prior-case relationships
- graph pattern detection
- temporal queries
- graph statistics

### Search / Retrieval Tools

- policy retrieval
- fraud typology retrieval
- regulatory reference retrieval
- previous-case retrieval

### Case Tools

- create case
- update case
- add evidence
- add finding
- update risk
- update recommendation
- record decision
- record action

### Evidence Tools

- request customer verification
- request step-up authentication
- request analyst information

### Action Tools

- recommend action
- execute authorized mock action
- request approval
- escalate case

---

# 20. TigerGraph Requirements

TigerGraph is a mandatory platform component for this project.

The implementation should use TigerGraph for:

- graph storage,
- connected fraud investigation,
- relationship traversal,
- GSQL,
- graph algorithms,
- pattern detection,
- relationship analysis.

TigerGraph MCP should expose graph capabilities to the agent.

GraphRAG should provide relevant connected context to the LLM.

The LLM should perform reasoning, tool selection, evidence synthesis and explanations rather than replacing graph analytics.

---

# 21. Data Model

## Core Vertices

Initial candidate model:

```text
Customer
Account
Transaction
Device
Identity
IP / Connection
Merchant
Case
FraudPattern
Policy
Evidence
Action
```

## Core Edges

Examples:

```text
Customer ─OWNS→ Account
Customer ─MADE→ Transaction
Customer ─USES→ Device
Customer ─ASSOCIATED_WITH→ Identity
Device ─CONNECTED_TO→ IP
Transaction ─AT_MERCHANT→ Merchant
Transaction ─INVOLVES→ Device
Case ─CONCERNS→ Transaction
Case ─INVOLVES→ Customer
Case ─HAS_EVIDENCE→ Evidence
Case ─MATCHES→ FraudPattern
Case ─REFERENCES→ Policy
Case ─RESULTED_IN→ Action
```

The final schema must be derived from the actual HHGOA dataset README and available files before implementation is finalized.

---

# 22. UI / UX Requirements

The UI should make the investigation process visible.

## Main Screens

### A. Investigation Dashboard

Show:

- active cases,
- trigger count,
- cases awaiting evidence,
- cases awaiting approval,
- escalations,
- resolved cases.

### B. Case Investigation View

Show:

```text
Case Header
↓
Risk + Confidence
↓
Investigation Timeline
↓
Graph Evidence
↓
Evidence Table
↓
Fraud Pattern Analysis
↓
Missing Evidence
↓
Next-Best-Action
↓
Approval Route
↓
Audit Trail
```

### C. Graph Explorer

Show:

- customers,
- accounts,
- devices,
- transactions,
- merchants,
- previous cases,
- suspicious relationships.

### D. Evidence Panel

Every evidence item should show:

- evidence type,
- source,
- strength,
- supporting entities,
- timestamp,
- policy/pattern relation,
- provenance.

### E. Agent Reasoning / Activity Panel

Display controlled agent actions such as:

```text
Investigating transaction...
Retrieved customer history
Found shared device relationship
Retrieved related historical case
Policy check completed
Evidence insufficient
Requested customer validation
Received new evidence
Reassessed case
Updated recommendation
```

This should represent auditable agent activity rather than expose hidden chain-of-thought.

---

# 23. Explainability Requirements

The final explanation must be **evidence-based**, not generic.

## Required Output

```text
CASE CONCLUSION

Risk:
HIGH

Confidence:
0.89

Key Evidence:
1. ...
2. ...
3. ...

Fraud Pattern:
Pattern X

Remaining Uncertainty:
...

Additional Evidence Requested:
...

Why:
...

Recommended Action:
...

Policy Basis:
...

Approval Route:
...

Evidence Provenance:
...
```

---

# 24. Before/After Evidence Loop

This is a mandatory benchmark capability.

## Before Evidence

```text
Initial Case
    ↓
Investigation
    ↓
Risk + Confidence
    ↓
Initial NBA
    ↓
Evidence Request
```

Record:

- initial findings,
- uncertainty,
- initial next-best-action,
- evidence requested,
- reason.

## After Evidence

```text
New Evidence
    ↓
Case Reassessment
    ↓
Updated Risk + Confidence
    ↓
Updated NBA
```

Record:

- received evidence,
- changed findings,
- changed risk/confidence,
- updated action,
- updated explanation.

---

# 25. SAR / Reporting

Where the benchmark policy requires a suspicious activity report, the system should generate the required SAR/report output.

The report should be grounded in the case record and policy.

The system must distinguish:

```text
Evidence
Finding
Decision
Report Requirement
```

A report must not invent facts that are not present in the investigation record.

---

# 26. Audit Trail

Every important event should be logged.

## Audit Event

```json
{
  "timestamp": "...",
  "case_id": "CASE-001",
  "actor": "investigation_agent",
  "event": "evidence_requested",
  "tool": "customer_validation",
  "reason": "...",
  "evidence_used": ["E-001", "E-002"],
  "policy_reference": "POLICY-4.2"
}
```

Audit logs should cover:

- trigger,
- tool calls,
- graph queries,
- evidence retrieval,
- policy checks,
- evidence requests,
- recommendations,
- approvals,
- actions,
- case updates,
- final outcome.

---

# 27. Agent Safety & Control Requirements

## Authorization

The agent must verify that an action is:

1. permitted by policy,
2. permitted for the agent role,
3. not requiring approval unless approval is present.

## Human-in-the-Loop

Human approval must be supported for restricted actions.

## No Unsupported Claims

The agent should never claim:

- evidence was retrieved when it was not,
- an action was executed when it was only recommended,
- a case was confirmed when the evidence only indicates suspicion.

## Traceability

Every recommendation must identify its evidence basis.

---

# 28. Technical Stack

## Required

- **TigerGraph Savanna or Community Edition**
- **GSQL**
- **TigerGraph graph algorithms**
- **TigerGraph MCP**
- **GraphRAG**
- User interface

## Suggested

- **Python**
- **FastAPI**
- **LangGraph** or another suitable agent framework
- **LLM** selected based on latency, structured-output quality and tool-calling reliability
- **Vector retrieval** through the supported TigerGraph capabilities where practical
- **Mock APIs** for controlled external actions
- **Frontend:** React / Next.js
- **Visualization:** graph visualization library compatible with the frontend

The final stack should prioritize reliability and benchmark performance over unnecessary framework complexity.

---

# 29. Dataset Strategy

The HHGOA dataset is based on the IEEE-CIS Fraud Detection data from Vesta Corporation.

The supplied problem statement specifies:

- approximately 590,000 transactions,
- approximately 13,500 customers,
- six months of data,
- device and connection records,
- transaction-level bank risk scores,
- no universal `Is Fraud` flag,
- closed investigations from the first four months,
- confirmed fraud and cleared cases,
- bank fraud policy,
- five known fraud patterns,
- regulatory references,
- 20 benchmark cases from the final two months,
- additional data may be added,
- undocumented fraud patterns exist.

### Dataset Principle

Do not start implementation assumptions from generic IEEE-CIS schemas alone.

First:

1. Read the supplied README.
2. Identify every file.
3. Map every column.
4. Understand the case format.
5. Identify the five documented patterns.
6. Understand policy rules.
7. Understand benchmark case structure.
8. Define the graph schema from the actual data.

---

# 30. Functional Requirements

## FR-01 Trigger Investigation

The system shall create/start an investigation from a supported trigger.

## FR-02 Case Creation

The system shall create a persistent case when investigation is warranted.

## FR-03 Graph Investigation

The agent shall query connected entities and transactions through TigerGraph.

## FR-04 Evidence Collection

The agent shall collect and record evidence from graph, transaction, behavioral, prior-case and policy sources.

## FR-05 Fraud Pattern Assessment

The agent shall identify likely known fraud patterns and surface possible undocumented patterns.

## FR-06 Risk Assessment

The system shall produce a risk assessment based on available evidence.

## FR-07 Uncertainty Assessment

The system shall explicitly determine whether the evidence is sufficient.

## FR-08 Evidence Planning

When insufficient evidence exists, the agent shall select an appropriate controlled evidence-gathering action.

## FR-09 Recommendation

The system shall recommend a next-best-action.

## FR-10 Action Control

The system shall enforce policy and permission requirements before action execution.

## FR-11 Human Approval

The system shall support approval workflows for restricted actions.

## FR-12 Case Progression

The system shall update case state as evidence and decisions evolve.

## FR-13 Before/After Decisioning

The system shall record NBA before additional evidence and NBA after additional evidence.

## FR-14 Explainability

The system shall provide evidence-grounded explanations.

## FR-15 Case Memory

The system shall retrieve relevant historical cases.

## FR-16 Memory Update

The system shall store resolved case outcomes for future investigations.

## FR-17 Auditability

The system shall retain an investigation timeline and action audit trail.

## FR-18 Graph Persistence

The case must also be represented in the graph as required by the benchmark.

---

# 31. Non-Functional Requirements

## NFR-01 Reliability

The system should produce deterministic structured outputs where possible.

## NFR-02 Traceability

Each recommendation must be traceable to evidence and policy.

## NFR-03 Latency

Interactive graph investigation should return results quickly enough for a live demonstration.

## NFR-04 Recoverability

Failed tool calls should not silently corrupt case state.

## NFR-05 Structured Output

Agent outputs should use validated schemas.

## NFR-06 Security

Secrets and credentials must not be embedded in source code.

## NFR-07 Explainability

The explanation must refer to actual retrieved evidence.

## NFR-08 Reproducibility

A benchmark investigation should be reproducible from the stored case record and tool history.

---

# 32. Evaluation Strategy

The evaluation should mirror the HHGOA judging criteria.

## A. Investigation Accuracy — 25%

Measure:

- correctness of fraud-pattern identification,
- relevance of evidence gathered,
- graph relationships discovered,
- quality of case investigation.

## B. Next-Best-Action — 25%

Measure:

- appropriate action,
- treatment of uncertainty,
- quality of evidence requests,
- recommendation updates after evidence.

## C. Case Summary & Explainability — 10%

Measure:

- case completeness,
- evidence clarity,
- decision rationale,
- evidence provenance.

## D. Agentic Design & Engineering — 15%

Measure:

- tool use,
- workflow,
- memory,
- permissions,
- controls,
- architecture.

## E. Innovation — 15%

Measure:

- intelligent evidence acquisition,
- uncertainty loop,
- temporal graph reasoning,
- unknown pattern discovery,
- evidence provenance,
- outcome-aware memory.

## F. Demo — 10%

Measure:

- end-to-end clarity,
- visible agent workflow,
- realistic investigation,
- clear before/after evidence loop.

These categories mirror the published HHGOA judging criteria.

---

# 33. Internal Product Metrics

In addition to the hackathon rubric, the team should track:

### Investigation Completeness

Percentage of expected relevant evidence categories examined.

### Evidence Relevance

Percentage of retrieved evidence judged relevant to the case.

### NBA Accuracy

Percentage of benchmark cases where the final recommended action matches the expected policy-consistent outcome.

### Evidence-Request Quality

Whether requested evidence meaningfully changes or resolves the decision.

### Decision Consistency

Whether similar cases result in logically consistent recommendations.

### Explanation Grounding

Percentage of explanation claims traceable to stored evidence.

### Tool Efficiency

Number of unnecessary graph/tool calls per case.

### Case Completeness

Percentage of required case fields populated correctly.

### Memory Utility

Percentage of cases where retrieved historical cases provide materially relevant context.

---

# 34. MVP Scope

The MVP should focus on the smallest set of capabilities that demonstrates the full investigation loop.

## MVP-1 — Graph Investigation

- TigerGraph schema
- customer/transaction/device/entity relationships
- multi-hop traversal
- transaction history
- prior-case relationships

## MVP-2 — Evidence Engine

- evidence objects
- evidence strength
- provenance
- supporting/contradicting evidence

## MVP-3 — Uncertainty Engine

- risk
- confidence
- evidence sufficiency
- missing evidence

## MVP-4 — Evidence Planner

- select additional evidence
- explain why it is required
- simulate/execute controlled evidence request

## MVP-5 — Next-Best-Action Engine

- generate action candidates
- policy-check them
- determine approval route
- recommend final action

## MVP-6 — Case Lifecycle

- case creation
- timeline
- updates
- decisions
- actions
- resolution

## MVP-7 — Case Memory

- retrieve similar historical cases
- store new outcomes
- connect cases through graph

## MVP-8 — Explainability

- evidence-grounded reasoning summary
- policy reference
- action justification
- provenance

## MVP-9 — Benchmark Runner

- process all 20 benchmark cases
- generate required answer files
- produce before/after evidence outputs
- write cases to graph

---

# 35. Future Enhancements

These are secondary to the benchmark MVP.

- live streaming transactions,
- real bank API integrations,
- real customer messaging,
- real step-up authentication,
- adaptive fraud-pattern discovery,
- graph neural networks,
- reinforcement learning for evidence selection,
- active analyst feedback learning,
- cross-institution fraud intelligence,
- real-time monitoring,
- automated regulatory reporting pipelines.

---

# 36. Competitive Positioning

The product should **not** be positioned as the first AI fraud investigation system.

Existing commercial platforms already provide combinations of:

- fraud detection,
- graph/network analytics,
- case management,
- AI-assisted investigation,
- agentic workflows,
- explainability.

Examples include NICE Actimize, IBM fraud/risk platforms, Quantexa, Feedzai, Pindrop, and newer agentic-native fraud platforms.

The project's differentiated research/product focus is:

> **Evidence-driven autonomous investigation under uncertainty.**

The key distinction is the investigation loop:

```text
Detect
  ↓
Investigate
  ↓
Assess Evidence
  ↓
Measure Uncertainty
  ↓
Select Most Useful Next Evidence
  ↓
Acquire Evidence
  ↓
Reassess
  ↓
Policy-Constrained Next-Best-Action
  ↓
Explain
  ↓
Remember
```

---

# 37. Core Differentiators / MVP Value Propositions

| Industry capability/challenge | Our product capability |
|---|---|
| Fraud signal is often only an initial indicator | Investigation-first workflow |
| Connected fraud is difficult to see in isolated records | Graph-native investigation |
| More evidence may be required | Intelligent evidence planner |
| Uncertainty can be hidden inside a score | Explicit uncertainty model |
| Evidence may change the right action | Before/after decision loop |
| Static relationship analysis misses sequence | Temporal investigation |
| Known typologies do not cover every pattern | Unknown-pattern discovery |
| LLM explanations can be generic | Evidence provenance |
| Historical cases can be isolated | Outcome-aware case memory |
| Actions have different permission requirements | Policy/permission control plane |
| Investigation steps can be difficult to reconstruct | Full audit timeline |

---

# 38. Golden Path Demonstration

The demo should tell one complete, visually understandable story.

## Scenario

A high-risk transaction triggers an investigation.

### Step 1 — Trigger

```text
Transaction T1001
Risk Score: 86
```

### Step 2 — Graph Investigation

Agent discovers:

```text
Customer C10
   ↓ uses
Device D77
   ↓ used by
Customer C51
   ↓ connected to
Previous Case C-103
```

### Step 3 — Evidence

The agent discovers:

- unusual transaction amount,
- new device,
- shared device,
- related historical case,
- conflicting legitimate historical behavior.

### Step 4 — Uncertainty

```text
Risk: High
Confidence: Medium
Evidence: Insufficient
```

### Step 5 — Evidence Planning

Agent decides:

```text
Request customer transaction validation
```

and explains the uncertainty it will resolve.

### Step 6 — New Evidence

Customer validation returns:

```text
Transaction not recognized
```

### Step 7 — Reassessment

```text
Risk: Very High
Confidence: High
```

### Step 8 — Next-Best-Action

Agent recommends a policy-approved action and identifies the approval route if required.

### Step 9 — Explanation

Agent shows:

- evidence,
- graph relationships,
- policy connection,
- uncertainty resolution,
- decision rationale.

### Step 10 — Memory

The resolved case is stored and becomes available for future similar investigations.

---

# 39. Implementation Roadmap

## Phase 1 — Dataset Reverse Engineering

**Priority: Highest**

Tasks:

- obtain/read HHGOA README,
- inspect all files,
- map schemas,
- understand case format,
- inspect five known patterns,
- understand policy,
- analyze benchmark cases.

Deliverable:

**Dataset + Investigation Data Model**

---

## Phase 2 — Graph Foundation

Tasks:

- design TigerGraph schema,
- ingest dataset,
- create vertex/edge mappings,
- implement GSQL investigation queries,
- implement temporal and multi-hop investigations.

Deliverable:

**Fraud Investigation Graph**

---

## Phase 3 — Evidence Layer

Tasks:

- evidence object schema,
- provenance model,
- evidence ranking,
- contradiction tracking.

Deliverable:

**Evidence Engine**

---

## Phase 4 — Agent

Tasks:

- planner,
- graph tool selection,
- evidence synthesis,
- uncertainty assessment,
- evidence planner,
- next-best-action.

Deliverable:

**Working Investigation Agent**

---

## Phase 5 — Policy & Control

Tasks:

- policy retrieval,
- action eligibility,
- permission checks,
- approval routing,
- mock APIs.

Deliverable:

**Controlled Decision Engine**

---

## Phase 6 — Case Memory

Tasks:

- prior-case retrieval,
- similarity search,
- structured case graph,
- resolved-case memory.

Deliverable:

**Institutional Investigation Memory**

---

## Phase 7 — UI

Tasks:

- dashboard,
- case view,
- graph explorer,
- evidence panel,
- action/approval panel,
- audit timeline.

Deliverable:

**Analyst Investigation Interface**

---

## Phase 8 — Benchmark

Tasks:

- run 20 benchmark cases,
- inspect outputs,
- improve graph queries,
- improve evidence selection,
- improve policy reasoning,
- verify before/after NBA,
- generate final answer files.

Deliverable:

**Benchmark Submission Package**

---

## Phase 9 — Demo & Submission

Tasks:

- stabilize system,
- record 3–5 minute demo,
- prepare GitHub repository,
- prepare technical blog,
- prepare social post,
- verify final submission artifacts.

---

# 40. Definition of Done

The product is considered MVP-complete when it can:

- [ ] accept a fraud investigation trigger,
- [ ] create a case,
- [ ] investigate connected entities in TigerGraph,
- [ ] retrieve transaction and behavioral evidence,
- [ ] retrieve relevant previous cases,
- [ ] identify known fraud patterns where supported,
- [ ] flag potentially undocumented patterns,
- [ ] calculate/represent risk and confidence,
- [ ] determine evidence sufficiency,
- [ ] identify missing evidence,
- [ ] select a controlled next evidence action,
- [ ] update the case after new evidence,
- [ ] produce a next-best-action before evidence,
- [ ] produce an updated next-best-action after evidence,
- [ ] enforce policy and permissions,
- [ ] support human approval,
- [ ] provide evidence-grounded explanation,
- [ ] maintain case history,
- [ ] write the case to TigerGraph,
- [ ] update case memory,
- [ ] generate benchmark outputs for all 20 cases.

---

# 41. Final Product Thesis

The project's core thesis is:

> **Fraud investigation should not stop at detecting a suspicious signal. An effective AI investigator must understand the connected context, know what it does and does not know, actively obtain the most useful missing evidence, and then make a policy-aware, auditable next-best-action decision.**

The product therefore treats:

- **TigerGraph** as the connected investigation engine,
- **GraphRAG** as the evidence-grounding layer,
- **the agent** as the investigator and orchestrator,
- **the uncertainty engine** as the decision-state layer,
- **the evidence planner** as the active investigation capability,
- **the policy engine** as the control boundary,
- **case memory** as institutional intelligence,
- **the audit trail** as the trust layer.

---

# 42. Source Alignment

This PRD is grounded primarily in the official HHGOA problem statement supplied with the project.

The problem statement requires the agent to investigate from fraud signals or reports, gather evidence, identify fraud patterns, create/progress cases, use prior-case memory, request additional evidence, recommend actions, obey permissions/approval rules, stop when enough evidence exists, and explain decisions.

It also requires TigerGraph, GSQL/graph algorithms, TigerGraph MCP, GraphRAG and a user interface.

The HHGOA benchmark uses the supplied HHGOA_IEEE dataset, with approximately 590,000 transactions, approximately 13,500 customers, closed investigations from the first four months, a bank policy, five known fraud patterns, and 20 benchmark cases from the final two months.

The final implementation must follow the dataset README and exact benchmark instructions before the data model and benchmark logic are frozen.

