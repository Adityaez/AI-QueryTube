import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def rank_videos(
    query_embedding: np.ndarray,
    video_embeddings: np.ndarray,
    video_data: list[dict],
    top_k: int = 5,
) -> list[dict]:
    """
    Rank videos by cosine similarity between query and transcript embeddings.
    Returns the top_k most relevant videos with their scores.
    """
    if len(video_embeddings) == 0:
        return []

    # query_embedding shape: (1, dim) vs video_embeddings shape: (n, dim)
    scores = cosine_similarity(query_embedding.reshape(1, -1), video_embeddings)[0]

    # Zip scores with video metadata and sort descending
    scored_videos = sorted(
        zip(scores, video_data),
        key=lambda x: x[0],
        reverse=True,
    )

    results = []
    for score, video in scored_videos[:top_k]:
        results.append(
            {
                "video_id": video["video_id"],
                "title": video["title"],
                "thumbnail_url": video["thumbnail_url"],
                "similarity_score": round(float(score), 4),
            }
        )

    return results
