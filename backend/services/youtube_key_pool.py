"""
YouTube Key Pool — singleton factory.

Reads key config from environment variables and returns a shared KeyManager
instance.  Import `youtube_pool` wherever you need to acquire a YouTube key.

Environment variables
---------------------
YOUTUBE_API_KEYS          Comma-separated list of keys (preferred).
YOUTUBE_API_KEY           Single-key fallback.
API_KEY_STRATEGY          Rotation strategy (default: round_robin).
API_KEY_COOLDOWN_SECONDS  Cooldown TTL in seconds (default: 60).
API_KEY_MAX_FAILURES      Consecutive failures before key is marked 'failed'
                          (default: 3).
"""

from __future__ import annotations

import logging
import os
from typing import Optional

from dotenv import load_dotenv

from services.key_manager import KeyManager

load_dotenv()

logger = logging.getLogger(__name__)

_pool: Optional[KeyManager] = None


def _build_pool() -> KeyManager:
    """Parse env vars and construct the KeyManager."""
    # Prefer comma-separated multi-key env var
    raw_keys = os.getenv("YOUTUBE_API_KEYS", "")
    keys = [k.strip() for k in raw_keys.split(",") if k.strip()]

    # Fallback to single-key env var
    if not keys:
        single = os.getenv("YOUTUBE_API_KEY", "").strip()
        if single:
            keys = [single]

    if not keys:
        raise EnvironmentError(
            "No YouTube API keys found. "
            "Set YOUTUBE_API_KEYS (comma-separated) or YOUTUBE_API_KEY in your .env file."
        )

    strategy = os.getenv("API_KEY_STRATEGY", "round_robin").strip()
    cooldown = float(os.getenv("API_KEY_COOLDOWN_SECONDS", "60"))
    max_failures = int(os.getenv("API_KEY_MAX_FAILURES", "3"))

    logger.info(
        "YouTube key pool: %d key(s) loaded | strategy=%s | cooldown=%ss | max_failures=%d",
        len(keys), strategy, cooldown, max_failures,
    )

    return KeyManager(
        keys=keys,
        cooldown_seconds=cooldown,
        max_failures=max_failures,
        strategy=strategy,
    )


def get_youtube_pool() -> KeyManager:
    """Return the shared YouTube KeyManager instance (lazy singleton)."""
    global _pool
    if _pool is None:
        _pool = _build_pool()
    return _pool


# Convenience alias
youtube_pool = get_youtube_pool()
