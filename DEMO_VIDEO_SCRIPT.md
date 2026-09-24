# Sentinel AI — Demo Video Script (3–5 Minutes)
> **Hackathon Submission:** TigerGraph × Hacker House Goa (HHGOA) — Agentic Fraud Investigation Track  
> **Platform:** Sentinel AI (TigerTrace)  
> **Target Video Duration:** 4 minutes 00 seconds (Ideal for the 3–5 min requirement)  
> **Pace:** ~130–140 words per minute (Clear, confident, professional)

---

## 🎬 Video Overview & Timing Structure

| Section | Timeline | Focus Area | Key Visuals |
|---|---|---|---|
| **1. Hook & Problem** | `0:00 – 0:35` | The Fraud Investigation Crisis | Title slide & Dashboard overview |
| **2. Architecture & TigerGraph Foundation** | `0:35 – 1:15` | TigerGraph Savanna, LangGraph & MCP | Architecture diagram & Graph schema |
| **3. Operations Dashboard & Multilingual** | `1:15 – 1:45` | Global Live Operations | Real-time KPIs, Language switcher, Dark/Light mode |
| **4. Golden Case Deep Dive (`CASE-10293`)** | `1:45 – 3:00` | Autonomous Investigation & NBA Evolution | Interactive Graph, Uncertainty Meter, Out-of-band Evidence, Next-Best-Action |
| **5. Approvals, Case Memory & SAR Dossier** | `3:00 – 3:45` | Governance, GraphRAG Memory & Compliance | Approvals Hub, Case Memory (5,565 cases), FinCEN SAR |
| **6. Benchmark Harness & Closing** | `3:45 – 4:15` | 20-Case Benchmark & Impact | Benchmark run, 100% defensible verdicts, Wrap-up |

---

## 🎙️ Scene-by-Scene Spoken Script & Screen Directions

---

### SCENE 1: Hook & The Core Problem (`0:00 – 0:35`)
**Visual on Screen:**
- Start with browser open at `http://localhost:3000` showing the **Sentinel AI — Operations Overview** dashboard.
- Mouse hovers subtly over the KPI metrics and the priority review queue.

**Voiceover (Speaker):**
> *"Every day, financial institutions lose billions to sophisticated fraud syndicates. Traditional fraud investigation is an agonizingly slow, manual race against time. Analysts are forced to juggle relational databases, piece together fragmented device IPs, sift through legacy dispute records, and manually interpret compliance rulebooks—often completing investigations days after the stolen funds have permanently dispersed.*
>
> *Welcome to **Sentinel AI**: an autonomous, explainable Agentic Fraud Investigation and Next-Best-Action platform powered by **TigerGraph Savanna Cloud**, **LangGraph**, and **Google Gemini**."*

---

### SCENE 2: The Core Architecture & TigerGraph Power (`0:35 – 1:15`)
**Visual on Screen:**
- Switch briefly to the architecture slide or the **Settings & Environment** tab (`/settings`).
- Highlight:
  - **TigerGraph Savanna Cloud (v4)**: `FraudGraph` schema with **735,174 indexed entities** (IEEE-CIS dataset).
  - 8 core vertices (`Customer`, `Card`, `Transaction`, `DeviceProfile`, `ClosedCase`, etc.) and 12 bidirectional edges.
  - Official **`tigergraph-mcp`** server connection and C++ compiled GSQL queries (`device_neighbors`, `card_window`, `customer_summary`).
  - **LangGraph** 16-node state machine decision engine with **Gemini ModelRouter** fallback.

**Voiceover (Speaker):**
> *"At the heart of Sentinel AI is **TigerGraph Savanna Cloud**, housing over 735,000 entities from the IEEE-CIS benchmark across an 8-vertex, 12-edge graph schema.*
> 
> *Relational SQL databases choke on multi-hop syndicate queries because they require expensive, slow table joins. In contrast, Sentinel AI executes compiled GSQL queries in sub-milliseconds over TigerGraph's official MCP server—traversing from flagged transactions through device footprints to uncover entire distributed crime rings.*
> 
> *Governing the investigation is an autonomous **LangGraph 16-node state machine**, orchestrating planning, evidence gathering, uncertainty assessment, and human-in-the-loop compliance."*

