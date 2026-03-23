import asyncio
import time
import pytest

from services.key_manager import KeyManager, KeyState

@pytest.fixture
def pool():
    # 3 mock keys, 1-second cooldown for fast tests
    return KeyManager(
        keys=["key1", "key2", "key3"],
        cooldown_seconds=0.1,
        max_failures=2,
    )

@pytest.mark.asyncio
async def test_round_robin_rotation(pool: KeyManager):
    """Ensure keys rotate sequentially."""
    k1 = await pool.get_available_key()
    k2 = await pool.get_available_key()
    k3 = await pool.get_available_key()
    k4 = await pool.get_available_key()
    
    assert k1 == "key1"
    assert k2 == "key2"
    assert k3 == "key3"
    assert k4 == "key1"  # wraps around

@pytest.mark.asyncio
async def test_failure_cooldown_and_reactivation(pool: KeyManager):
    """Ensure rate-limited keys are skipped, then return after cooldown."""
    k1 = await pool.get_available_key()
    assert k1 == "key1"
    
    # Mark it rate-limited
    await pool.mark_key_failed(k1, is_rate_limit=True)
    
    # Next call should skip key1 and return key2
    k_next = await pool.get_available_key()
    assert k_next == "key2"
    
    # Wait out the 0.1s cooldown
    time.sleep(0.15)
    
    # We advanced past key2, so next is key3; then the cursor wraps to key1
    _k3 = await pool.get_available_key()
    assert _k3 == "key3"
    
    k_reused = await pool.get_available_key()
    assert k_reused == "key1"  # Back in action!

@pytest.mark.asyncio
async def test_max_failures_triggers_permanent_failure(pool: KeyManager):
    """Ensure keys that hard-fail repeatedly are permanently removed."""
    # Fail key1 twice (max_failures=2)
    await pool.mark_key_failed("key1", is_rate_limit=False)
    await pool.mark_key_failed("key1", is_rate_limit=False)
    
    # Should only round-robin between key2 and key3 now
    res1 = await pool.get_available_key()
    res2 = await pool.get_available_key()
    res3 = await pool.get_available_key()
    
    assert res1 == "key2"
    assert res2 == "key3"
    assert res3 == "key2"
    
    # Verify state in status
    statuses = pool.statuses()
    key1_status = statuses[0]  # key1 is at index 0
    assert key1_status["state"] == KeyState.FAILED.value

@pytest.mark.asyncio
async def test_success_resets_error_count(pool: KeyManager):
    """Ensure a successful call resets the error counter."""
    await pool.mark_key_failed("key1", is_rate_limit=False)
    
    statuses = pool.statuses()
    key1_status = statuses[0]  # key1 is at index 0
    assert key1_status["error_count"] == 1
    
    await pool.mark_key_success("key1")
    
    statuses = pool.statuses()
    key1_status = statuses[0]
    assert key1_status["error_count"] == 0

@pytest.mark.asyncio
async def test_all_keys_exhausted(pool: KeyManager):
    """Ensure RuntimeError is raised when no keys are available."""
    await pool.mark_key_failed("key1", is_rate_limit=True)
    await pool.mark_key_failed("key2", is_rate_limit=True)
    await pool.mark_key_failed("key3", is_rate_limit=True)
    
    with pytest.raises(RuntimeError, match="No API keys are currently available"):
        await pool.get_available_key()
