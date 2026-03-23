import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.search_router import router as search_router
from routers.key_status_router import router as key_status_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

app = FastAPI(
    title="AI QueryTube API",
    description="Semantic search engine for YouTube videos using SentenceTransformers",
    version="1.0.0",
)

# Allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search_router, prefix="", tags=["Search"])
app.include_router(key_status_router, prefix="/api", tags=["Key Management"])


@app.get("/")
async def root():
    return {"message": "AI QueryTube API is running. POST to /search to query."}


@app.get("/health")
async def health():
    return {"status": "ok"}
