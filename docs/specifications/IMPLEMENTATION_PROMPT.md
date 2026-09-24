# ANTIGRAVITY IMPLEMENTATION PROMPT
# Full Backend + Real Frontend Integration
## Sentinel AI — Agentic Fraud Investigation & Next-Best-Action Platform

You are the primary implementation engineer for this project.

Your job is to take the **existing frontend prototype**, analyze the supplied project documents, remove all static/mock/predefined data and behavior from the frontend, build the real backend, connect the frontend to the backend, and make the complete end-to-end HHGOA fraud investigation workflow functional.

This is not a request to create another UI prototype.

This is a request to transform the existing frontend prototype into a **real full-stack application**.

---

# 0. MOST IMPORTANT INSTRUCTION

Before changing code:

1. Inspect the entire existing repository.
2. Identify the current frontend framework, routing, components, state management, mock data, hardcoded values, static graphs, fake timelines, fake case states, fake approvals, mock evidence responses, and demo-only logic.
3. Read the supplied:
   - Problem Statement
   - PRD
   - TRD
   - APP FLOW
   - UI/UX BRIEF
4. Treat those documents as the product and technical specification.
5. Compare the existing implementation against those documents.
6. Produce a short internal implementation plan before making major changes.
7. Then implement the backend and integration.
8. Preserve the existing visual design wherever it is correct.
9. Remove static/demo behavior from the frontend.
10. Replace it with real API-driven data and real application state.

Do NOT blindly rewrite the entire frontend.

First understand what already exists.

---

# 1. SOURCE OF TRUTH

The supplied HHGOA problem statement is authoritative for hackathon requirements.

The project must support the complete investigation lifecycle:

```text
Trigger
→ Investigate
→ Gather Evidence
→ Assess Risk + Uncertainty
→ Decide Whether More Evidence Is Needed
→ Gather Additional Evidence if Required
→ Reassess
→ Recommend / Execute Next Action
→ Policy + Permission Check
→ Approval if Required
→ Explain Decision
→ Update Case Memory
```

The hackathon requires TigerGraph, GSQL/graph algorithms, TigerGraph MCP, GraphRAG, and a user interface.

The LLM is intended for reasoning, tool selection, evidence synthesis, and explanations rather than replacing graph analysis.

The benchmark requires the investigation record, evidence, findings, decisions/actions, graph case representation, SAR where required, approval route, and next-best-action both before additional evidence and after additional evidence.

The dataset includes transaction risk scores rather than a universal fraud label, historical closed investigations, a bank fraud policy, five known fraud patterns, regulatory references, and 20 benchmark cases.

The exact dataset schema and semantics must be taken from the actual README/data files available in the project.

---

# 2. EXISTING FRONTEND: CONVERT, DON'T JUST REPLACE

The current frontend was intentionally designed as a frontend-only prototype.

It contains or may contain:

- mock cases,
- mock customers,
- mock transactions,
- mock graph data,
- fake evidence,
- fake findings,
- fake risk/confidence values,
- predefined NBA values,
- fake evidence requests,
- simulated customer responses,
- simulated approvals,
- fake audit events,
- static timeline events,
- static memory cases,
- benchmark placeholder values.

These must no longer be the source of truth.

Replace:

```text
hardcoded UI state
+
mock arrays
+
fake local business logic
```

with:

```text
Frontend
    ↓
API Client / Service Layer
    ↓
FastAPI Backend
    ↓
LangGraph Agent / Services
    ↓
TigerGraph MCP
    ↓
TigerGraph
```

and:

```text
Frontend
    ↓
Case / Evidence / Approval APIs
    ↓
Persistent backend state
```

The UI should remain visually similar to the supplied UI/UX brief unless a change is required for functionality.

---

# 3. FINAL SYSTEM ARCHITECTURE

Implement the following architecture:

```text
                        ┌─────────────────────────┐
                        │       Next.js UI        │
                        │                         │
                        │ Dashboard               │
                        │ Investigation Workspace │
                        │ Graph Explorer          │
                        │ Evidence                 │
                        │ NBA                      │
                        │ Approvals                │
                        │ Memory                   │
                        │ Audit                    │
                        │ Benchmark                │
                        └────────────┬────────────┘
                                     │ HTTPS / JSON
                                     ▼
                        ┌─────────────────────────┐
                        │       FastAPI            │
                        │                         │
                        │ REST API                │
                        │ Validation              │
                        │ Case APIs               │
                        │ Investigation APIs      │
                        │ Approval APIs            │
                        │ Memory APIs              │
                        │ Benchmark APIs           │
                        │ SSE / WebSocket events   │
                        └────────────┬────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │       LangGraph          │
                        │ Investigation Agent     │
                        │                         │
                        │ Planner                 │
                        │ Investigator             │
                        │ Evidence Analyzer       │
                        │ Pattern Analyzer        │
                        │ Uncertainty Evaluator   │
                        │ Evidence Planner        │
                        │ NBA Engine              │
                        │ Policy Engine           │
                        │ Memory                  │
                        │ Explanation             │
                        └───────┬─────────┬────────┘
                                │         │
                    MCP         │         │ GraphRAG
                                │         │
                                ▼         ▼
                     ┌──────────────┐  ┌──────────────┐
                     │ TigerGraph   │  │ Retrieval    │
                     │ MCP Server   │  │ / GraphRAG   │
                     └──────┬───────┘  └──────┬───────┘
                            │                 │
                            ▼                 ▼
                     ┌────────────────────────────┐
                     │         TigerGraph         │
                     │                            │
                     │ Entities                   │
                     │ Transactions               │
                     │ Relationships              │
                     │ Cases                      │
                     │ Evidence                   │
                     │ Policies                   │
                     │ Memory                     │
                     └────────────────────────────┘
```

If the actual installed/current TigerGraph MCP implementation has a different operational interface, adapt to the official/current implementation rather than inventing unsupported endpoints.

---

# 4. NON-NEGOTIABLE ENGINEERING PRINCIPLES

## 4.1 No Frontend Fake Truth

The frontend must never decide:

```text
risk = 87
confidence = 62
nba = escalate
```

Those values must come from the backend.

The frontend only renders backend state.

## 4.2 No LLM-Only Fraud Detection

Do not implement:

```text
transaction → prompt → LLM → fraud
```