---

### SCENE 3: Operations Dashboard & Multilingual Control (`1:15 – 1:45`)
**Visual on Screen:**
- Navigate back to the **Dashboard** (`/dashboard`).
- Point out real-time KPI cards: **Active Investigations**, **Awaiting Evidence**, **Pending Approvals**, **Escalations**.
- Show the **AI Investigation Activity** live stream capturing real-time agent tool executions.
- Click the **Language Selector** `[ EN ▾ ]` in the top header and switch to **हिन्दी (Hindi)** or **日本語 (Japanese)**.
- Demonstrate that the **entire UI updates instantly (0ms latency)** without page reload.
- Switch back to English, toggle **Dark/Light Mode** seamlessly.

**Voiceover (Speaker):**
> *"Here on the Operations Dashboard, fraud teams get complete visibility: live KPI metrics, active escalations, and real-time agent execution streams.*
> 
> *Because global financial institutions operate across multiple jurisdictions, Sentinel AI features zero-latency multilingual support. With a single click in the top header, the entire interface instantly shifts to Hindi, Marathi, Japanese, German, Spanish, or French—with zero page reloads and zero latency."*

---

### SCENE 4: Golden Case Deep Dive (`CASE-10293`) & Next-Best-Action Evolution (`1:45 – 3:00`)
**Visual on Screen:**
- Click **"Open case"** or navigate to `CASE-10293` in the **Investigation Workspace** (`/investigations/CASE-10293`).
- **Step 1: Point to the Risk & Uncertainty Strip:**
  - Show Risk Level: `ELEVATED (72)` | Confidence: `62%` | Evidence Sufficiency: `INSUFFICIENT (AMBER)`.
- **Step 2: Interactive Relationship Graph:**
  - Click on the device node `D842` or card node on the visual topology. Show how graph connections highlight.
- **Step 3: Uncertainty Quantification:**
  - Show the **"Known vs Uncertain"** box: Known = card velocity; Uncertain = cardholder presence on new device fingerprint.
  - Show the callout: *"Why we are not acting yet: Awaiting definitive cardholder authentication."*
- **Step 4: Next-Best-Action (Pre-Evidence):**
  - Point to recommendation: `VERIFY_WITH_CUSTOMER` (Step-up authentication).
- **Step 5: Dynamic Action Execution:**
  - Click the primary action button: **"Request customer evidence"**.
  - A toast notification confirms: *"New evidence received: Customer denied transaction · Case reassessed"*.
- **Step 6: Real-Time Evolution:**
  - Show the confidence meter jump to **94%**!
  - Status changes to **`AWAITING_APPROVAL` / `FRAUD` (Red badge)**.
  - Next-Best-Action automatically updates to **`BLOCK_CARD`** under Policy Rule **R6**.
  - Show the `what_changed` delta explanation: *"Customer denial confirmed unauthorized transaction; shared entity graph links device across multiple cards."*
- **Step 7: Evidence Provenance:**
  - Click **"View evidence"** / **"Provenance"** drawer. Show the exact tool call: `TigerGraph GraphRAG (device_neighbors)` and timestamp.
  - Click **"Request approval"** to open the Supervisor escalation drawer.

**Voiceover (Speaker):**
> *"Now let's examine our golden benchmark case: **CASE-10293**.*
> 
> *Notice that Sentinel AI does **not** jump to conclusions. Here, an unauthorized $259.98 transaction occurred on a new device. The agent quantifies uncertainty: risk is elevated at 72%, but confidence is only 62%. Because evidence is insufficient, our deterministic policy engine prevents premature card blocking.*
> 
> *Instead, the agent recommends `VERIFY_WITH_CUSTOMER` and provides full interactive graph context from TigerGraph.*
> 
> *Watch what happens when we execute the evidence action: the customer receives an out-of-band prompt and denies authorizing the charge. Immediately, the LangGraph state machine re-evaluates: confidence spikes to **94%**, uncertainty is fully resolved, and the Next-Best-Action evolves into **`BLOCK_CARD`**.*
> 
> *Every single decision is grounded in TigerGraph graph provenance, complete with exact query timestamps and audit trails."*

