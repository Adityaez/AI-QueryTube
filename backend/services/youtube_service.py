"""
youtube_service.py — YouTube Data API v3 wrapper with multi-key failover.

Key behaviour
-------------
* Acquires an available key from the shared `youtube_pool` (KeyManager).
* On HTTP 403 / 429 (quota / rate-limit) → marks key as failed/cooling-down
  and retries with the next key, up to the number of available keys.
* On success → marks key healthy so round-robin continues normally.
* If all keys are exhausted → returns [] (caller handles gracefully).
"""

from __future__ import annotations

import asyncio
import logging

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

logger = logging.getLogger(__name__)

# Import lazily to avoid circular-import issues at module load time
_pool = None


def _get_pool():
    global _pool
    if _pool is None:
        from services.youtube_key_pool import get_youtube_pool
        _pool = get_youtube_pool()
    return _pool


async def search_videos(topic: str, max_results: int = 10) -> list[dict]:
    """
    Search YouTube for *topic* and return a list of
    {video_id, title, thumbnail_url} dicts.

    Automatically rotates through all available API keys on quota / rate-limit
    errors before giving up.
    """
    pool = _get_pool()
    n_keys = pool.total_keys()

    for attempt in range(n_keys):
        key: str | None = None
        try:
            key = await pool.get_available_key()
        except RuntimeError:
            logger.error("All YouTube API keys exhausted — cannot fulfil request.")
            return []

        try:
            logger.info(
                "YouTube search attempt %d/%d using key %s | topic='%s'",
                attempt + 1, n_keys, _mask(key), topic,
            )

            # Build is CPU-bound/sync — wrap in thread to keep the event loop free
            response = await asyncio.to_thread(
                _execute_search, key, topic, max_results
            )

            await pool.mark_key_success(key)

            results: list[dict] = []
            for item in response.get("items", []):
                video_id = item["id"]["videoId"]
                snippet = item["snippet"]
                results.append(
                    {
                        "video_id": video_id,
                        "title": snippet["title"],
                        "thumbnail_url": snippet["thumbnails"]["high"]["url"],
                    }
                )

            logger.info(
                "YouTube search succeeded: %d results | key=%s",
                len(results), _mask(key),
            )
            return results

        except HttpError as http_err:
            status_code = http_err.resp.status
            is_rate_limit = status_code in (403, 429)

            logger.warning(
                "YouTube HttpError %d on key %s (attempt %d/%d): %s",
                status_code, _mask(key), attempt + 1, n_keys, str(http_err),
            )

            await pool.mark_key_failed(key, is_rate_limit=is_rate_limit)

            if attempt == n_keys - 1:
                logger.error(
                    "All %d key(s) failed for topic='%s'. Returning empty result.",
                    n_keys, topic,
                )
                return []
            # else: loop to next key

        except Exception as exc:
            logger.error(
                "Unexpected error on key %s (attempt %d/%d): %s",
                _mask(key), attempt + 1, n_keys, exc, exc_info=True,
            )
            if key:
                await pool.mark_key_failed(key, is_rate_limit=False)
            return []

    return []


def _execute_search(api_key: str, topic: str, max_results: int) -> dict:
    """Synchronous helper — called inside asyncio.to_thread."""
    youtube = build("youtube", "v3", developerKey=api_key)
    request = youtube.search().list(
        part="snippet",
        q=topic,
        type="video",
        maxResults=max_results,
        relevanceLanguage="en",
    )
    return request.execute()


def _mask(key: str) -> str:
    if len(key) <= 8:
        return "****"
    return f"{key[:4]}...{key[-4:]}"
