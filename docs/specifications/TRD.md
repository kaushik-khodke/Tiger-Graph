# TRD — Technical Requirements Document

## Agentic Fraud Investigation & Next-Best-Action Platform

**Hackathon:** TigerGraph Agentic Fraud Investigation HHGOA  
**Document Type:** Technical Requirements Document  
**Status:** Implementation Blueprint  
**Primary Technology:** TigerGraph  
**Primary Objective:** Build a graph-native, agentic fraud investigation system capable of moving from a suspicious signal to an evidence-grounded, policy-constrained next-best-action.

---

# 1. Technical Objective

The system shall implement an end-to-end fraud investigation loop:

```text
Trigger
  ↓
Case Creation
  ↓
Graph Investigation
  ↓
Evidence Collection
  ↓
Fraud Pattern Analysis
  ↓
Risk + Uncertainty Assessment
  ↓
Evidence Sufficiency Check
  ↓
 ┌──────────────────────────────┐
 │ Enough Evidence?             │
 └──────────────┬───────────────┘
                │
        ┌───────┴───────┐
       YES              NO
        │                │
        ↓                ↓
 Next-Best-Action   Evidence Planner
        │                │
        │                ↓
        │         Controlled Evidence
        │                │
        │                ↓
        │         New Evidence
        │                │
        └────────┬───────┘
                 ↓
          Reassessment
                 ↓
        Policy / Permission
                 ↓
       Approval / Execution
                 ↓
       Explanation + Audit
                 ↓
            Case Memory
```

The implementation must prioritize the investigation and decision loop rather than building a generic fraud-classification application.

---

# 2. System Requirements

## 2.1 Mandatory Components

The technical implementation shall include:

- TigerGraph Savanna or Community Edition.
- GSQL and TigerGraph graph algorithms.
- TigerGraph MCP.
- GraphRAG.
- A user interface demonstrating investigation and case progression.

The problem statement also permits an agent framework and LLM of the team's choice.

The LLM shall be used primarily for:

- reasoning,
- tool selection,
- evidence synthesis,
- explanation generation,

and shall not replace graph analysis.

---

# 3. Proposed Technical Stack

## 3.1 Backend

| Layer | Technology |
|---|---|
| API | FastAPI |
| Language | Python |
| Agent orchestration | LangGraph |
| Tool protocol | MCP |
| Graph database | TigerGraph |
| Graph query | GSQL |
| Graph analytics | TigerGraph graph algorithms |
| Retrieval | TigerGraph vector/search capabilities + GraphRAG |
| Structured validation | Pydantic |
| Async execution | Python asyncio |
| HTTP client | httpx |
| Mock integrations | FastAPI mock services |

LangGraph is the preferred orchestration layer because the workflow is stateful and contains conditional loops.

---

## 3.2 Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js / React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Graph visualization | Cytoscape.js / React Flow / equivalent |
| State | React state + server data layer |
| API communication | REST / JSON |
| Live agent activity | Server-Sent Events or WebSocket |

The frontend should focus on operational clarity rather than visual complexity.

---

## 3.3 Model Layer

The LLM must support:

- tool calling,
- structured output,
- low-latency reasoning,
- long-context evidence synthesis,
- reliable JSON generation.

Model selection shall be configurable through environment variables rather than hardcoded.

Example:

```env
LLM_PROVIDER=...
LLM_MODEL=...
LLM_API_KEY=...
```

The system architecture must remain model-agnostic.

---

# 4. High-Level Architecture

```text
                         ┌───────────────────────┐
                         │       Analyst UI       │
                         │ Dashboard / Case View  │
                         │ Graph / Evidence / NBA │
                         └───────────┬───────────┘
                                     │ HTTPS
                                     ▼
                         ┌───────────────────────┐
                         │       FastAPI          │
                         │   API / Auth / Cases   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │       Investigation Agent      │
                    │            LangGraph           │
                    │                                │
                    │ Planner                        │
                    │ Investigator                   │
                    │ Evidence Analyzer               │
                    │ Uncertainty Evaluator           │
                    │ Evidence Planner                │
                    │ NBA Decision Node               │
                    │ Policy / Permission Node        │
                    └──────────┬─────────────┬───────┘
                               │             │
                         MCP Tools       Retrieval Tools
                               │             │
                               ▼             ▼
                     ┌───────────────┐  ┌───────────────┐
                     │ TigerGraph MCP│  │   GraphRAG    │
                     └───────┬───────┘  └───────┬───────┘
                             │                  │
                             ▼                  ▼
                     ┌───────────────┐  ┌───────────────┐
                     │  TigerGraph   │  │ Policy / Case │
                     │  Graph Store  │  │  Retrieval    │
                     └───────┬───────┘  └───────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ Case + Audit  │
                     │ State / Memory│
                     └───────────────┘
```

---

# 5. Repository Structure

