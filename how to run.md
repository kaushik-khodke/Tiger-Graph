# How to Run Sentinel AI

Sentinel AI is an Agentic Fraud Investigation & Next-Best-Action Platform built for the TigerGraph Agentic Fraud Investigation Hackathon (HHGOA).

---

## 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.10+
- **Docker & Docker Compose** (Optional, for containerized deployment)
- **Environment Configuration**:
  - Copy `.env.example` to `backend/.env` or `.env` and set your API keys as needed.

---

## 2. Option A: Running with Docker (Recommended for Deployment)

You can build and deploy both the FastAPI backend and Next.js frontend with a single command:

```bash
docker compose up --build
```

- **Frontend Web UI**: `http://localhost:3000`
- **Backend API Docs (Swagger UI)**: `http://localhost:8001/docs`
- **Health Check**: `http://localhost:8001/health`

To run in detached background mode:
```bash
docker compose up -d
```

To stop containers:
```bash
docker compose down
```

---

## 3. Option B: Running Locally

### Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Launch the FastAPI server with hot-reload:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```
   - **API Docs (Swagger UI)**: `http://localhost:8001/docs`
   - **Health Check**: `http://localhost:8001/health`

### Frontend Setup (Next.js)

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   - **Web UI**: `http://localhost:3000`

---

## 4. Running the Automated Test Suite

To verify all unit tests, policy engine checks, LangGraph state machine execution, and model router fallbacks from the project root:

```bash
python -m pytest backend/tests/ -v
```

All 19 test suites will run and pass:
- API endpoints (`test_api.py`)
- Golden Path CASE-10293 (`test_golden_case.py` & `test_langgraph_agent.py`)
- Model Router fallback & transient error detection (`test_model_router.py`)
- Deterministic Policy Engine R1 to R10 (`test_policy_engine.py`)
- Langfuse Observability & resilience (`test_langfuse_resilience.py`)

---

## 5. Validating the 20-Case Benchmark Submission

To run the strict submission validator across all 20 benchmark case answer files:

```bash
python scripts/validate_submission.py
```

All 20 case files in `cases/` will validate successfully with `RESULT: SUBMISSION READY`.

---

## 6. Running the Benchmark Evaluation

To execute the official 20-case HHGOA evaluation harness and re-generate the standardized answer files:

- **Via Frontend UI**:
  Navigate to `http://localhost:3000`, open the **Benchmark** tab in the sidebar, and click **Run All 20 Cases**.
  
- **Via API**:
  ```bash
  curl -X POST http://localhost:8001/api/benchmark/run-all
  ```

Output files with full case narratives, evidence claims, next-best-actions, and regulatory SARs are persisted to:
```
cases/<case_id>.json
```