Graph investigation and deterministic data processing must establish factual evidence.

The LLM can:

- plan investigations,
- select tools,
- synthesize evidence,
- assess uncertainty using supplied evidence,
- formulate explanations,
- assist with decision reasoning.

## 4.3 Policy Must Not Live Only in a Prompt

Policy constraints must have a backend enforcement layer.

The LLM may interpret retrieved policy context.

But action authorization should be checked programmatically.

## 4.4 No Fabricated Evidence

An evidence record may only be created from:

- actual dataset data,
- TigerGraph query results,
- approved retrieval,
- simulated/mock evidence APIs explicitly invoked by the system,
- persisted case data.

The agent must never invent evidence because a prompt asked it to.

## 4.5 Recommendation ≠ Execution

The backend must distinguish:

```text
RECOMMENDED
PENDING_APPROVAL
APPROVED
EXECUTED
REJECTED
FAILED
```

## 4.6 Risk ≠ Confidence

Keep separate:

```text
Risk Score / Risk Level
Confidence
Evidence Sufficiency
```

A high-risk case can still have insufficient evidence.

## 4.7 Expose Operational Trace, Not Hidden Chain-of-Thought

The UI can show:

```text
Searching customer history
Running graph relationship analysis
Checking prior cases
Evaluating evidence sufficiency
Requesting customer validation
Reassessing case
Running policy check
```

Do not expose private chain-of-thought.

---

# 5. BEFORE CODING — REPOSITORY AUDIT

First inspect:

```text
package.json
lockfile
src/
app/
components/
lib/
services/
hooks/
types/
mock/
data/
styles/
.env*
README*
```

Then determine:

- framework,
- router,
- component library,
- graph library,
- state management,
- API abstraction,
- existing environment variables,
- current mock data architecture,
- current frontend pages,
- current interactions.

Create a document in the repository:

```text
IMPLEMENTATION_AUDIT.md
```

containing:

```text
Existing architecture
Existing pages
Existing mock/static sources
Backend integration gaps
Recommended migration plan
Potential breaking changes
```

Do not stop after creating the audit. Proceed with implementation.

---

# 6. REMOVE STATIC FRONTEND DATA

Search the frontend for:

```text
mockCases
mockTransactions
mockCustomers
mockEvidence
mockFindings
mockPatterns
mockPolicies
mockApprovals
mockAuditEvents
mockMemoryCases
mockBenchmarkCases
```

Also search for:

```text
hardcoded case IDs
hardcoded risk values
hardcoded confidence values
hardcoded graph nodes
hardcoded graph edges
hardcoded timeline events
hardcoded status transitions
hardcoded approval results
hardcoded evidence responses
hardcoded benchmark counters
setTimeout demo logic
fake loading timers
```

Replace each with API-driven state.

A temporary development fallback may exist only if explicitly gated:

```text
NEXT_PUBLIC_DEMO_MODE=false
```

The default must be:

```text
DEMO_MODE=false
```

Do not silently fall back to fake data when an API fails.

---

# 7. BACKEND PROJECT STRUCTURE

Create a clean backend.

Recommended:

```text
backend/
│
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── routes/
│   │   │   ├── cases.py
│   │   │   ├── investigations.py
│   │   │   ├── evidence.py
│   │   │   ├── recommendations.py
│   │   │   ├── approvals.py
│   │   │   ├── graph.py
│   │   │   ├── memory.py
│   │   │   ├── audit.py
│   │   │   └── benchmark.py
│   │   └── dependencies.py
│   │
│   ├── schemas/
│   │   ├── case.py
│   │   ├── evidence.py
│   │   ├── finding.py
│   │   ├── graph.py
│   │   ├── recommendation.py
│   │   ├── approval.py
│   │   ├── memory.py
│   │   └── benchmark.py
│   │
│   ├── services/
│   │   ├── case_service.py
│   │   ├── investigation_service.py
│   │   ├── evidence_service.py
│   │   ├── recommendation_service.py
│   │   ├── approval_service.py
│   │   ├── memory_service.py
│   │   ├── audit_service.py
│   │   └── benchmark_service.py
│   │
│   ├── agent/
│   │   ├── graph.py
│   │   ├── state.py
│   │   ├── nodes/
│   │   │   ├── trigger.py
│   │   │   ├── investigate.py
│   │   │   ├── evidence.py
│   │   │   ├── pattern.py
│   │   │   ├── uncertainty.py
│   │   │   ├── evidence_planner.py
│   │   │   ├── nba.py
│   │   │   ├── policy.py
│   │   │   ├── approval.py
│   │   │   ├── memory.py
│   │   │   └── explanation.py
│   │   ├── tools/
│   │   └── prompts/
│   │
│   ├── tigergraph/
│   │   ├── client.py
│   │   ├── mcp.py
│   │   ├── queries.py
│   │   └── mapper.py
│   │
│   ├── graphrag/
│   │   ├── retriever.py
│   │   ├── ranker.py
│   │   └── context_builder.py
│   │
│   ├── policy/
│   │   ├── evaluator.py
│   │   ├── permissions.py
│   │   └── models.py
│   │
│   ├── memory/
│   │   ├── retrieval.py
│   │   ├── storage.py
│   │   └── embeddings.py
│   │
│   ├── infrastructure/
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── health.py
│   │
│   └── tests/
│
├── scripts/
├── .env.example
├── pyproject.toml
└── README.md
```

Adapt this to the existing repository rather than creating unnecessary duplication.

---

# 8. FASTAPI API DESIGN

Implement typed REST endpoints.

## Cases

```http
GET    /api/cases
POST   /api/cases
GET    /api/cases/{case_id}
PATCH  /api/cases/{case_id}
```

## Investigations

```http
POST /api/investigations/start
POST /api/investigations/{case_id}/run
GET  /api/investigations/{case_id}
POST /api/investigations/{case_id}/reassess
```

## Evidence

```http
GET  /api/cases/{case_id}/evidence
POST /api/cases/{case_id}/evidence
POST /api/cases/{case_id}/evidence/request
GET  /api/cases/{case_id}/evidence/{evidence_id}
```

## Graph

```http
GET /api/graph/entity/{entity_id}
GET /api/graph/case/{case_id}
GET /api/graph/neighbors/{entity_id}
POST /api/graph/investigate
POST /api/graph/temporal
POST /api/graph/pattern
```