Recommended monorepo:

```text
hhgoa-fraud-agent/
│
├── apps/
│   ├── api/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── schemas/
│   │
│   └── web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
│
├── agent/
│   ├── graph.py
│   ├── state.py
│   ├── nodes/
│   │   ├── trigger.py
│   │   ├── investigate.py
│   │   ├── evidence.py
│   │   ├── uncertainty.py
│   │   ├── evidence_planner.py
│   │   ├── nba.py
│   │   ├── policy.py
│   │   ├── approval.py
│   │   ├── memory.py
│   │   └── explanation.py
│   ├── tools/
│   └── prompts/
│
├── tigergraph/
│   ├── schema/
│   ├── loading/
│   ├── gsql/
│   ├── algorithms/
│   └── seed/
│
├── graphrag/
│   ├── index/
│   ├── retrieval/
│   ├── ranking/
│   └── prompts/
│
├── policy/
│   ├── rules/
│   ├── evaluator.py
│   └── permissions.py
│
├── memory/
│   ├── case_store.py
│   ├── retrieval.py
│   └── embeddings.py
│
├── mocks/
│   ├── customer_validation/
│   ├── step_up_auth/
│   ├── analyst_input/
│   └── action_executor/
│
├── benchmark/
│   ├── cases/
│   ├── runner.py
│   ├── evaluators/
│   └── outputs/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── agent/
│   ├── graph/
│   └── benchmark/
│
├── scripts/
├── .env.example
├── docker-compose.yml
├── README.md
└── pyproject.toml
```

---

# 6. Data Architecture

The final schema must be derived from the actual HHGOA dataset README and source files before freezing the production graph model.

The following is the proposed conceptual schema.

## 6.1 Vertex Types

### Customer

```text
customer_id
profile_attributes
created_at
status
```

### Account

```text
account_id
account_type
customer_id
status
created_at
```

### Transaction

```text
transaction_id
timestamp
amount
currency
merchant_id
risk_score
transaction_attributes...
```

### Device

```text
device_id
device_attributes...
first_seen
last_seen
```

### Identity

```text
identity_id
identity_type
identity_value_hash
```

### Connection / IP

```text
connection_id
ip_hash
network_attributes...
```

### Merchant

```text
merchant_id
merchant_attributes...
```

### Case

```text
case_id
status
created_at
updated_at
trigger_type
risk_level
confidence
outcome
```

### Evidence

```text
evidence_id
case_id
evidence_type
source
strength
timestamp
description
provenance
```

### FraudPattern

```text
pattern_id
name
description
source
```

### Policy

```text
policy_id
section
rule
action_constraints
```

### Action

```text
action_id
case_id
action_type
status
approval_required
executed_at
```

### Approval

```text
approval_id
case_id
action_id
required_role
status
reviewer
timestamp
```

---

# 7. Graph Relationships

Initial relationship model:

```text
Customer ─OWNS──────────────→ Account

Customer ─MADE──────────────→ Transaction

Customer ─USES──────────────→ Device

Customer ─HAS_IDENTITY──────→ Identity

Device ─CONNECTED_THROUGH───→ Connection

Transaction ─MADE_BY────────→ Customer

Transaction ─USES_DEVICE────→ Device

Transaction ─AT_MERCHANT────→ Merchant

Case ─CONCERNS──────────────→ Transaction

Case ─INVOLVES──────────────→ Customer

Case ─HAS_EVIDENCE─────────→ Evidence

Case ─MATCHES───────────────→ FraudPattern

Case ─USES_POLICY───────────→ Policy

Case ─RESULTED_IN───────────→ Action

Action ─REQUIRES────────────→ Approval
```

For temporal analysis, timestamped edges or event vertices shall be retained where supported by the source data.

---

# 8. TigerGraph Design

## 8.1 Graph Objectives

TigerGraph must support:

- one-hop relationship retrieval,
- multi-hop investigation,
- transaction history,
- entity relationship discovery,
- shared-device detection,
- shared-connection detection,
- related-account discovery,
- prior-case discovery,
- time-window investigation,
- fraud-pattern matching.

---

## 8.2 GSQL Query Categories

The implementation should expose reusable queries such as:

### Q1 — Customer Profile Investigation

Input:

```text
customer_id
```

Output:

- accounts,
- devices,
- transactions,
- connections,
- merchants,
- linked customers,
- cases.

### Q2 — Transaction Context

Input:

```text
transaction_id
```

Output:

- customer,
- account,
- device,
- connection,
- merchant,
- temporal neighbors,
- risk context.

### Q3 — Shared Device Investigation

Input:

```text
device_id
```

Output:

- connected customers,
- transaction count,
- previous suspicious cases,
- time ranges.

### Q4 — Shared Connection Investigation

Input:

```text
connection_id
```

Output:

- associated customers,
- associated devices,
- transactions,
- historical cases.

