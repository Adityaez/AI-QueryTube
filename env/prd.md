# Product Requirements Document (PRD)

## Product Name
AI QueryTube

## Overview
AI QueryTube is an AI-powered semantic search engine for YouTube videos that enables users to search videos using natural language queries.

Traditional YouTube search relies heavily on keyword matching in titles, descriptions, and tags. This often fails when users ask conceptual questions.

AI QueryTube solves this by analyzing **video transcripts** and using **transformer-based semantic embeddings** to find videos that actually answer a user’s query.

The system retrieves the most relevant videos based on **semantic similarity between user queries and video transcripts.**

---

# Problem Statement

YouTube’s default search system primarily relies on keyword matching.

Problems with keyword search:
- Cannot understand the **intent of a query**
- Misses videos where the **meaning matches but wording differs**
- Difficult to find **specific explanations inside videos**

Example:

User query:
"How to build backend for ML application?"

A video titled:

"Deploy Machine Learning Models using FastAPI"

may not appear in keyword search but is actually relevant.

AI QueryTube addresses this gap using **semantic search technology.**

---

# Goals

### Primary Goals

• Build an AI-powered semantic search engine  
• Retrieve videos based on **meaning rather than keywords**  
• Return **Top-K most relevant results**  
• Provide a **simple web interface for searching videos**

### Secondary Goals

• Create a scalable backend API  
• Provide fast semantic retrieval  
• Demonstrate real-world NLP search applications

---

# Target Users

1. Students learning programming
2. Developers searching technical tutorials
3. Researchers looking for specific explanations
4. General YouTube viewers searching for knowledge content

---

# User Stories

### User Story 1
As a user, I want to type a question so that I can find videos explaining that concept.

### User Story 2
As a user, I want relevant video results so that I don't waste time watching unrelated content.

### User Story 3
As a developer, I want a fast and responsive interface to search YouTube videos.

---

# Functional Requirements

## Search Videos
The system should allow users to enter:

• A YouTube search topic  
• A natural language question

Example:

Topic: `FastAPI tutorial`  
Question: `How to deploy ML model with FastAPI?`

The system will return the **Top 5 semantically relevant videos.**

---

## Transcript Extraction
The system should:

• Retrieve transcripts using YouTube Transcript API  
• Store transcripts temporarily for analysis

---

## Semantic Embedding Generation

The system should convert:

• User queries  
• Video transcripts  

into **vector embeddings using SentenceTransformers.**

---

## Similarity Calculation

The system should calculate similarity using:

• Cosine Similarity

The system ranks videos based on similarity score.

---

## Result Display

Each result should show:

• Video title  
• YouTube thumbnail  
• Video embed preview  
• Similarity ranking

---

# Non Functional Requirements

### Performance
Search results should be returned within **3–6 seconds**

### Scalability
The system should support:

• multiple search requests  
• asynchronous API processing

### Usability
Interface must be:

• simple  
• responsive  
• beginner friendly

---

# Success Metrics

The product will be considered successful if:

• Top 5 results contain relevant videos  
• Query response time < 6 seconds  
• Users can find useful videos quickly

---

# Future Improvements

• Vector database (FAISS / Pinecone)
• Multi-channel search support
• Video summarization using LLMs
• Timestamp-based answer extraction
• Recommendation system