Do not expose arbitrary unrestricted GSQL execution through the public UI.

## Recommendations

```http
GET  /api/cases/{case_id}/recommendation
POST /api/cases/{case_id}/recommendation/generate
```

## Approvals

```http
GET  /api/approvals
GET  /api/approvals/{approval_id}
POST /api/approvals/{approval_id}/approve
POST /api/approvals/{approval_id}/reject
POST /api/approvals/{approval_id}/request-information
```

## Memory

```http
GET  /api/memory/similar/{case_id}
POST /api/memory/store/{case_id}
```

## Audit

```http
GET /api/cases/{case_id}/audit
GET /api/audit
```

## Benchmark

```http
GET  /api/benchmark/cases
POST /api/benchmark/run/{case_id}
POST /api/benchmark/run-all
GET  /api/benchmark/status
GET  /api/benchmark/output/{case_id}
```

## Health

```http
GET /health
GET /health/tigergraph
GET /health/mcp
GET /health/agent
```

---

# 9. FRONTEND API SERVICE LAYER

Create a clean client abstraction:

```text
frontend
  ↓
services/api/
```

Suggested:

```text
caseApi.ts
investigationApi.ts
evidenceApi.ts
graphApi.ts
recommendationApi.ts
approvalApi.ts
memoryApi.ts
auditApi.ts
benchmarkApi.ts
```

Do NOT put raw `fetch()` calls in every component.

Centralize:

- base URL,
- headers,
- error handling,
- request IDs,
- response parsing,
- auth token handling later.

Example:

```ts
getCase(caseId)
getCaseEvidence(caseId)
getCaseGraph(caseId)
startInvestigation(caseId)
requestEvidence(caseId, payload)
getRecommendation(caseId)
submitApproval(approvalId)
```

---

# 10. CORS AND ENVIRONMENT

Configure backend:

```env
APP_ENV=development
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_ORIGIN=http://localhost:3000
```

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEMO_MODE=false
```

Never hardcode localhost URLs in components.

---

# 11. TIGERGRAPH INTEGRATION

TigerGraph is a core system, not an optional mock.

Use the official/current TigerGraph integration method available in the environment.

The project requires:

- TigerGraph graph storage,
- GSQL,
- graph algorithms,
- TigerGraph MCP,
- graph traversal,
- pattern analysis,
- relationship analysis.

First inspect the actual TigerGraph environment and MCP interface available to the repository.

Do not invent API behavior.

---

# 12. TIGERGRAPH DATA MODEL

Before implementing final graph queries:

1. Inspect the HHGOA dataset README.
2. Inspect every available dataset file.
3. Map fields to graph entities.
4. Validate relationships.
5. Define vertex/edge schema.
6. Identify timestamp fields.
7. Identify case/investigation references.
8. Identify device/identity/connection fields.
9. Identify policy/pattern references.

Proposed conceptual entities:

```text
Customer
Account
Transaction
Device
Identity
Connection
Merchant
Case
Evidence
FraudPattern
Policy
Action
Approval
```

Final schema must follow the actual dataset.

---

# 13. TIGERGRAPH INVESTIGATION QUERIES

Implement reusable graph operations.

Minimum:

```text
get_transaction_context
get_customer_context
get_account_context
get_device_connections
get_connection_context
get_related_customers
get_related_transactions
get_prior_cases
get_multi_hop_context
get_temporal_sequence
get_pattern_context
```

Every query must return structured output.

Example:

```json
{
  "query_name": "get_prior_cases",
  "target": "C123",
  "results": [
    {
      "case_id": "CASE-103",
      "relationship_path": [
        "Customer:C123",
        "Device:D77",
        "Customer:C811",
        "Case:CASE-103"
      ],
      "outcome": "..."
    }
  ]
}
```

---

# 14. TIGERGRAPH MCP

Expose only controlled investigation tools.

The agent should be able to call logical capabilities such as:

```text
inspect_entity
get_neighbors
get_transaction_context
get_customer_history
find_prior_cases
run_temporal_investigation
run_pattern_investigation
get_graph_context
```

If the installed/current MCP exposes different names, map them through the project's tool adapter.

The LLM should never receive unrestricted database access.

---

# 15. LANGGRAPH INVESTIGATION ENGINE

Implement a real stateful LangGraph workflow.

Suggested graph:

```text
START
  ↓
TRIGGER
  ↓
CREATE / OPEN CASE
  ↓
INVESTIGATION PLANNER
  ↓
GRAPH INVESTIGATION
  ↓
EVIDENCE ANALYSIS
  ↓
FRAUD PATTERN ANALYSIS
  ↓
UNCERTAINTY
  ↓
ROUTER
```

Router:

```text
SUFFICIENT
    ↓
NBA

INSUFFICIENT
    ↓
EVIDENCE PLANNER
    ↓
EVIDENCE ACTION
    ↓
NEW EVIDENCE
    ↓
REASSESSMENT
    ↓
UNCERTAINTY

ESCALATION REQUIRED
    ↓
POLICY / APPROVAL
```

---

# 16. LANGGRAPH STATE

Implement a validated state model.

Minimum fields:

```text
case_id
trigger
target_transaction
entities
graph_context
evidence
contradictions
findings
fraud_patterns
risk_level
risk_score
confidence
evidence_sufficiency
missing_evidence
evidence_requests
received_evidence
prior_cases
candidate_actions
recommendation
policy_result
approval
actions
timeline
explanation
status
```

The state must be serializable.

Do not keep critical case state only in process memory.

---

# 17. AGENT TOOL-CALL FLOW

The agent should decide which tools to call based on the trigger and evidence.

Example:

```text
Trigger:
High-risk transaction

Agent plan:
1. Get transaction context
2. Get customer history
3. Inspect device
4. Inspect connections
5. Find prior cases
6. Run temporal investigation
7. Assess evidence
```

Store tool results in the case evidence record.

---

# 18. EVIDENCE ENGINE

Implement a backend evidence model.

Each evidence item must have:

```text
evidence_id
case_id
type
description
source
strength
direction
entities
timestamps
pattern_reference
policy_reference
provenance
created_at
```

Direction:

```text
SUPPORTING
CONTRADICTING
NEUTRAL
CONTEXTUAL
```

Evidence must reference real source records.

---

# 19. PROVENANCE

Every important finding should be traceable.

Example:

```text
Finding
  ↓