### Q5 — Multi-Hop Investigation

Input:

```text
entity_id
depth
time_window
```

Output:

- reachable entities,
- relationship paths,
- suspicious connected cases.

### Q6 — Prior Case Linkage

Input:

```text
current_entity_set
```

Output:

- related previous cases,
- matching entities,
- outcomes,
- evidence.

### Q7 — Temporal Sequence

Input:

```text
entity_id
start_time
end_time
```

Output:

- ordered events,
- transaction sequence,
- device/connection changes,
- suspicious clusters.

---

# 9. Graph Algorithms

Use graph algorithms selectively for investigative evidence.

Candidate algorithms:

- community detection,
- connected components,
- shortest paths,
- similarity,
- centrality,
- neighborhood aggregation,
- k-hop exploration.

The exact algorithm set shall be finalized after inspecting the benchmark data and known fraud patterns.

Graph algorithms should produce interpretable evidence rather than opaque scores wherever possible.

Example:

```text
Finding:
Customer C123 and 4 other customers share Device D77
within the investigation period.

Evidence:
Shared-device relationship
4 connected customers
2 associated prior cases
```

---

# 10. TigerGraph MCP Integration

TigerGraph MCP will provide the agent controlled access to graph operations.

## Tool Categories

The agent should have logical tools for:

```text
inspect_entity
get_transaction_context
get_neighbors
run_investigation_query
find_prior_cases
run_temporal_query
run_pattern_query
retrieve_graph_context
```

The agent must not receive unrestricted database credentials through the LLM prompt.

The MCP layer should act as the tool boundary.

---

# 11. Agent State

The LangGraph state should be strongly typed.

Example conceptual state:

```python
class InvestigationState:
    case_id: str
    trigger: dict
    target_transaction_id: str | None
    entities: list
    evidence: list
    contradictions: list
    findings: list
    fraud_patterns: list
    risk_level: str
    confidence: float
    evidence_sufficiency: str
    missing_evidence: list
    requested_evidence: list
    received_evidence: list
    candidate_actions: list
    selected_action: dict | None
    policy_result: dict | None
    approval: dict | None
    prior_cases: list
    explanation: dict | None
    status: str
```

State transitions must be explicit.

---

# 12. Agent Workflow

## Node 1 — Trigger

Receives the investigation event.

Validates:

- trigger type,
- transaction/customer references,
- risk signal.

---

## Node 2 — Create/Open Case

Creates a case and writes the initial investigation state.

---

## Node 3 — Investigation Planner

The LLM determines which investigation tools are relevant.

Example:

```text
Risk signal
+
transaction
+
new device
```

Planner selects:

```text
transaction_context
→ customer_history
→ device_network
→ prior_cases
```

---

## Node 4 — Graph Investigation

Execute selected TigerGraph queries.

Store all meaningful results in structured evidence objects.

---

## Node 5 — Evidence Analyzer

Normalize and classify evidence:

```text
supporting
contradicting
neutral
contextual
```

Assign evidence strength.

Do not allow the LLM to fabricate evidence.

---

## Node 6 — Fraud Pattern Analyzer

Compare evidence with:

- documented fraud patterns,
- policy,
- historical cases,
- graph structures.

Return:

```text
matched_patterns
possible_patterns
undocumented_pattern_signal
```

---

## Node 7 — Uncertainty Evaluator

Determine:

```text
risk_level
confidence
evidence_sufficiency
contradictions
missing_information
```

---

## Node 8 — Conditional Router

Routing logic:

```text
if evidence_sufficiency == "SUFFICIENT":
    → NBA

elif evidence_sufficiency == "INSUFFICIENT":
    → Evidence Planner

elif risk/confidence require human review:
    → Escalation

else:
    → NBA
```

---

# 13. Evidence Planner Technical Design

The evidence planner is a key product capability.

## 13.1 Input

```text
Current Evidence
Current Risk
Current Confidence
Contradictions
Missing Evidence
Available Evidence Actions
Policy Constraints
```

## 13.2 Candidate Generation

Generate candidate evidence requests.

Example:

```text
customer_validation
step_up_auth
analyst_information
approved_external_source
```

## 13.3 Candidate Scoring

Each candidate can be evaluated on:

```text
decision relevance
uncertainty reduction potential
availability
policy compatibility
cost/latency
approval burden
```

Example conceptual score:

```text
Evidence Utility =
  Decision Impact
  × Uncertainty Reduction
  × Availability
  × Policy Validity
  − Cost
```

This formula is an implementation heuristic, not a claim that it is the benchmark's official scoring method.

## 13.4 Selection

Choose the highest-value permitted action.

Record:

```text
why requested
what uncertainty it targets
what decision it can change
```

---

# 14. Evidence Action APIs

All additional evidence actions may be simulated through mock APIs.

## Customer Validation

