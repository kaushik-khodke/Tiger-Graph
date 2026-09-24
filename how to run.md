# How to Run Sentinel AI

Sentinel AI is an Agentic Fraud Investigation & Next-Best-Action Platform built for the TigerGraph Agentic Fraud Investigation Hackathon (HHGOA).

---

## 1. Prerequisites
- **Node.js**: v18+ or v20+ or v22+ (`node --version`)
- **Python**: 3.10+ (`python --version`)
- **Docker & Docker Compose** (Optional, for containerized deployment)

---

## 2. Environment Configuration

1. In the `backend` directory, create a `.env` file (or copy from `.env.example`):
   - **PowerShell (Windows)**:
     ```powershell
     cd backend
     Copy-Item .env.example .env
     ```
   - **Bash (Linux / macOS)**:
     ```bash
     cd backend
     cp .env.example .env
     ```

2. (Optional) Add your Google Gemini API key and credentials:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is provided, Sentinel AI runs seamlessly in offline deterministic fallback mode for all 20 cases and 19 test suites.*

---

## 3. Option A: Running with Docker (Recommended for Production & Cloud)

Build and run both the FastAPI backend and Next.js frontend with a single command from the project root:

```bash
docker compose up --build
```

- **Frontend Web UI**: `http://localhost:3000`
- **Backend API Docs (Swagger UI)**: `http://localhost:8001/docs`
- **Health Check**: `http://localhost:8001/health`

To run in background mode:
```bash
docker compose up -d
```

To stop containers:
```bash
docker compose down
```

---

## 4. Option B: Running Locally

### Backend Setup (FastAPI)

1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Launch the FastAPI server with hot-reload:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```
   - **API Docs (Swagger UI)**: `http://localhost:8001/docs`
   - **Health Check**: `http://localhost:8001/health`

### Frontend Setup (Next.js)

1. Open a second terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   - **Web UI**: `http://localhost:3000`

---

## 5. Running the Automated Test Suite

To verify all 19 test suites including API endpoints, golden path investigations, policy engine rules (R1 to R10), model router fallbacks, and Langfuse resilience:

```bash
python -m pytest backend/tests -v
```

All 19 test suites will run and pass:
- API endpoints (`test_api.py`)
- Golden Path CASE-10293 (`test_golden_case.py` & `test_langgraph_agent.py`)
- Model Router fallback & transient error detection (`test_model_router.py`)
- Deterministic Policy Engine R1 to R10 (`test_policy_engine.py`)
- Langfuse Observability & resilience (`test_langfuse_resilience.py`)

---

## 6. Validating the 20-Case Benchmark Submission

To execute the strict submission validator across all 20 benchmark case answer files:

```bash
python scripts/validate_submission.py
```

All 20 case files in `cases/` will validate successfully with:
`RESULT: SUBMISSION READY`

---

## 7. Running the 20-Case Benchmark Evaluation

To execute the official 20-case HHGOA evaluation harness and re-generate standardized answer files:

- **Via Frontend UI**:
  Navigate to `http://localhost:3000/benchmark` and click **Run All Cases**.
  
- **Via CLI Script**:
  ```bash
  python scripts/run_benchmark.py
  python scripts/validate_submission.py
  ```

Output answer files are stored in:
```
cases/HHG-001.json ... cases/HHG-020.json
```