Evidence
  ↓
Graph Entity / Transaction
  ↓
Graph Relationship
  ↓
Query / Tool
  ↓
Source
```

Persist:

```text
tool
query_name
query_parameters_hash / safe metadata
source
retrieved_at
related_entity_ids
```

Do not expose sensitive credentials.

---

# 20. RISK + CONFIDENCE

The backend should provide:

```text
risk_score
risk_level
confidence
evidence_sufficiency
```

Do not silently invent a mathematical fraud probability.

If confidence is heuristic/model-derived, clearly label it.

Example:

```json
{
  "risk_level": "HIGH",
  "risk_score": 87,
  "confidence": 0.62,
  "evidence_sufficiency": "INSUFFICIENT"
}
```

The source of these values should be traceable.

---

# 21. UNCERTAINTY ENGINE

The uncertainty engine must evaluate:

```text
Available evidence
Contradicting evidence
Known fraud patterns
Historical context
Policy requirements
Missing information
Risk
Confidence
```

Output:

```text
risk
confidence
sufficiency
uncertainty_reasons
missing_evidence
recommended_next_evidence
```

Important:

```text
High Risk
≠
Sufficient Evidence
```

---

# 22. INTELLIGENT EVIDENCE PLANNER

Implement this as a first-class agent capability.

Input:

```text
current evidence
current confidence
contradictions
missing information
available evidence actions
policy constraints
```

Possible actions:

```text
customer transaction validation
step-up authentication
request analyst information
approved additional retrieval
human escalation
```

The planner should choose evidence that is relevant to the unresolved uncertainty.

Record:

```text
reason
uncertainty target
expected decision impact
policy status
approval requirement
```

---

# 23. EVIDENCE ACTION EXECUTION

Implement backend services for controlled evidence acquisition.

Examples:

```http
POST /api/cases/{case_id}/evidence/request
```

Supported mock/simulated actions are allowed by the hackathon.

But the simulation must exist in the backend, not only in React state.

Example architecture:

```text
Frontend
 ↓
POST /evidence/request
 ↓
FastAPI
 ↓
Evidence Action Service
 ↓
Mock Customer Validation API
 ↓
Response
 ↓
Persist Evidence
 ↓
LangGraph Resume
```

This makes the simulation realistic and replaceable later.

---

# 24. BEFORE/AFTER DECISION LOOP

This is mandatory.

The backend must persist:

## Before additional evidence

```text
risk
confidence
sufficiency
recommendation
evidence request
```

Then:

```text
Additional Evidence
```

Then:

## After additional evidence

```text
updated risk
updated confidence
updated sufficiency
updated recommendation
```

Do not overwrite the original state.

Persist decision snapshots.

---

# 25. NEXT-BEST-ACTION ENGINE

Candidate actions:

```text
ALLOW
MONITOR
WARN_CUSTOMER
BLOCK_TRANSACTION
BLOCK_ACCOUNT
CREATE_CASE
REQUEST_EVIDENCE
ESCALATE
FILE_REPORT
```

The actual available actions must follow benchmark policy and application configuration.

Pipeline:

```text
Evidence
 ↓
Risk / Confidence
 ↓
Fraud Pattern
 ↓
Policy Context
 ↓
Candidate Actions
 ↓
Policy Filter
 ↓
Permission Filter
 ↓
Approval Check
 ↓
Recommendation
```

---

# 26. POLICY ENGINE

Policy must be backend-enforced.

Model:

```text
Action
Policy Rule
Agent Role
Approval Requirement
Allowed / Denied
```

Example:

```json
{
  "action": "block_account",
  "allowed": true,
  "approval_required": true,
  "required_role": "fraud_supervisor",
  "policy_reference": "..."
}
```

Do not hardcode policy assumptions before inspecting the actual policy files.

---

# 27. APPROVAL WORKFLOW

Backend states:

```text
NOT_REQUIRED
PENDING
APPROVED
REJECTED
```

Workflow:

```text
Recommendation
 ↓
Policy Check
 ↓
Permission Check
 ↓
Approval Required?
 /                \
NO                  YES
 |                    |
Execute         Create Approval
                      ↓
                 Human Review
                  /        \
            Approve        Reject
               |              |
            Execute         Reassess / Close
```

Frontend must consume backend approval state.

---

# 28. ACTION EXECUTION

Actions such as:

```text
block transaction
monitor account
warn customer
freeze/other permitted action
```

may be simulated/stubbed as allowed by the hackathon.

The simulation must be represented through backend services.

Every action needs:

```text
action_id
case_id
type
requested_by
approved_by
status
executed_at
result
policy_reference
```

---

# 29. CASE MANAGEMENT

Implement persistent case lifecycle.

Suggested states:

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

Case updates should be generated from backend events.

---

# 30. CASE MEMORY

Implement real case memory.

Store:

```text
findings
evidence
fraud pattern
graph structure
actions
approval
outcome
analyst decisions
```

Use:

```text
structured retrieval
+
semantic retrieval
+
graph similarity
```

where supported.

Historical cases should inform context rather than become automatic verdicts.

---

# 31. GRAPHRAG

Implement GraphRAG as a real retrieval layer.

Pipeline:

```text
Current Case
 ↓
Relevant Entities
 ↓
Relevant Graph Context
 ↓
Prior Cases
 ↓
Policy / Fraud Typology
 ↓
Relevant Regulatory Context
 ↓
Compact Evidence Context
 ↓
LLM
```

Do not send raw complete datasets to the model.

Do not send the complete graph blindly.

Build focused context.

---

# 32. GRAPH + MEMORY

For current cases:

```text
Graph context
+
semantic case similarity
+
historical outcomes
```

Historical cases are context only and similarity is not proof.

---

# 33. TEMPORAL INVESTIGATION

Preserve timestamps.

Implement queries for:

```text
before
after
within time window
ordered sequence
repeated activity
rapid relationship formation
```

Example:

```text
Device Registration
 ↓ 4 min
Login
 ↓ 3 min
IP change
 ↓ 2 min