```http
POST /mock/customer/validate-transaction
```

Request:

```json
{
  "case_id": "CASE-001",
  "transaction_id": "TXN-123"
}
```

Response:

```json
{
  "recognized": false,
  "response_timestamp": "..."
}
```

---

## Step-Up Authentication

```http
POST /mock/auth/step-up
```

Response example:

```json
{
  "status": "failed",
  "verified": false
}
```

---

## Analyst Information

```http
POST /mock/analyst/request
```

The response should be deterministic for benchmark scenarios.

---

# 15. Policy Engine

The policy engine shall evaluate:

```text
action
case state
risk
fraud pattern
evidence
role
approval requirements
policy rule
```

Output:

```json
{
  "allowed": true,
  "approval_required": true,
  "required_role": "fraud_supervisor",
  "policy_reference": "POLICY-X.Y"
}
```

Policy logic must be deterministic and separate from free-form LLM generation.

The LLM can retrieve and interpret policy context, but the final policy/permission check should be enforced programmatically where practical.

---

# 16. Next-Best-Action Engine

The decision engine receives:

```text
Evidence
Risk
Confidence
Fraud Pattern
Policy
Permissions
Previous Case Context
Case Status
```

It generates candidate actions:

```text
ALLOW
MONITOR
WARN_CUSTOMER
BLOCK_TRANSACTION
BLOCK_ACCOUNT
REQUEST_EVIDENCE
ESCALATE
FILE_REPORT
```

Then:

```text
Candidate Actions
      ↓
Policy Filter
      ↓
Permission Filter
      ↓
Approval Check
      ↓
Decision Ranking
      ↓
Selected Recommendation
```

The final ranking must remain explainable.

---

# 17. Action Execution Model

Each action follows:

```text
Recommendation
     ↓
Policy Check
     ↓
Permission Check
     ↓
Approval Required?
   /           \
 NO             YES
 |               |
Execute        Approval
                  ↓
              Execute
```

Every execution must create an audit event.

---

# 18. GraphRAG Architecture

GraphRAG should not simply pass the complete graph to the LLM.

## Retrieval Process

```text
Case
 ↓
Relevant entities
 ↓
Relevant graph neighborhoods
 ↓
Relevant graph patterns
 ↓
Relevant previous cases
 ↓
Relevant policy sections
 ↓
Relevant regulatory references
 ↓
Compact Evidence Context
 ↓
LLM
```

The context package should contain:

```text
entity facts
relationship paths
event sequence
previous-case evidence
policy excerpts
evidence provenance
```

---

# 19. Case Memory Architecture

Case memory should combine:

## Structured Memory

Stored in TigerGraph.

Use for:

- entities,
- relationships,
- case states,
- outcomes,
- graph structures.

## Semantic Memory

Use vector retrieval for:

- investigation summaries,
- findings,
- analyst notes,
- case narratives,
- policy text where suitable.

## Retrieval Strategy

```text
New Case
   ↓
Entity/graph similarity
   +
Semantic similarity
   ↓
Historical Cases
   ↓
Filter by relevance + outcome
   ↓
Agent Context
```

Historical cases should be evidence/context, not an unquestioned decision source.

---

# 20. Evidence Data Contract

Every evidence item should contain:

```json
{
  "evidence_id": "E-001",
  "case_id": "CASE-001",
  "type": "shared_device",
  "source": "TigerGraph",
  "description": "...",
  "entities": ["C1", "D1", "C2"],
  "timestamps": [],
  "strength": 0.82,
  "direction": "supporting",
  "pattern_reference": "FP-03",
  "policy_reference": "POL-4.2",
  "provenance": {
    "tool": "get_neighbors",
    "query": "Q3",
    "retrieved_at": "..."
  }
}
```

---

# 21. Finding Data Contract

```json
{
  "finding_id": "F-001",
  "case_id": "CASE-001",
  "statement": "...",
  "confidence": 0.89,
  "evidence_ids": ["E-001", "E-004"],
  "pattern_ids": ["FP-03"],
  "policy_refs": ["POL-4.2"]
}
```

Every significant finding must reference evidence.

---

# 22. Recommendation Data Contract

```json
{
  "recommendation_id": "NBA-001",
  "case_id": "CASE-001",
  "action": "ESCALATE",
  "risk_level": "HIGH",
  "confidence": 0.91,
  "reason": "...",
  "evidence_ids": ["E-001", "E-004"],
  "policy_reference": "POL-4.2",
  "approval_required": true,
  "approval_role": "fraud_supervisor",
  "status": "RECOMMENDED"
}
```

---

# 23. Before/After Evidence State

The system must store separate decision snapshots.

## Initial

```json
{
  "stage": "BEFORE_ADDITIONAL_EVIDENCE",
  "risk": "HIGH",
  "confidence": 0.62,
  "recommended_action": "REQUEST_EVIDENCE",
  "evidence_request": "customer_validation"
}
```