---

### SCENE 5: Governance, Case Memory & FinCEN SAR Generation (`3:00 – 3:45`)
**Visual on Screen:**
- Navigate to **Approvals Hub** (`/approvals`):
  - Show pending supervisor items. Click **"Approve"** on the card block action. Show it move to `Executed`.
- Navigate to **Cases & Dossiers** (`/cases`):
  - Show the dossier grid and filter by `Device Farm Spoofing` and `High Exposure / SAR`.
  - Click **"SAR Template"** or **"SAR File"** on a high-exposure case.
  - Open the FinCEN Regulatory SAR drawer with the complete 5 W's narrative ready for FinCEN filing.
  - Click **"Copy SAR Dossier"** (toast shows *"Copied!"*).
- Navigate to **Case Memory** (`/memory`):
  - Point to **5,565 Graph-Indexed Closed Cases**.
  - Filter by pattern (e.g., `card_testing` or `account_takeover`).
  - Highlight the similarity match percentage (e.g., `92% match`) and shared graph signals.

**Voiceover (Speaker):**
> *"Enterprise compliance demands strict human-in-the-loop governance. In our **Approvals Hub**, policy-constrained actions are routed by exposure: Level 1 for supervisor sign-off, or Level 2 for risk committees. With one click, supervisors review the evidence chain and authorize the containment.*
> 
> *For regulatory reporting, Sentinel AI automatically drafts a comprehensive, audit-ready **FinCEN Suspicious Activity Report (SAR)** covering all five W's—Who, What, Where, When, and Why.*
> 
> *Crucially, resolved cases are written back into **TigerGraph Case Memory**. Over 5,500 historical cases are graph-indexed, enabling zero-shot similarity matching so analysts immediately leverage past institutional knowledge."*

---

### SCENE 6: 20-Case Benchmark Harness & Closing (`3:45 – 4:15`)
**Visual on Screen:**
- Navigate to the **Benchmark** tab (`/benchmark`).
- Point to the **20 official HHGOA exam cases**.
- Point to the metrics summary card: **20/20 Evaluated (100% processed)**, confirmed fraud count, cleared legitimate cases, and SAR filings.
- Click **"Deliverables"** on any case (e.g., `HHG-001`) to show the 3-part official deliverable:
  - Part 1: Case Record
  - Part 2: SAR Narrative
  - Part 3: Next-Best-Action Evolution (`what_changed`)
- Return to the Dashboard and show the platform logo.

**Voiceover (Speaker):**
> *"To prove institutional robustness, Sentinel AI features a built-in **HHGOA Benchmark Harness**. It evaluates all 20 official exam cases in parallel, validating 100% defensible verdicts, precision next-best-action trajectories, and standardized deliverables exported directly for review.*
> 
> *By unifying **TigerGraph's deep multi-hop graph intelligence** with **LangGraph's autonomous decision state machine**, Sentinel AI compresses hours of manual fraud analysis into seconds of decisive, compliant action.*
> 
> *Thank you, and welcome to the future of agentic fraud operations."*

---

## 💡 Top 5 Tips for a Flawless Video Recording

1. **Resolution & Audio:**
   - Record at **1080p (1920×1080)** or **1440p** at 60 FPS using OBS Studio or Loom.
   - Use a clean USB microphone or headset; avoid laptop mic echo.
2. **Clean Desktop & Browser:**
   - Hide browser bookmarks bar (`Ctrl+Shift+B` in Chrome).
   - Zoom browser to **100%** or **110%** for maximum legibility of table text and badges.
3. **Smooth Mouse Movement:**
   - Avoid rapid, erratic mouse circles. Guide the viewer's eye deliberately to the button or metric you are describing.
4. **Pacing:**
   - Speak with energy and clarity. Pause for half a second after major transitions (e.g., when the confidence meter jumps).
5. **Services Pre-Check:**
   - Ensure backend (`http://localhost:8001`) and frontend (`http://localhost:3000`) are running smoothly before hitting record!
