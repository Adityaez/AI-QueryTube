import pytest
import sys

with open("test_output.txt", "w", encoding="utf-8") as f:
    sys.stdout = f
    sys.stderr = f
    pytest.main(["-v", "tests/test_key_manager.py"])
