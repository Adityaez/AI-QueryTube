from pydantic import BaseModel, Field
from typing import List, Optional


class SearchRequest(BaseModel):
    topic: str = Field(..., min_length=1, description="YouTube search topic")
    question: str = Field(..., min_length=1, description="Natural language question")
    top_k: int = Field(default=5, ge=1, le=10, description="Number of top results to return")


class VideoResult(BaseModel):
    video_id: str
    title: str
    thumbnail_url: str
    similarity_score: float = 0.0


class SearchResponse(BaseModel):
    results: List[VideoResult] = []
    query_time_seconds: float = 0.0
    total_videos_analyzed: int = 0
    message: Optional[str] = None
