# Technology Stack

This document explains the technologies used in AI QueryTube and the reasoning behind each choice.

---

# Architecture Overview

AI QueryTube follows a **Full Stack AI Application Architecture**

Frontend → Backend API → NLP Processing → External APIs

Workflow:

User Query → React UI → FastAPI Backend → NLP Model → YouTube APIs → Ranked Results

---

# Frontend

## React.js

Purpose:
Build an interactive user interface for searching videos.

Why React?

• Component-based architecture  
• Fast rendering using virtual DOM  
• Large ecosystem  
• Ideal for SPA applications

---

## Tailwind CSS

Purpose:
Styling UI components quickly.

Why Tailwind?

• Utility-first styling  
• Rapid UI development  
• Clean modern design

---

## Axios

Purpose:
HTTP client used to communicate with backend API.

Example:

Frontend sends request:

POST /search

to FastAPI backend.

---

# Backend

## FastAPI

Purpose:
Backend framework for building APIs.

Why FastAPI?

• High performance  
• Async support  
• Automatic API documentation  
• Ideal for ML applications

---

## Uvicorn

Purpose:
ASGI server used to run FastAPI applications.

Benefits:

• High performance
• Asynchronous request handling

---

# Machine Learning

## Sentence Transformers

Library used to generate semantic embeddings.

Model used:

all-MiniLM-L6-v2

Why this model?

• Fast inference
• Small model size (~80MB)
• Good semantic similarity performance

---

## PyTorch

Deep learning framework used to run transformer models.

---

## Scikit-learn

Used for similarity calculations.

Main algorithm used:

Cosine Similarity

Formula:

similarity(A,B) = (A · B) / (||A|| ||B||)

---

# External APIs

## YouTube Data API v3

Used to:

• Search videos
• Retrieve video metadata
• Fetch video titles

---

## YouTube Transcript API

Used to:

• Extract video transcripts
• Retrieve captions automatically

---

# Project Structure