## Updated

```json
{
  "stage": "AFTER_ADDITIONAL_EVIDENCE",
  "risk": "VERY_HIGH",
  "confidence": 0.91,
  "recommended_action": "ESCALATE",
  "new_evidence": ["E-008"]
}
```

This is required for the benchmark workflow.

---

# 24. Unknown Pattern Detection

Implementation should use a two-stage approach.

## Stage A — Known Pattern Matching

Rules / graph queries / policy mapping.

```text
Evidence
 ↓
Known pattern signatures
 ↓
Pattern match
```

## Stage B — Structural Anomaly Discovery

Potential techniques:

- unusual graph motifs,
- cluster anomalies,
- unexpected entity reuse,
- unusual temporal sequences,
- high-risk connected components.

Output:

```text
UNDOCUMENTED_PATTERN_SIGNAL
```

This must be surfaced as an investigative finding rather than automatically confirmed fraud.

---

# 25. Temporal Reasoning Requirements

All important event records must retain timestamps.

Queries must support:

```text
before
after
within N minutes/hours/days
between dates
ordered sequence
```

Examples:

```text
device registration
→ login
→ transaction
→ related transaction
```

The agent should be able to ask graph tools for relevant temporal sequences rather than relying only on LLM reasoning.

---

# 26. API Design

## Case APIs

```http
POST   /api/cases
GET    /api/cases
GET    /api/cases/{case_id}
PATCH  /api/cases/{case_id}
```

## Investigation APIs

```http
POST /api/investigations/start
POST /api/investigations/{case_id}/run
POST /api/investigations/{case_id}/evidence
POST /api/investigations/{case_id}/reassess
```

## Recommendation APIs

```http
GET  /api/cases/{case_id}/recommendation
POST /api/cases/{case_id}/recommendation/approve
POST /api/cases/{case_id}/action/execute
```

## Graph APIs

```http
GET /api/graph/entity/{entity_id}
GET /api/graph/case/{case_id}
GET /api/graph/neighbors/{entity_id}
```

## Memory APIs

```http
GET  /api/memory/similar/{case_id}
POST /api/memory/store/{case_id}
```

## Audit APIs

```http
GET /api/cases/{case_id}/audit
```

---

# 27. Real-Time Agent Activity

The UI should stream important agent events.

Recommended protocol:

```text
Server-Sent Events (SSE)
```

Example event:

```json
{
  "type": "tool_started",
  "case_id": "CASE-001",
  "tool": "find_prior_cases"
}
```

Other events:

```text
case_created
tool_started
tool_completed
evidence_found
pattern_detected
uncertainty_updated
evidence_requested
evidence_received
recommendation_updated
approval_required
action_executed
case_resolved
```

---

# 28. Frontend Screens

## Dashboard

Components:

```text
Active Cases
Pending Evidence
Pending Approvals
Escalations
Resolved Cases
Recent Agent Activity
```

## Case Workspace

```text
┌─────────────────────────────────────────┐
│ CASE HEADER                             │
│ Risk | Confidence | Status              │
├─────────────────┬───────────────────────┤
│                 │                       │
│ Graph Explorer  │ Evidence / Findings   │
│                 │                       │
├─────────────────┴───────────────────────┤
│ Investigation Timeline                  │
├─────────────────────────────────────────┤
│ Uncertainty + Missing Evidence          │
├─────────────────────────────────────────┤
│ Next-Best-Action + Approval              │
├─────────────────────────────────────────┤
│ Audit Trail                              │
└─────────────────────────────────────────┘
```

---

# 29. Authentication and Authorization

For the hackathon prototype:

- analyst login can be simplified,
- roles should still be represented,
- authorization must be enforced server-side.

Suggested roles:

```text
ANALYST
SENIOR_ANALYST
SUPERVISOR
ADMIN
AGENT
```

Example:

```text
AGENT:
recommend = YES
execute_restricted_action = NO

SUPERVISOR:
recommend = YES
approve_restricted_action = YES
```

---

# 30. Security Requirements

## Secrets

Store in environment variables:

```env
TIGERGRAPH_HOST=
TIGERGRAPH_USERNAME=
TIGERGRAPH_PASSWORD=
LLM_API_KEY=
```

Never commit secrets.

## Data Minimization

Expose only relevant graph context to the LLM.

## Prompt Injection Resistance

Retrieved case/policy data must be treated as data, not executable instructions.

## Tool Permission Boundaries

The LLM should have access only to explicitly exposed tools.

## Action Validation

Every action must be checked programmatically against authorization rules.

---

# 31. Observability

The backend should log:

- request IDs,
- case IDs,
- agent node,
- tool name,
- execution time,
- success/failure,
- graph query ID,
- recommendation ID.

Avoid logging unnecessary sensitive values.

