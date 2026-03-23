from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Load model once at module import (singleton — avoids reloading per request)
logger.info("Initializing SentenceTransformer model (all-MiniLM-L6-v2)...")
_model = SentenceTransformer("all-MiniLM-L6-v2")
logger.info("SentenceTransformer model loaded successfully.")


def embed(texts: list[str]) -> np.ndarray:
    """Convert a list of texts into semantic embedding vectors."""
    return _model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
