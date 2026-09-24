# How to Run Sentinel AI

Sentinel AI is an Agentic Fraud Investigation & Next-Best-Action Platform built for the TigerGraph Agentic Fraud Investigation Hackathon (HHGOA).

---

## 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.10+
- **Environment Configuration**:
  - `backend/.env` contains your Gemini API keys and Langfuse credentials.
  - (Optional) `.env.example` provides template configurations.

---

## 2. Backend Setup & Startup (FastAPI)

1. Open a terminal in the `backend` directory:
   ```powershell
   cd "d:\Downloads\tiger trace\backend"
   ```

2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Launch the FastAPI server with hot-reload:
   ```powershell
   uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```
   - **API Docs (Swagger UI)**: `http://localhost:8001/docs`
   - **Health Check**: `http://localhost:8001/health`

---

## 3. Frontend Setup & Startup (Next.js)

1. Open a second terminal in the `frontend` directory:
   ```powershell
   cd "d:\Downloads\tiger trace\frontend"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Launch the development server:
   ```powershell
   npm run dev
   ```
   - **Web UI**: `http://localhost:3000`

---

## 4. Running the Automated Test Suite

To verify all unit tests, policy engine checks, LangGraph state machine execution, and model router fallbacks:

```powershell
cd "d:\Downloads\tiger trace\backend"
py -m pytest tests/ -v
```

All 19 test suites will run and pass:
- API endpoints (`test_api.py`)
- Golden Path CASE-10293 (`test_golden_case.py` & `test_langgraph_agent.py`)
- Model Router 5-tier fallback & error detection (`test_model_router.py`)
- Deterministic Policy Engine R1 to R10 (`test_policy_engine.py`)
- Langfuse Observability & resilience (`test_langfuse_resilience.py`)

---

## 5. Running the 20-Case Benchmark Evaluation

To execute the official 20-case HHGOA evaluation harness and generate the standardized answer files:

- **Via Frontend UI**:
  Navigate to `http://localhost:3000` and click the **Benchmark** tab in the sidebar. Click **Run All Cases** to execute the entire benchmark batch.
  
- **Via API**:
  ```powershell
  curl -X POST http://localhost:8001/api/benchmark/run-all
  ```

Output files with full case narratives, evidence claims, next-best-actions, and regulatory SARs are persisted to:
```
d:\Downloads\tiger trace\cases\<case_id>.json
```