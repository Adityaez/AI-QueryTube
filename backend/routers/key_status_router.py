"""
Key Status Router — exposes a health/monitoring endpoint for the API key pool.

GET /api/keys/status   → returns per-key health info (keys are partially masked)
GET /api/keys/summary  → aggregate counts only (no key values at all)
"""

from __future__ import annotations

import logging

from fastapi import APIRouter

logger = logging.getLogger(__name__)
router = APIRouter()


def _get_pool():
    from services.youtube_key_pool import get_youtube_pool
    return get_youtube_pool()


@router.get("/keys/status", summary="Per-key health status")
async def key_status():
    """
    Returns the health status of every API key in the YouTube pool.

    Key values are partially masked (e.g. `AIza...G6E`) so this
    endpoint is safe to expose on an internal admin route.
    """
    pool = _get_pool()
    statuses = pool.statuses()
    available = sum(1 for s in statuses if s["state"] == "active")

    return {
        "pool_size": pool.total_keys(),
        "available": available,
        "keys": statuses,
    }


@router.get("/keys/summary", summary="Aggregate pool health (no key values)")
async def key_summary():
    """Aggregate-only view — safe to expose publicly."""
    pool = _get_pool()
    statuses = pool.statuses()

    by_state: dict[str, int] = {}
    for s in statuses:
        state = s["state"]
        by_state[state] = by_state.get(state, 0) + 1

    return {
        "pool_size": pool.total_keys(),
        "by_state": by_state,
        "healthy": by_state.get("active", 0) > 0,
    }
