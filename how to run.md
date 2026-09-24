# How to Run Sentinel AI

Sentinel AI is an Agentic Fraud Investigation & Next-Best-Action Platform built for the TigerGraph Agentic Fraud Investigation Hackathon (HHGOA).

---

## 1. Prerequisites
- **Node.js**: v18+ or v20+ or v22+ (`node --version`)
- **Python**: 3.10+ (`python --version`)
- **Git** (optional)

---

## 2. Environment Configuration

1. In the `backend` directory, create a `.env` file (or copy from `.env.example`):
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```
2. (Optional) Add your Google Gemini API key:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is provided, Sentinel AI runs seamlessly in offline deterministic fallback mode for all 20 cases and 19 test suites.*

---

## 3. Backend Setup & Startup (FastAPI)

1. Open a terminal in the project root:
   ```powershell
   cd backend
   ```

2. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Launch the FastAPI server with hot-reload:
   ```powershell
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```
   - **API Docs (Swagger UI)**: `http://localhost:8001/docs`
   - **Health Check**: `http://localhost:8001/health`

---

## 4. Frontend Setup & Startup (Next.js)

1. Open a second terminal:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Launch the Next.js development server:
   ```powershell
   npm run dev
   ```
   - **Web UI**: `http://localhost:3000`

---

## 5. Running the Automated Test Suite

To verify all 19 test suites including API endpoints, golden path investigations, policy engine rules (R1 to R10), model router fallbacks, and Langfuse resilience:

```powershell
python -m pytest backend/tests -v
```

---

## 6. Running the 20-Case Benchmark Evaluation

To execute the official 20-case HHGOA evaluation harness and validate the answer files:

- **Via Frontend UI**:
  Navigate to `http://localhost:3000/benchmark` and click **Run All Cases**.
  
- **Via CLI Script**:
  ```powershell
  python scripts/run_benchmark.py
  python scripts/finalize_submission.py
  python scripts/validate_submission.py
  ```

Output answer files are stored in:
```
cases/HHG-001.json ... cases/HHG-020.json
```