Example:

```text
2026-09-23T12:20:31Z
case=CASE-001
node=evidence_planner
tool=customer_validation
latency_ms=418
status=success
```

---

# 32. Error Handling

## TigerGraph Failure

```text
Graph tool fails
 ↓
Retry bounded number of times
 ↓
Record failure
 ↓
Do not fabricate evidence
 ↓
Fallback or escalate
```

## LLM Failure

```text
LLM failure
 ↓
Retry
 ↓
Validate structured response
 ↓
Fallback to deterministic policy/rule path where available
```

## Mock API Failure

```text
Evidence action fails
 ↓
Record failed request
 ↓
Mark evidence unavailable
 ↓
Recalculate available options
```

---

# 33. Determinism Strategy

Agentic systems can vary from run to run.

For benchmark reliability:

- use low-temperature/configured deterministic generation where supported,
- force structured outputs,
- validate every tool call,
- use deterministic graph queries,
- make policy evaluation deterministic,
- use fixed benchmark mock responses,
- save intermediate state,
- rerun failed benchmark cases from checkpointed state.

---

# 34. Prompt Architecture

Prompts shall be modular.

## System Prompt

Defines:

- role,
- tool rules,
- evidence rules,
- policy rules,
- output schema.

## Investigation Prompt

Contains:

- case context,
- current evidence,
- graph context,
- historical cases.

## Evidence Planner Prompt

Contains:

- uncertainty,
- contradictions,
- available evidence actions,
- policy constraints.

## NBA Prompt

Contains:

- verified evidence,
- risk/confidence,
- policy result,
- permissions,
- historical context.

The LLM must never receive hidden or unsupported assumptions as facts.

---

# 35. Structured Output Validation

All LLM outputs that drive downstream logic must use schemas.

Examples:

```text
InvestigationPlan
EvidenceAssessment
EvidenceRequest
RiskAssessment
ActionRecommendation
Explanation
```

Each output must be validated with Pydantic before being accepted.

Invalid output:

```text
→ retry / repair
→ never execute directly
```

---

# 36. Testing Strategy

## Unit Tests

Test:

- policy rules,
- permission checks,
- evidence scoring,
- state transitions,
- case serialization,
- schema validation.

## Graph Tests

Test:

- known relationships,
- multi-hop results,
- temporal queries,
- prior-case retrieval,
- expected graph patterns.

## Agent Tests

Test:

- correct tool selection,
- evidence sufficiency routing,
- evidence planner selection,
- NBA generation,
- policy rejection.

## Integration Tests

Test:

```text
UI
 ↓
API
 ↓
Agent
 ↓
MCP
 ↓
TigerGraph
 ↓
Case State
```

## Benchmark Tests

Run the complete 20-case benchmark end to end.

---

# 37. Benchmark Runner

Implement:

```bash
python benchmark/runner.py
```

Flow:

```text
Load benchmark case
      ↓
Initialize case state
      ↓
Run investigation
      ↓
Save initial NBA
      ↓
Execute/request additional evidence
      ↓
Inject benchmark evidence
      ↓
Reassess
      ↓
Save final NBA
      ↓
Write case to graph
      ↓
Generate required output file
```

Output structure:

```text
benchmark/outputs/
├── CASE-001/
│   ├── case.json
│   ├── investigation.json
│   ├── evidence.json
│   ├── decision_before.json
│   ├── decision_after.json
│   ├── sar.json
│   └── summary.md
├── CASE-002/
└── ...
```

---

# 38. Benchmark Output Requirements

For each benchmark case the system shall produce:

- internal investigation record,
- evidence,
- findings,
- decisions,
- actions,
- graph case representation,
- SAR where required,
- next-best-action before additional evidence,
- next-best-action after additional evidence,
- approval route.

These outputs must remain linked by `case_id`.

---

# 39. Data Ingestion Pipeline

```text
Raw HHGOA Dataset
      ↓
Schema Validation
      ↓
Cleaning / Normalization
      ↓
Entity ID Mapping
      ↓
Relationship Generation
      ↓
Temporal Validation
      ↓
TigerGraph Loading
      ↓
Graph Integrity Checks
```

Data ingestion must preserve the benchmark's source semantics.

The final mapping must be derived from the README and actual dataset files.

---

# 40. Data Quality Checks

Before graph loading:

- missing critical IDs,
- duplicate IDs,
- invalid timestamps,
- invalid numeric fields,
- orphan relationships,
- inconsistent references,
- null handling,
- duplicate entities,
- invalid case references.

After graph loading:

- vertex counts,
- edge counts,
- relationship integrity,
- benchmark case visibility,
- sampled transaction reconciliation.

---

# 41. Performance Targets

These are engineering targets for the prototype, not official HHGOA benchmark requirements.

## Interactive Investigation

Target:

