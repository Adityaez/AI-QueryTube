import time
import asyncio
import logging
import numpy as np
from fastapi import APIRouter, HTTPException

from models.schemas import SearchRequest, SearchResponse, VideoResult
from services.youtube_service import search_videos
from services.transcript_service import get_transcript
from services.embedding_service import embed
from services.similarity_service import rank_videos

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    try:
        start_time = time.time()
        logger.info(
            f"Received search request - Topic: '{request.topic}', Question: '{request.question}'"
        )

        # 1. Search YouTube for videos matching the topic
        videos = await search_videos(request.topic, max_results=10)
        if not videos:
            logger.warning(f"No videos found for topic: '{request.topic}'")
            raise HTTPException(status_code=404, detail="No videos found for this topic.")

        logger.info(f"Found {len(videos)} videos. Fetching transcripts concurrently...")

        # 2. Fetch transcripts for each video concurrently
        transcript_tasks = [
            asyncio.to_thread(get_transcript, video["video_id"]) for video in videos
        ]
        fetched_transcripts = await asyncio.gather(*transcript_tasks)

        videos_with_transcripts = []
        transcripts = []
        for video, transcript in zip(videos, fetched_transcripts):
            if transcript:
                videos_with_transcripts.append(video)
                transcripts.append(transcript)

        logger.info(
            f"Transcripts fetched: {len(transcripts)} available out of {len(videos)} videos."
        )

        # --- Graceful fallback: no transcripts available ---
        if not videos_with_transcripts:
            elapsed = round(time.time() - start_time, 2)
            logger.warning(
                f"No transcripts found for any of the {len(videos)} videos on topic "
                f"'{request.topic}'. Returning basic video metadata without semantic ranking."
            )
            fallback_results = [
                VideoResult(
                    video_id=v["video_id"],
                    title=v["title"],
                    thumbnail_url=v["thumbnail_url"],
                    similarity_score=0.0,
                )
                for v in videos[: request.top_k]
            ]
            response = SearchResponse(
                results=fallback_results,
                query_time_seconds=elapsed,
                total_videos_analyzed=0,
                message=(
                    "No transcripts were available for these videos. "
                    "Showing results without semantic ranking."
                ),
            )
            logger.info(
                f"Fallback response prepared: {len(fallback_results)} videos in {elapsed}s."
            )
            return response

        logger.info(
            f"Successfully fetched {len(transcripts)} transcripts. Generating embeddings..."
        )

        # 3. Embed query + transcripts, then rank — wrapped in try/except for safety
        try:
            texts_to_embed = [request.question] + transcripts
            embeddings = await asyncio.to_thread(embed, texts_to_embed)

            query_embedding = embeddings[0]    # shape: (dim,)
            video_embeddings = embeddings[1:]  # shape: (n, dim)

            logger.info("Embeddings generated. Ranking videos by semantic similarity...")

            # 4. Rank videos by cosine similarity
            ranked = await asyncio.to_thread(
                rank_videos,
                query_embedding,
                video_embeddings,
                videos_with_transcripts,
                request.top_k,
            )

            elapsed = round(time.time() - start_time, 2)
            logger.info(
                f"Search completed in {elapsed}s for topic: '{request.topic}'. "
                f"Ranked {len(ranked)} videos out of {len(videos_with_transcripts)} with transcripts."
            )

            response = SearchResponse(
                results=[VideoResult(**r) for r in ranked],
                query_time_seconds=elapsed,
                total_videos_analyzed=len(videos_with_transcripts),
            )
            logger.info(
                f"Final response: {len(response.results)} results, query_time={elapsed}s"
            )
            return response

        except Exception as embed_err:
            # Embedding or ranking failed — fall back to unranked video metadata
            elapsed = round(time.time() - start_time, 2)
            logger.error(
                f"Embedding/ranking step failed for topic '{request.topic}': {embed_err}. "
                "Falling back to unranked video metadata.",
                exc_info=True,
            )
            fallback_results = [
                VideoResult(
                    video_id=v["video_id"],
                    title=v["title"],
                    thumbnail_url=v["thumbnail_url"],
                    similarity_score=0.0,
                )
                for v in videos_with_transcripts[: request.top_k]
            ]
            response = SearchResponse(
                results=fallback_results,
                query_time_seconds=elapsed,
                total_videos_analyzed=len(videos_with_transcripts),
                message="Semantic ranking unavailable. Showing unranked results.",
            )
            logger.info(
                f"Fallback response (embed error): {len(fallback_results)} results in {elapsed}s."
            )
            return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Unexpected error during search for '{request.topic}': {str(e)}", exc_info=True
        )
        raise HTTPException(status_code=500, detail="Internal server error during search.")
