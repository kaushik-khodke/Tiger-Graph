from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .services.data_service import data_service
from .services.memory_service import memory_service
from .api.routes import (
    cases, investigations, evidence, graph,
    recommendations, approvals, memory, audit,
    benchmark, health, mock_external
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Sentinel AI Backend] Initializing data services...")
    data_service.load_cases()
    memory_service.load_cases()
    print("[Sentinel AI Backend] Ready on port", settings.API_PORT)
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Sentinel AI — Agentic Fraud Investigation & Next-Best-Action Platform Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Next.js frontend & Vercel deployments
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if settings.FRONTEND_ORIGIN:
    for origin in settings.FRONTEND_ORIGIN.split(","):
        cleaned = origin.strip().rstrip("/")
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if "*" not in allowed_origins else ["*"],
    allow_origin_regex=r"^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(cases.router, prefix="/api")
app.include_router(investigations.router, prefix="/api")
app.include_router(evidence.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(approvals.router, prefix="/api")
app.include_router(memory.router, prefix="/api")
app.include_router(audit.router, prefix="/api")
app.include_router(benchmark.router, prefix="/api")
app.include_router(mock_external.router, prefix="/api")
app.include_router(health.router, prefix="/health")
app.include_router(health.router, prefix="/api/health")

@app.get("/")
def root():
    return {
        "app": "Sentinel AI Backend",
        "status": "online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