```text
First meaningful evidence:
< 3 seconds

Typical graph query:
< 1 second

Typical full investigation:
< 15 seconds where external/mock evidence is not waiting on human input
```

## UI

Target:

```text
Initial page render:
< 2.5 seconds
```

## Benchmark

The full 20-case benchmark should be executable unattended.

---

# 42. Availability and Recovery

For hackathon deployment:

- TigerGraph connection health check,
- API health endpoint,
- agent health endpoint,
- graceful tool failures,
- persisted case state,
- restart-safe benchmark state.

Endpoints:

```http
GET /health
GET /health/tigergraph
GET /health/agent
```

---

# 43. Environment Configuration

Example:

```env
APP_ENV=development

API_HOST=0.0.0.0
API_PORT=8000

TIGERGRAPH_HOST=
TIGERGRAPH_USERNAME=
TIGERGRAPH_PASSWORD=
TIGERGRAPH_GRAPH=

LLM_PROVIDER=
LLM_MODEL=
LLM_API_KEY=

MCP_SERVER_URL=

CASE_MEMORY_ENABLED=true
GRAPHRAG_ENABLED=true
AUDIT_LOG_ENABLED=true
```

---

# 44. Deployment

Recommended prototype deployment:

```text
Frontend
   ↓
Next.js
   ↓
FastAPI
   ↓
Agent Worker
   ↓
TigerGraph / MCP
```

Containerize application components where practical:

```text
web
api
worker
mock-services
```

TigerGraph may remain separately hosted through Savanna or Community Edition.

---

# 45. CI/CD

Minimum pipeline:

```text
Push
 ↓
Lint
 ↓
Type Check
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Build
 ↓
Deploy
```

Recommended checks:

```text
ruff
pytest
mypy
npm lint
npm typecheck
```

---

# 46. Observability Dashboard

For development, capture:

```text
Cases processed
Cases resolved
Graph queries
Average graph latency
Agent tool calls
Evidence requests
NBA changes
Policy blocks
Human approvals
LLM failures
Benchmark case success/failure
```

This helps identify whether failures originate from:

- data,
- graph query,
- agent reasoning,
- policy logic,
- evidence simulation,
- frontend/backend integration.

---

# 47. Technical Decision Principles

## TD-01 — Graph Analysis Is Deterministic Where Possible

Fraud relationships should be computed through TigerGraph queries/algorithms.

## TD-02 — LLM Controls Reasoning, Not Truth

The LLM can select tools and synthesize verified evidence.

## TD-03 — Policy Is Executable Logic

Policy constraints should not exist only in prompts.

## TD-04 — Case State Is Persisted

Do not depend on conversation history as the case database.

## TD-05 — Every Evidence Item Has Provenance

No untraceable evidence.

## TD-06 — Every Action Has Authorization State

```text
allowed
approval_required
approved
executed
```

must be distinguishable.

---

# 48. Recommended Agent State Machine

```text
                 ┌──────────────┐
                 │   TRIGGER    │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ CREATE CASE  │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ INVESTIGATE  │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │   ANALYZE    │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ UNCERTAINTY  │
                 └──────┬───────┘
                        ↓
              ┌────────────────────┐
              │ Evidence sufficient?│
              └───────┬────────────┘
                  YES │ NO
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
   ┌──────────────┐       ┌──────────────┐
   │ NBA ENGINE   │       │ EVIDENCE     │
   │              │       │ PLANNER      │
   └──────┬───────┘       └──────┬───────┘
          │                      ↓
          │               ┌──────────────┐
          │               │ GET EVIDENCE │
          │               └──────┬───────┘
          │                      ↓
          │               ┌──────────────┐
          │               │ REASSESS     │
          │               └──────┬───────┘
          └──────────────────────┘
                        ↓
                 ┌──────────────┐
                 │ POLICY CHECK │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ PERMISSIONS  │
                 └──────┬───────┘
                        ↓
                ┌─────────────────┐
                │ Approval needed?│
                └──────┬──────────┘
                    NO │ YES
                       │
              ┌────────┴────────┐
              ↓                 ↓
          EXECUTE            APPROVAL
              │                 │
              └────────┬────────┘
                       ↓
                 ┌──────────────┐
                 │  EXPLAIN     │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ CASE MEMORY  │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │   RESOLVED   │
                 └──────────────┘
```

---

# 49. MVP Technical Priorities

Implementation priority shall be:

### P0 — Must Work

1. Dataset ingestion.
2. TigerGraph graph.
3. GSQL investigation queries.
4. Agent tool calling.
5. Evidence model.
6. Uncertainty assessment.
7. Evidence planner.
8. Next-best-action.
9. Policy/permission checks.
10. Before/after evidence loop.
11. Case persistence.
12. Benchmark runner.

### P1 — High Value

