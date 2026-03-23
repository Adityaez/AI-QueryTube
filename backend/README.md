# AI QueryTube Backend

FastAPI-based semantic search engine backend.

## Setup

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

API will be available at: http://localhost:8000  
Docs at: http://localhost:8000/docs

## Environment Variables

Create a `.env` file (already included):
```
YOUTUBE_API_KEY=your_key_here
```
