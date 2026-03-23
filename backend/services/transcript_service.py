from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound


def get_transcript(video_id: str) -> str:
    """Fetch and join transcript for a YouTube video. Returns empty string on failure."""
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])
        text = " ".join([entry["text"] for entry in transcript_list])
        return text
    except (TranscriptsDisabled, NoTranscriptFound):
        return ""
    except Exception:
        return ""