High-value transaction
```

Expose the ordered sequence to the UI as evidence.

---

# 34. UNKNOWN PATTERN DISCOVERY

Support two tracks:

```text
Known Pattern Matching
+
Potential Undocumented Pattern Detection
```

Known patterns can be mapped from the provided policy/typology data.

Potential undocumented patterns can be based on graph/temporal anomalies.

Output:

```text
POTENTIAL_UNDOCUMENTED_PATTERN
```

not:

```text
CONFIRMED_FRAUD
```

unless the evidence and benchmark policy support that conclusion.

---

# 35. AUDIT LOG

Every important system event must be persisted.

Examples:

```text
case_created
agent_started
tool_started
tool_completed
evidence_found
pattern_detected
uncertainty_updated
evidence_requested
evidence_received
recommendation_created
policy_checked
approval_created
approval_approved
approval_rejected
action_executed
case_resolved
memory_updated
```

---

# 36. REAL-TIME FRONTEND EVENTS

Use:

```text
Server-Sent Events
```

or WebSocket if already present and justified.

The frontend should receive events such as:

```text
investigation_started
tool_started
tool_completed
evidence_added
uncertainty_changed
evidence_requested
evidence_received
recommendation_updated
approval_required
approval_updated
action_executed
case_resolved
```

This is important because the UI currently simulates agent activity.

Replace fake activity timers with real backend events.

---

# 37. FRONTEND MIGRATION

Update each existing page.

## Dashboard

Replace:

```text
hardcoded metric numbers
mock case table
fake activity feed
```

with backend-derived data.

---

# 38. INVESTIGATIONS PAGE

Replace mock queue with:

```http
GET /api/cases?status=...
```

For large data, prefer backend filtering/pagination.

---

# 39. INVESTIGATION WORKSPACE

The existing visual structure should remain.

But every section must become dynamic:

```text
Case Header
→ backend case

Risk
→ backend assessment

Graph
→ backend graph API

Evidence
→ backend evidence API

Findings
→ backend findings

Fraud Patterns
→ backend pattern assessment

Timeline
→ backend audit/event stream

Uncertainty
→ backend uncertainty state

Evidence Planner
→ backend recommendation

NBA
→ backend recommendation

Policy
→ backend policy result

Approval
→ backend approval state
```

---

# 40. GRAPH UI

Replace any static graph with API-driven graph data.

Endpoint:

```http
GET /api/graph/case/{case_id}
```

Response:

```json
{
  "nodes": [],
  "edges": [],
  "metadata": {}
}
```

Node selection should use backend entity context.

---

# 41. EVIDENCE UI

Evidence cards must come from:

```http
GET /api/cases/{case_id}/evidence
```

When a new evidence event is received:

```text
SSE event
 ↓
React query/state update
 ↓
Evidence card appears
 ↓
Timeline updates
 ↓
Risk/confidence refresh
 ↓
NBA refresh
```

---

# 42. UNCERTAINTY UI

Do not hardcode risk/confidence/sufficiency.

Render values received from backend state.

---

# 43. EVIDENCE PLANNER UI

Replace frontend simulation with backend recommendation data.

Clicking:

```text
Request Evidence
```

must call the backend.

---

# 44. SIMULATED CUSTOMER VALIDATION

The customer validation simulation belongs in backend.

Example flow:

```text
POST /api/cases/{case_id}/evidence/request

Backend:
create evidence request
call mock provider
return request ID

Frontend:
show waiting

Backend:
provider completes

SSE:
evidence_received

Frontend:
update UI
```

Do not use frontend-only `setTimeout()` demo state as the primary mechanism.

---

# 45. BEFORE / AFTER UI

The frontend should retrieve decision snapshots from the backend.

API:

```http
GET /api/cases/{case_id}/decisions
```

The UI should animate between actual backend states.

---

# 46. APPROVAL UI

The Approvals page should consume the backend approval list.

Approval actions:

```http
POST /api/approvals/{approval_id}/approve
POST /api/approvals/{approval_id}/reject
```

After approval:

```text
SSE event
 ↓
frontend updates
 ↓
action execution state
 ↓
timeline
```

No fake local status.

---

# 47. MEMORY PAGE

Retrieve similar cases from backend.

Do not hardcode similarity values.

If similarity is approximate or heuristic, label it accordingly.

---

# 48. AUDIT PAGE

Retrieve audit events from backend.

The case timeline and global audit log should share the same underlying event model where practical.

---

# 49. BENCHMARK PAGE

Benchmark data must come from backend.

The runner must execute the investigation pipeline rather than display hardcoded counters.

---

# 50. DATASET INGESTION

Do not assume data is ready.

Create a reproducible ingestion pipeline.

Process:

```text
Raw Dataset
 ↓
README Inspection
 ↓
Schema Validation
 ↓
Normalization
 ↓
Entity Mapping
 ↓
Relationship Construction
 ↓
Temporal Validation
 ↓
TigerGraph Load
 ↓
