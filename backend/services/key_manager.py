"""
Key Manager — production-ready API key pool with:
  • Round-robin rotation
  • Automatic cooldown on rate-limit (429) errors
  • Per-key failure tracking → permanent 'failed' state
  • asyncio.Lock to prevent race conditions under concurrent requests
  • get_available_key / mark_key_failed / mark_key_success public API
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional

logger = logging.getLogger(__name__)


class KeyState(str, Enum):
    ACTIVE = "active"
    COOLING_DOWN = "cooling_down"
    FAILED = "failed"


@dataclass
class KeyEntry:
    key: str
    state: KeyState = KeyState.ACTIVE
    error_count: int = 0
    cooldown_until: float = 0.0          # epoch seconds
    last_used: float = 0.0               # epoch seconds
    total_requests: int = 0
    total_errors: int = 0
    priority: int = 0                    # lower number = higher priority

    # ── display helpers ──────────────────────────────────────────────────────
    @property
    def masked(self) -> str:
        """Return a partially hidden key for logs / status endpoint."""
        if len(self.key) <= 8:
            return "****"
        return f"{self.key[:4]}...{self.key[-4:]}"

    @property
    def is_available(self) -> bool:
        return self.state == KeyState.ACTIVE

    def to_status_dict(self) -> dict:
        remaining = max(0.0, round(self.cooldown_until - time.time(), 1))
        return {
            "key": self.masked,
            "state": self.state.value,
            "error_count": self.error_count,
            "total_requests": self.total_requests,
            "total_errors": self.total_errors,
            "cooldown_remaining_seconds": remaining if self.state == KeyState.COOLING_DOWN else 0,
            "last_used": round(self.last_used, 2) if self.last_used else None,
            "priority": self.priority,
        }


class KeyManager:
    """
    Thread/coroutine-safe API key pool.

    Usage
    -----
    pool = KeyManager(keys=["k1", "k2"], cooldown_seconds=60, max_failures=3)
    key = await pool.get_available_key()
    try:
        result = call_api(key)
        await pool.mark_key_success(key)
    except RateLimitError:
        await pool.mark_key_failed(key, is_rate_limit=True)
    """

    def __init__(
        self,
        keys: List[str],
        cooldown_seconds: float = 60.0,
        max_failures: int = 3,
        strategy: str = "round_robin",
    ) -> None:
        if not keys:
            raise ValueError("KeyManager requires at least one API key.")

        # Deduplicate while preserving order
        seen: set[str] = set()
        unique_keys: List[str] = []
        for k in keys:
            k = k.strip()
            if k and k not in seen:
                seen.add(k)
                unique_keys.append(k)

        self._entries: List[KeyEntry] = [KeyEntry(key=k) for k in unique_keys]
        self._cooldown_seconds = cooldown_seconds
        self._max_failures = max_failures
        self._strategy = strategy
        self._rr_index: int = 0          # round-robin cursor
        self._lock = asyncio.Lock()

        logger.info(
            "KeyManager initialised — %d key(s), strategy=%s, "
            "cooldown=%ss, max_failures=%s",
            len(self._entries), strategy, cooldown_seconds, max_failures,
        )

    # ── public API ───────────────────────────────────────────────────────────

    async def get_available_key(self) -> str:
        """
        Return the next available key string.

        Raises RuntimeError if no keys are available.
        """
        async with self._lock:
            self._reactivate_cooled_keys()
            key = self._pick_key()
            if key is None:
                raise RuntimeError(
                    "No API keys are currently available. "
                    "All keys are either cooling down or permanently failed."
                )
            entry = self._entry_for(key)
            entry.last_used = time.time()
            entry.total_requests += 1
            logger.debug("Using key %s (state=%s)", entry.masked, entry.state)
            return key

    async def mark_key_failed(self, key: str, is_rate_limit: bool = False) -> None:
        """
        Record a failure for *key*.

        - is_rate_limit=True  → put the key in cooldown for `cooldown_seconds`.
        - Repeated failures   → transition to `failed` once `max_failures` reached.
        """
        async with self._lock:
            entry = self._entry_for(key)
            if entry is None:
                logger.warning("mark_key_failed called with unknown key.")
                return

            entry.error_count += 1
            entry.total_errors += 1

            if is_rate_limit:
                entry.state = KeyState.COOLING_DOWN
                entry.cooldown_until = time.time() + self._cooldown_seconds
                logger.warning(
                    "Key %s rate-limited → cooling down for %ss.",
                    entry.masked, self._cooldown_seconds,
                )
            elif entry.error_count >= self._max_failures:
                entry.state = KeyState.FAILED
                logger.error(
                    "Key %s exceeded max_failures (%d) → marked FAILED.",
                    entry.masked, self._max_failures,
                )
            else:
                logger.warning(
                    "Key %s error %d/%d.",
                    entry.masked, entry.error_count, self._max_failures,
                )

    async def mark_key_success(self, key: str) -> None:
        """Reset error count for *key* and ensure it is active."""
        async with self._lock:
            entry = self._entry_for(key)
            if entry is None:
                return
            entry.error_count = 0
            entry.state = KeyState.ACTIVE
            logger.debug("Key %s marked success.", entry.masked)

    async def available_count(self) -> int:
        """Return how many keys are currently usable."""
        async with self._lock:
            self._reactivate_cooled_keys()
            return sum(1 for e in self._entries if e.is_available)

    def statuses(self) -> list[dict]:
        """Return per-key health snapshot (safe to expose via API)."""
        return [e.to_status_dict() for e in self._entries]

    def total_keys(self) -> int:
        return len(self._entries)

    # ── internals ────────────────────────────────────────────────────────────

    def _reactivate_cooled_keys(self) -> None:
        """Called while holding _lock. Reactivate keys whose TTL has expired."""
        now = time.time()
        for entry in self._entries:
            if entry.state == KeyState.COOLING_DOWN and now >= entry.cooldown_until:
                entry.state = KeyState.ACTIVE
                entry.error_count = 0
                logger.info("Key %s cooldown expired → reactivated.", entry.masked)

    def _pick_key(self) -> Optional[str]:
        """Pick the next available key using the configured strategy."""
        if self._strategy == "round_robin":
            return self._round_robin()
        # Default fallback
        return self._round_robin()

    def _round_robin(self) -> Optional[str]:
        """
        Standard round-robin: iterate from current cursor, wrap around once.
        Returns None if no active key exists.
        """
        n = len(self._entries)
        for offset in range(n):
            idx = (self._rr_index + offset) % n
            if self._entries[idx].is_available:
                self._rr_index = (idx + 1) % n   # advance cursor past chosen key
                return self._entries[idx].key
        return None

    def _entry_for(self, key: str) -> Optional[KeyEntry]:
        for e in self._entries:
            if e.key == key:
                return e
        return None