1. GraphRAG.
2. Previous-case retrieval.
3. Temporal graph analysis.
4. Provenance UI.
5. Approval workflow.
6. Audit timeline.

### P2 — Enhancement

1. Unknown pattern discovery.
2. Advanced graph algorithms.
3. More sophisticated evidence utility scoring.
4. Real-time transaction simulation.
5. Advanced analyst feedback learning.

The team should not sacrifice P0 benchmark reliability for P2 visual or research features.

---

# 50. Definition of Technical Completion

The system is technically complete when all of the following are true:

- [ ] HHGOA data is correctly represented in TigerGraph.
- [ ] Required graph relationships can be queried.
- [ ] GSQL investigations return validated results.
- [ ] TigerGraph MCP tools are accessible to the agent.
- [ ] Agent state survives each investigation stage.
- [ ] Evidence is structured and traceable.
- [ ] Risk and uncertainty are explicitly represented.
- [ ] Evidence requests are policy constrained.
- [ ] Additional evidence can be simulated and ingested.
- [ ] The case is reassessed after new evidence.
- [ ] NBA is generated before additional evidence.
- [ ] NBA is updated after additional evidence.
- [ ] Action permissions are enforced.
- [ ] Approval workflow is represented.
- [ ] Case is stored in TigerGraph.
- [ ] Prior cases can be retrieved.
- [ ] Audit trail is complete.
- [ ] UI shows the complete workflow.
- [ ] All 20 benchmark cases can be processed.
- [ ] Required output files can be generated automatically.

---

# 51. Technical Risks

## R1 — LLM Hallucination

**Risk:** unsupported conclusions.

**Mitigation:**

- evidence-only findings,
- structured output,
- provenance,
- deterministic graph queries,
- validation.

---

## R2 — Excessive Tool Calls

**Risk:** slow and noisy investigations.

**Mitigation:**

- planner,
- reusable graph queries,
- bounded tool calls,
- query caching.

---

## R3 — Incorrect Graph Modeling

**Risk:** missed or false relationships.

**Mitigation:**

- derive schema from actual README/data,
- validate edge generation,
- compare graph samples with source rows.

---

## R4 — Poor Evidence Selection

**Risk:** agent requests evidence that does not affect the decision.

**Mitigation:**

- explicit uncertainty state,
- evidence utility scoring,
- benchmark-driven evaluation.

---

## R5 — Policy Hallucination

**Risk:** LLM invents or misinterprets permissions.

**Mitigation:**

- deterministic policy engine,
- policy references,
- server-side authorization.

---

## R6 — Benchmark Overfitting

**Risk:** rules optimized only for the known cases.

**Mitigation:**

- use first-four-month investigations for general memory,
- separate benchmark-specific test fixtures,
- preserve unknown-pattern discovery.

---

## R7 — Demo Instability

**Risk:** live demo failures.

**Mitigation:**

- deterministic mock APIs,
- prevalidated benchmark cases,
- health checks,
- fallback states,
- recorded backup demo.

---

# 52. Final Technical Architecture Principle

The most important implementation boundary is:

```text
                     LLM
          Reasoning / Planning / Synthesis
                       │
                       ▼
                 Controlled Tools
                       │
          ┌────────────┼─────────────┐
          ▼            ▼             ▼
      TigerGraph    GraphRAG     Policy Engine
          │            │             │
          └────────────┼─────────────┘
                       ▼
                 Verified Context
                       │
                       ▼
                   Decision
                       │
                       ▼
                Case + Audit Log
```

The system must not become:

```text
Dataset → LLM → Fraud Answer
```

It must remain:

```text
Risk Signal
    ↓
Graph Investigation
    ↓
Evidence
    ↓
Uncertainty
    ↓
Evidence Acquisition
    ↓
Reassessment
    ↓
Policy-Constrained NBA
    ↓
Approval / Action
    ↓
Explanation
    ↓
Case Memory
```

---

# 53. Implementation Order

The team should build in this exact sequence:

```text
1. Read dataset README
        ↓
2. Profile dataset
        ↓
3. Design graph schema
        ↓
4. Load TigerGraph
        ↓
5. Build GSQL investigation queries
        ↓
6. Test graph evidence manually
        ↓
7. Add TigerGraph MCP
        ↓
8. Build case state
        ↓
9. Build investigation agent
        ↓
10. Add uncertainty engine
        ↓
11. Add evidence planner
        ↓
12. Add policy engine
        ↓
13. Add NBA engine
        ↓
14. Add case memory
        ↓
15. Add GraphRAG
        ↓
16. Add UI
        ↓
17. Run 20 benchmark cases
        ↓
18. Tune failures
        ↓
19. Generate submission files
        ↓
20. Record demo
```

The dataset and README must be treated as the authoritative source for exact fields, case semantics, benchmark behavior, fraud patterns and policy rules. The graph schema and query implementation should not be frozen until those materials have been fully inspected.