Graph Integrity Checks
```

Create scripts such as:

```bash
python scripts/inspect_dataset.py
python scripts/validate_dataset.py
python scripts/build_graph_data.py
python scripts/load_tigergraph.py
```

Adapt commands to the repository.

---

# 51. DATASET RULE

The problem statement explicitly says the README inside the dataset explains:

- every file,
- every column,
- answer format,
- case behavior.

Therefore:

**Do not finalize the graph schema, benchmark logic, or fraud-pattern mapping before inspecting the actual README and source data.**

If the repository does not contain the dataset/README:

1. determine where it is expected to be,
2. document the missing dependency,
3. use only schema information that can be verified,
4. do not invent fields.

---

# 52. PERSISTENCE

Critical case state should persist outside the browser.

At minimum persist:

```text
case
evidence
findings
recommendations
decision snapshots
approval
actions
audit events
case memory
```

TigerGraph should contain the graph representation required by the hackathon.

If an auxiliary relational state store is needed for application orchestration, introduce it deliberately and document why.

Do not create a second database just because it is convenient.

---

# 53. CASE WRITTEN TO GRAPH

The benchmark explicitly requires the case to be written to the graph.

Therefore, after case creation/progression:

```text
Case
+
Evidence
+
Relevant entities
+
Relationships
+
Action/outcome
```

must be represented in TigerGraph as defined by the final schema.

Create a graph write service with idempotent upsert behavior.

Running the same case update twice must not create duplicate graph records.

---

# 54. IDEMPOTENCY

Implement idempotency for:

- case creation,
- evidence creation,
- evidence requests,
- approval creation,
- action execution,
- graph writes,
- benchmark runs.

Use stable IDs.

Do not duplicate case/evidence/recommendation records when a request is retried.

---

# 55. ERROR HANDLING

If TigerGraph is unavailable:

```text
Do not fabricate graph evidence.
Do not silently use mock graph data.
Show clear backend error.
```

If MCP is unavailable:

```text
Do not pretend graph investigation succeeded.
```

If LLM fails:

```text
retry
validate
fallback to deterministic logic where possible
or escalate
```

If policy evaluation fails:

```text
do not execute restricted action
```

---

# 56. LOGGING

Use structured backend logs.

Example fields:

```text
timestamp
request_id
case_id
node
tool
duration_ms
status
error_code
```

Do not log API keys, passwords, secret tokens, or unnecessary sensitive values.

---

# 57. API CONTRACTS

Every API response should have a predictable structure.

For example:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

Or use another consistent typed convention and document it.

Use Pydantic response models.

---

# 58. TYPESCRIPT TYPES

Generate or maintain frontend types corresponding to backend contracts.

At minimum:

```text
Case
Transaction
Customer
Account
Device
Connection
Merchant
Evidence
Finding
FraudPattern
PolicyResult
Recommendation
Approval
Action
AuditEvent
TimelineEvent
MemoryCase
GraphNode
GraphEdge
BenchmarkCase
```

Do not duplicate incompatible types in multiple files.

---

# 59. DATA FETCHING

Use the project's existing data-fetching library if appropriate.

If none exists, use a robust API query layer such as TanStack Query.

Requirements:

- caching,
- refetch,
- mutation handling,
- loading state,
- error state,
- stale data handling.

---

# 60. REAL-TIME UPDATE STRATEGY

Prefer:

```text
REST
+
SSE
```

REST for initial loads, reads, and mutations.

SSE for agent activity, evidence arrival, case updates, approvals, action execution and benchmark progress.

---

# 61. AGENT EXECUTION MODES

Support synchronous and asynchronous investigation.

For UI:

```text
POST /api/investigations/{case_id}/run
→ investigation_id
```

Then subscribe to case investigation events.

The user should see the investigation progressing live.

---

# 62. HUMAN-IN-THE-LOOP

The agent must stop when approval is required and return control to the human.

Frontend should show:

```text
AWAITING APPROVAL
```

Backend must not execute restricted action until approval is granted.

---

# 63. AGENT PERMISSIONS

Represent roles and permissions server-side.

Example:

```text
Agent:
read graph = yes
recommend = yes
request evidence = yes
execute restricted action = no

Supervisor:
approve restricted action = yes
```

---

# 64. PROMPT MANAGEMENT

Store prompts in versioned files:

```text
backend/app/agent/prompts/
```

Prompts should specify:

- agent role,
- available tools,
- evidence rules,
- output schema,
- no-fabrication rule,
- policy handling.

---

# 65. STRUCTURED LLM OUTPUT

Use Pydantic schemas for:

```text
InvestigationPlan
EvidenceAssessment
EvidenceRequest
PatternAssessment
RiskAssessment
Recommendation
Explanation
```

Invalid output must be rejected/retried and never directly executed.

---

# 66. EXPLANATION ENGINE

The final explanation should contain:

```text
Summary
Key Evidence
Contradicting Evidence
Fraud Pattern
Risk
Confidence
Remaining Uncertainty
Additional Evidence Requested
Why It Was Requested
Why The Final NBA Was Chosen
Policy Reference
Approval Requirement
```

Each factual claim should reference evidence IDs.

---

# 67. FRONTEND EXPLANATION

Display structured explanation.

Do not render one huge AI paragraph.

Use:

```text
Key Findings
Evidence
Why More Evidence Was Needed
Decision Change
Policy Basis
Approval Route
```

---

# 68. UI/UX PRESERVATION

Keep the visual design from the current frontend/UI brief where possible:

```text
dark enterprise workspace
graph-first investigation screen
evidence cards
uncertainty panel
NBA card
approval flow
timeline
audit trail
case memory
benchmark
```

Do not downgrade the UI while adding backend functionality.

The graph/evidence/uncertainty/NBA relationship is the primary visual identity.

---

# 69. DASHBOARD SHOULD BECOME REAL

Backend-derived metrics:

```text
active cases
awaiting evidence
pending approvals
escalations
resolved cases
```

Do not use static metric values.

---

# 70. CASE DETAIL SHOULD BECOME REAL

Every section must come from backend data.

No static:

```text
case summary
timeline
evidence
policy
approval
memory
```

---

# 71. GRAPH ↔ EVIDENCE SYNCHRONIZATION

When backend evidence contains a graph path, the frontend should highlight that path.

When the user clicks a graph relationship, show related evidence.

All synchronization must use IDs supplied by the backend.

---

# 72. SEARCH

Global search should query the backend.

Search:

```text
case ID
transaction ID
customer ID
account ID
device ID
merchant ID
```

Do not only search currently loaded frontend arrays.

---

# 73. PAGINATION

For large datasets, prefer server-side pagination.

Do not load the approximately 590,000 transaction records into the browser.

Graph views and benchmark cases should retrieve only relevant subsets.

---

# 74. PERFORMANCE

Engineering targets for the prototype:

```text
dashboard load < 2.5 sec target

typical graph query < 1 sec target

