# IMPLEMENTATION AUDIT
## Sentinel AI — From Frontend Prototype to Real Full-Stack System

### 1. Existing Architecture Summary
- **Frontend Framework**: Next.js 16.3.3 (App Router with dynamic catch-all route `app/[[...slug]]/page.tsx`), React 19, Tailwind CSS 4, Lucide React.
- **Location**: `sentinel-ai-fraud-prototype(V0)/`
- **Initial Component Model**: Monolithic UI in `components/sentinel-app.tsx` importing hardcoded mock arrays from `lib/mock-data.ts`.
- **Initial State Management**: Local React `useState` hooks simulating investigation progression, customer evidence responses via `setTimeout`, and hardcoded empty states for Approvals, Benchmark, and Settings.

---

### 2. Audit of Existing Mock / Static Data Sources
| Mock Source in `lib/mock-data.ts` | Target Real Backend Source | Status |
|---|---|---|
| `investigations` (5 mock cases) | `GET /api/cases` from `case_pack.csv` + `CASE-10293` | Replace with dynamic case list |
| `evidence` (4 static items `E-004`, `E-007`...) | `GET /api/cases/{id}/evidence` with TigerGraph provenance | Replace with live evidence store |
| `timeline` (hardcoded 8 steps) | `GET /api/cases/{id}/audit` + SSE stream | Replace with real event trail |
| `graphNodes` & `graphEdges` (static 7 nodes) | `GET /api/graph/case/{id}` with entity traversal | Replace with dynamic graph topology |
| `memoryCases` (3 static cases) | `GET /api/memory/similar/{id}` from 5,565 closed cases | Replace with semantic/graph similarity |
| `auditEvents` (5 static audit rows) | `GET /api/audit` | Replace with real system audit log |
| `stats` (hardcoded metrics 24, 08, 03...) | `GET /api/cases/metrics` | Replace with real aggregated metrics |
| `setTimeout` in `requestEvidence()` | `POST /api/cases/{id}/evidence/request` | Replace with backend simulation & SSE |
| Hardcoded approval submission | `POST /api/approvals/{id}/approve` | Replace with persistent approval queue |
| `empty-panel` on `/approvals`, `/benchmark` | Full production pages | Replace with functional dashboards |

---

### 3. Backend Integration Gaps Identified
1. **TigerGraph Schema & GSQL Execution**: The benchmark dataset contains 590,742 transactions, 144,432 identity records, 5,565 closed cases, and 20 benchmark cases. An ingestion layer is needed to index entities (`Customer`, `Card`, `Transaction`, `DeviceProfile`, `BillingRegion`, `ClosedCase`) and provide multi-hop graph queries.
2. **LangGraph Stateful Decision Loop**: Need a 10-stage decision engine evaluating pre-evidence NBA (e.g. `VERIFY_WITH_CUSTOMER`), evidence acquisition, and post-evidence reassessment (`BLOCK_CARD`, `CREATE_CASE`, `FILE_REPORT`).
3. **Policy Engine (Rules R1 to R10)**: Automated evaluation of approval routes (`auto`, `L1`, `L2`) according to exposure and patterns.
4. **SAR Generation**: FinCEN narrative generator for regulatory filings.
5. **Real-time Event Streaming**: Server-Sent Events (`/api/investigations/{id}/events`) to stream tool execution, evidence discovery, and reassessments directly to the UI.

---

### 4. Migration Plan & Strategy
1. **Define typed contracts** (`types/sentinel.ts`) shared between frontend and backend.
2. **Implement FastAPI backend** in `backend/` with full REST APIs, in-memory graph indexer, policy engine, and benchmark runner.
3. **Build API client** (`lib/api-client.ts`) in the frontend with graceful fallback.
4. **Refactor `sentinel-app.tsx`** into modular, API-connected views while preserving 100% of the visual styling and layout tokens.
5. **Execute 20-case HHGOA benchmark** and produce official `cases/<case_id>.json` answer files.
6. **Validate end-to-end functionality** with automated tests and browser inspection.
