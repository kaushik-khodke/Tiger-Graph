# Sentinel AI: Agentic Fraud Investigation & Next-Best-Action Platform with TigerGraph & LangGraph

> **Hackathon Submission:** TigerGraph × Hacker House Goa (HHGOA) — Fraud Investigation Dataset  
> **Team Platform:** Sentinel AI  
> **Repository:** [GitHub](https://github.com/kaushik-khodke/tiger-trace)  

---

## 1. What We Built

Financial fraud investigation has traditionally been a manual, fragmented, and agonizingly slow race against time. Fraud analysts must manually cross-reference high-velocity card transactions, pivot across IP/device fingerprints, dig through closed dispute records, evaluate compliance manuals, assess risk, and decide what action to take—often completing investigations only after the stolen funds have permanently dispersed.

We built **Sentinel AI**: an autonomous, explainable **Agentic Fraud Investigation and Next-Best-Action Platform** powered by **TigerGraph Savanna Cloud**, **LangGraph**, and the **Google Gemini 3.x Family**. 

Sentinel AI continuously ingests flagged transaction alerts, traverses hardware and cardholder graph topologies to uncover hidden syndicate rings, dynamically assesses uncertainty, requests policy-controlled evidence from customers or analysts, executes defensible containment actions (card blocks, step-up auth, case creation), files audit-ready Suspicious Activity Reports (SAR), and writes resolved findings back into TigerGraph's dynamic case memory.

---

## 2. Platform Architecture

Sentinel AI is structured into an enterprise full-stack architecture designed for real-time responsiveness, defensible compliance, and full observability:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Analyst Dashboard                       │
│      (Live Graph Topology, Case Progression, SAR Inspector, NBA)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SSE / REST (port 8001)
┌───────────────────────────────────▼────────────────────────────────────┐
│                       FastAPI Application Server                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               LangGraph 16-Node State Machine Graph              │  │
│  │   Trigger -> Planner -> Graph Investigation -> Evidence Analyzer │  │
│  │   -> Pattern Recognition -> Uncertainty Engine -> Policy Router  │  │
│  │   -> Evidence Action -> NBA Engine -> Approval -> Memory Update  │  │
│  └──────────────────┬─────────────────────────────┬─────────────────┘  │
│                     │                             │                    │
│      ┌──────────────▼─────────────┐ ┌─────────────▼─────────────┐      │
│      │ Gemini 3.x ModelRouter     │ │ Langfuse Observability    │      │
│      │ (3.8 -> 3.7 -> 3.6 -> 3.5) │ │ (Traces, Latency, Provenance)│   │
│      └────────────────────────────┘ └───────────────────────────┘      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Official MCP Protocol / REST++
┌───────────────────────────────────▼────────────────────────────────────┐
│                    TigerGraph Savanna Cloud (v4)                       │
│    FraudGraph Schema: 8 Vertices | 12 Bidirectional Edges              │
│    GSQL C++ Compiled Queries: device_neighbors, card_window, etc.     │
│    Case Memory: InvestigationCase vertices with Graph Write-Back       │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Pillars:
1. **LangGraph StateGraph Engine**: An autonomous 16-node state machine enforcing strict investigation progression, uncertainty boundaries, and human-in-the-loop checkpoints.
2. **TigerGraph Savanna Integration**: Direct connection to TigerGraph Savanna Cloud v4 via the official `tigergraph-mcp` server (`uvx tigergraph-mcp`) and REST++ statement runners.
3. **Gemini 3.x ModelRouter**: Adaptive reasoning hierarchy (`gemini-3.8-flash` ➔ `gemini-3.7-flash` ➔ `gemini-3.6-flash` ➔ `gemini-3.5-flash`) utilizing structured JSON schema outputs and configurable reasoning effort (`low`, `medium`, `high`).
4. **Langfuse Observability**: Complete end-to-end tracing capturing every LLM prompt, TigerGraph query latency, tool call execution, and entity provenance.

---

## 3. How TigerGraph is Used

TigerGraph serves as the authoritative, real-time investigative backbone of Sentinel AI:

### A. Graph Schema Design (`FraudGraph`)
- **8 Core Vertices**: `Customer`, `Card`, `Transaction`, `DeviceProfile`, `ClosedCase`, `InvestigationCase`, `BillingRegion`, `EmailDomain`.
- **12 Bidirectional Edges**: `OWNS`, `MADE`, `FROM_DEVICE`, `NEXT`, `PURCHASER_EMAIL`, `BILLED_IN`, `INVOLVES`, `ON_CARD`, `CONNECTED_TO`, `INVESTIGATED_CARD`, `INVESTIGATED_TXN`, `IDENTIFIED_DEVICE`.

### B. Parametrized GSQL Queries (C++ DSO Compiled)
1. **`device_neighbors`**: Multi-hop syndicate discovery traversing from an unfamiliar device profile through executed transactions to all cards and account holders sharing that hardware footprint.
2. **`card_window`**: High-performance temporal sequence aggregation measuring transaction velocity and exposure accumulation under 1 hour (Rule R5 card testing detection).
3. **`customer_summary`**: Customer portfolio resolution retrieving all registered cards and historical home billing regions (Rule R7 out-of-region detection).
4. **`find_prior_cases`**: GraphRAG historical memory query retrieving similar closed fraud cases (July–October 2016) linked to a card or device.
5. **`store_investigation_case`**: Dynamic write-back query upserting completed investigation outcomes (`InvestigationCase`) and establishing active edges to cards and flagged transactions.

### C. Official TigerGraph MCP Server
We leveraged the official `tigergraph-mcp` protocol (`uvx tigergraph-mcp`) configured with `TG_HOST`, `TG_SECRET`, and `TG_GRAPHNAME`. This allowed our LangGraph agent to dynamically inspect graph schemas, fetch vertex counts, and execute compiled GSQL queries with native tool-calling capabilities.

---

## 4. Agentic Capabilities Implemented

Sentinel AI is not a simple prompt wrapper; it is a full agentic decision framework:

1. **Multi-Trigger Autonomous Initialization**: Handles triggers from model risk scores (e.g., score $> 0.60$), customer unauthorized dispute messages, or human analyst escalations.
2. **Uncertainty Quantification**: Before jumping to conclusions, the agent quantifies signal ambiguity. If evidence is contradictory (e.g., initial high score on an unverified device without cardholder confirmation), it places the investigation in an `uncertain` state.
3. **Controlled Evidence Gathering**: Under bank policy (R1–R10), the agent issues controlled, policy-compliant evidence actions—such as dispatching an out-of-band customer verification prompt or requiring biometric step-up authentication.
4. **Next-Best-Action Evolution (`what_changed`)**: The agent records an initial recommendation (e.g., `VERIFY_WITH_CUSTOMER`), and upon receiving customer feedback, updates its recommendation to `BLOCK_CARD` and `CREATE_CASE`, clearly explaining the delta.
5. **Approval Routing Governance**: Distinguishes between automated system actions (`auto`), Level 1 supervisor approvals (`L1` for exposure $\le \$2,500$), and Level 2 risk committee approvals (`L2` for exposure $> \$2,500$ or SAR filings).
6. **Regulatory SAR Generation**: Automatically generates complete FinCEN-compliant Suspicious Activity Reports (SAR) covering the 5 W's whenever exposure exceeds $\$1,000$ or syndicate links are confirmed.
7. **Dynamic Case Memory**: Writes resolved cases back to TigerGraph so future investigations instantly benefit from historical analyst verdicts.

---

## 5. What We Learned

- **Graph Traversal vs. Relational Joins**: Multi-hop syndicate discovery (traversing across devices, transactions, cards, and parties) in relational SQL requires slow, complex multi-table joins. In TigerGraph, installed GSQL queries execute across millions of edges in sub-milliseconds.
- **The Power of GraphRAG**: Feeding LLMs raw tables leads to hallucination and context overflow. Feeding LLMs grounded subgraph neighborhoods and relevant prior case verdicts via GraphRAG produces 100% accurate, policy-aligned decisions.
- **MCP Simplifies Agent Tooling**: The Model Context Protocol (MCP) standardized our agent-to-graph interface, eliminating hundreds of lines of custom API boilerplate.

---

## 6. What We Would Improve With More Time

1. **Streaming Real-Time Graph Visualizations**: Live WebSocket streaming of graph subgraphs into Cytoscape.js canvas as the agent expands its traversal.
2. **Real-Time Kafka/CDC Authorization Stream**: Ingesting high-velocity card swipe authorization webhooks directly into TigerGraph GSE for real-time sub-10ms inline fraud interruption.
3. **Graph Neural Network (GNN) Embeddings**: Combining TigerGraph Graph Data Science Library (PageRank, Louvain Community Detection) with vector embeddings for zero-shot syndicate ring clustering.

---

### Conclusion

Sentinel AI demonstrates that the future of financial crime investigation lies in the synergy between **deep graph intelligence** and **autonomous agentic reasoning**. By pairing TigerGraph Savanna's high-speed multi-hop graph engine with LangGraph's structured state machine, institutions can compress hours of manual investigation into seconds of defensible, auditable action.