full interactive investigation < 15 sec target
(excluding human evidence waiting)
```

Measure actual bottlenecks before optimizing.

---

# 75. SECURITY

Implement:

- environment variables,
- backend authorization,
- strict action permissions,
- CORS restrictions,
- input validation,
- safe logging,
- no secret exposure,
- prompt-injection-resistant retrieval handling,
- restricted tool access.

Never expose TigerGraph credentials to the frontend.

---

# 76. FRONTEND ENVIRONMENT

Only public-safe configuration belongs in `NEXT_PUBLIC_*`.

TigerGraph credentials, LLM keys, MCP credentials, and backend secrets remain server-side.

---

# 77. HEALTH CHECKS

The backend must expose:

```text
/health
/health/tigergraph
/health/mcp
/health/agent
```

Frontend should show actual system state from these endpoints.

Do not falsely show online.

---

# 78. DOCKER / LOCAL RUN

Make local startup straightforward.

Recommended components:

```text
frontend
backend
mock evidence services
```

TigerGraph can remain external.

Provide clear commands in README.

---

# 79. TESTING

Build tests before claiming completion.

## Backend Unit

Test policy logic, permissions, state transitions, evidence validation, recommendation validation, idempotency.

## Graph

Test entity retrieval, transaction context, shared-device paths, prior cases, temporal queries.

## Agent

Test tool selection, uncertainty routing, evidence planner, reassessment, NBA.

## Integration

Test:

```text
frontend
→ API
→ agent
→ MCP
→ TigerGraph
→ case update
```

## Frontend

Test route rendering, data fetching, loading/error states, graph/evidence sync, approval state, before/after state.

---

# 80. BENCHMARK RUNNER

Implement a backend benchmark runner.

Flow:

```text
Load Case
 ↓
Create / Open Case
 ↓
Run Investigation
 ↓
Store Initial NBA
 ↓
Request / Acquire Additional Evidence
 ↓
Store Evidence
 ↓
Reassess
 ↓
Store Final NBA
 ↓
Write Case to Graph
 ↓
Generate Required Output
```

All 20 benchmark cases must be executable.

---

# 81. BENCHMARK OUTPUT

For every case generate the structures required by the official README/answer format, including as applicable:

```text
case
investigation record
evidence
findings
decision before additional evidence
decision after additional evidence
approval route
actions
SAR/report when required
summary
```

The exact format from the dataset README takes precedence.

---

# 82. CASE MEMORY UPDATE

After final outcome:

```text
Resolved Case
 ↓
Extract Memory
 ↓
Persist Structured Case
 ↓
Index Semantic Summary
 ↓
Store Graph Relationships
```

Future cases may retrieve similar context.

---

# 83. FRONTEND DEMO MODE AFTER INTEGRATION

Once real backend integration works:

```text
NEXT_PUBLIC_DEMO_MODE=false
```

The UI should work from real backend state.

A demo mode may exist for development, but it must be explicitly enabled and must not mask backend failures.

---

# 84. GOLDEN PATH

The following case must work end to end:

```text
CASE-10293
```

Conceptual flow:

```text
1. Dashboard
2. Open case
3. Backend creates/loads case
4. Agent begins investigation
5. TigerGraph context retrieved
6. Customer context retrieved
7. Device relationships retrieved
8. Previous cases retrieved
9. Evidence generated
10. Risk/confidence assessed
11. Evidence deemed insufficient
12. Evidence planner selects customer validation
13. Backend submits evidence request
14. Mock evidence service returns result
15. New evidence persisted
16. LangGraph resumes
17. Case reassessed
18. Risk/confidence update
19. NBA changes
20. Policy checked
21. Approval required
22. Approval created
23. Supervisor approves
24. Action executed
25. Audit updated
26. Case resolved
27. Memory updated
28. UI reflects every step
```

The UI must not simulate these through local timers.

---

# 85. GOLDEN PATH VALIDATION

Create an automated integration test:

```text
test_golden_case_10293()
```

Verify:

```text
case created
graph evidence retrieved
uncertainty detected
evidence requested
evidence received
recommendation changed
policy checked
approval created
approval completed
action recorded
case resolved
memory updated
audit events present
```

---

# 86. NO REGRESSION REQUIREMENT

The visual frontend already contains important UX work.

Before making backend changes, preserve:

- routes,
- responsive layout,
- graph presentation,
- evidence hierarchy,
- uncertainty panel,
- NBA presentation,
- approval UI,
- benchmark UI.

After integration:

- run frontend tests,
- run production build,
- inspect every major route,
- fix layout/API loading regressions.

---

# 87. COMPONENT REFACTORING

Where components currently contain data + API logic + UI + business logic, separate them.

Preferred:

```text
components/
services/
hooks/
types/
```

Do not make every component know how FastAPI works.

---

# 88. ERROR UX

Frontend should distinguish:

```text
NETWORK_ERROR
AUTH_ERROR
VALIDATION_ERROR
TIGERGRAPH_ERROR
MCP_ERROR
AGENT_ERROR
POLICY_ERROR
APPROVAL_ERROR
```

Use actionable messages, not generic errors.

---

# 89. LOADING UX

Replace fake timers with actual operation states.

Example:

```text
● Investigation started
✓ Transaction context retrieved
✓ Customer history retrieved
● Inspecting graph relationships
○ Previous cases
○ Evidence assessment
```

These states should come from backend/SSE events.

---

# 90. STOP CONDITIONS

The agent should stop when:

```text
evidence is sufficient
AND
a defensible action can be selected
```

or when human escalation is required.

Implement max iteration/tool-call safeguards.

---

# 91. TOOL SAFETY

Set limits:

```text
max graph calls per investigation
max agent iterations
max evidence requests
max retries
```

When a limit is reached:

```text
escalate / stop safely
```

Never silently continue forever.

---

# 92. ACTION GUARD

Before any action execution:

```text
Validate action schema
↓
Policy check
↓
Permission check
↓
Approval check
↓
Execute
↓
Audit
```

This must be impossible to bypass through the frontend.

---

# 93. REPRODUCIBILITY

A case should be reproducible from:

```text
case ID
input trigger
stored evidence
tool outputs
decision snapshots
policy references
action history
```

Avoid depending entirely on transient model state.

---

# 94. DOCUMENTATION

Update/create:

```text
README.md
ARCHITECTURE.md
API.md
DEVELOPMENT.md
TROUBLESHOOTING.md
```

Document:

- frontend startup,
- backend startup,
- environment variables,
- TigerGraph setup,
- MCP setup,
- dataset loading,
- benchmark runner,
- API endpoints,
- tests.

---

# 95. ENVIRONMENT TEMPLATE

Create:

```text
.env.example
```

with placeholders such as:

```env
APP_ENV=development

API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_ORIGIN=http://localhost:3000

TIGERGRAPH_HOST=
TIGERGRAPH_GRAPH=
TIGERGRAPH_USERNAME=
TIGERGRAPH_PASSWORD=

MCP_SERVER_URL=

LLM_PROVIDER=
LLM_MODEL=
LLM_API_KEY=

GRAPHRAG_ENABLED=true
CASE_MEMORY_ENABLED=true
AUDIT_LOG_ENABLED=true
DEMO_MODE=false
```

Do not commit real secrets.

---

# 96. IMPLEMENTATION PHASES

Follow this order.

## PHASE 1 — Repository Audit

- inspect repository,
- inspect current frontend,
- inspect documents,
- identify static behavior,
- create implementation audit.

## PHASE 2 — Dataset / Graph Foundation

- inspect README,
- inspect data,
- design final graph schema,
- load TigerGraph,
- validate graph.

## PHASE 3 — FastAPI

- API structure,
- schemas,
- case service,
- graph service,
- evidence service,
- audit service.

## PHASE 4 — TigerGraph MCP

- connect MCP,
- expose investigation tools,
- test tools manually.

## PHASE 5 — LangGraph

- state,
- planner,
- investigation,
- evidence,
- uncertainty,
- evidence planner,
- NBA,
- policy,
- approval,
- memory,
- explanation.

## PHASE 6 — Real Evidence Flow

- request API,
- mock provider,
- evidence persistence,
- resume agent,
- reassessment.

## PHASE 7 — Frontend Integration

Replace all static data with API-driven state.

## PHASE 8 — Real-Time Events

Add SSE/WebSocket and remove fake timers.

## PHASE 9 — Benchmark

Run 20 cases.

## PHASE 10 — Hardening

Testing, errors, permissions, idempotency, performance, documentation.

---

# 97. ACCEPTANCE CRITERIA

Do not declare completion until all are true.

## Frontend

- [ ] No hardcoded production case data.
- [ ] No static graph used as source of truth.
- [ ] No fake risk/confidence state.
- [ ] No fake approval transitions.
- [ ] No frontend-only evidence simulation.
- [ ] No fake timeline timers.
- [ ] Dashboard uses backend data.
- [ ] Case workspace uses backend data.
- [ ] Graph uses TigerGraph-backed data.
- [ ] Evidence uses backend data.
- [ ] NBA uses backend decisioning.
- [ ] Approval uses backend state.
- [ ] Memory uses backend data.
- [ ] Audit uses backend data.
- [ ] Benchmark uses backend data.

## Backend

- [ ] FastAPI operational.
- [ ] Typed request/response models.
- [ ] LangGraph operational.
- [ ] TigerGraph connected.
- [ ] TigerGraph MCP connected.
- [ ] Graph investigation queries operational.
- [ ] GraphRAG operational.
- [ ] Case lifecycle operational.
- [ ] Evidence lifecycle operational.
- [ ] Uncertainty engine operational.
- [ ] Evidence planner operational.
- [ ] NBA operational.
- [ ] Policy enforcement operational.
- [ ] Approval workflow operational.
- [ ] Audit trail operational.
- [ ] Case memory operational.
- [ ] Benchmark runner operational.

## End-to-End

- [ ] CASE-10293 golden path works.
- [ ] Additional evidence changes the case state.
- [ ] Before/after NBA is persisted.
- [ ] Case is written to TigerGraph.
- [ ] Final action state is persisted.
- [ ] Memory is updated.
- [ ] Audit trail is complete.

---

# 98. IMPORTANT: DO NOT OVERENGINEER

This is a hackathon build.

Prioritize:

```text
correct investigation
+
real graph usage
+
real agent workflow
+
evidence acquisition
+
NBA
+
policy control
+
benchmark reliability
```

Do not spend time building unnecessary infrastructure or unrelated product features.

A clean modular monolith is acceptable.

---

# 99. IMPORTANT: DO NOT FAKE TIGERGRAPH OR MCP

For the final integrated system:

```text
TigerGraph = real
MCP = real
GSQL = real
Graph investigation = real
FastAPI = real
LangGraph = real
Frontend = real
```

Mocking is allowed only for explicitly simulated external actions such as customer validation or other approved interactions.

Do not replace TigerGraph with a local graph library just to make the demo work.

Do not replace MCP with a fake interface.

---

# 100. IMPORTANT: DO NOT BREAK THE VISUAL EXPERIENCE

The frontend was deliberately designed around:

```text
Dashboard
Investigation Workspace
Graph Explorer
Evidence
Uncertainty
Evidence Planner
Before/After
Next-Best-Action
Approval
Memory
Audit
Benchmark
```

Keep these.

Backend integration should make them real, not redesign them into a generic admin dashboard.

---

# 101. FINAL TASK

Start now.

First:

```text
1. Inspect repository.
2. Read existing frontend code.
3. Read the PRD.
4. Read the TRD.
5. Read the APP FLOW.
6. Read the UI/UX brief.
7. Inspect dataset/README if available.
8. Identify all static/demo logic.
9. Create IMPLEMENTATION_AUDIT.md.
```

Then:

```text
10. Build the backend.
11. Connect TigerGraph.
12. Connect TigerGraph MCP.
13. Build LangGraph workflow.
14. Build GraphRAG.
15. Build policy/permission layer.
16. Build case memory.
17. Build audit/event system.
18. Build real evidence-request services.
19. Connect frontend APIs.
20. Replace all static state.
21. Add SSE/WebSocket updates.
22. Run the golden case.
23. Run tests.
24. Run all 20 benchmark cases.
25. Fix failures.
26. Update documentation.
```

When finished, report:

```text
IMPLEMENTATION SUMMARY

Frontend:
what was changed

Backend:
what was built

TigerGraph:
schema + queries + graph writes

MCP:
integration status + tools exposed

LangGraph:
workflow + nodes

GraphRAG:
retrieval strategy

Evidence:
request + receipt flow

NBA:
decision pipeline

Policy:
authorization model

Memory:
retrieval + update

Real-time:
SSE/WebSocket status

Benchmark:
20-case status

Tests:
results

Known limitations:
remaining issues
```

Do not stop after generating architecture files.

Actually implement the system.

Do not leave TODO placeholders for core functionality.

Do not claim a component is connected when it is only mocked.

The final result must be a working full-stack application with the existing frontend converted from a static prototype into a real AI-powered fraud investigation client backed by FastAPI, LangGraph, TigerGraph, TigerGraph MCP, GraphRAG, policy controls, case memory, and persistent case state.
