<div align="center">

  <!-- You can replace this hero image with an actual screenshot or logo! -->
  <img src="./frontend/src/assets/hero.png" alt="AI-QueryTube Hero" width="200" style="border-radius: 20px;"/>

  # 🚀 AI-QueryTube 🎥✨
  
  **The ultimate, AI-powered semantic search engine for YouTube.** <br>
  Stop scrubbing through timelines. Start finding exactly what you need, *instantly*.

  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  [**Explore the Docs**](#) • [**Report Bug**](#) • [**Request Feature**](#)
</div>

---

## 🤯 What is this witchcraft?

Have you ever watched a 45-minute tutorial to find one specific 10-second explanation? Yeah, us too. It sucks. 

**AI-QueryTube** is a blazing-fast, dual-stack powerhouse that takes a YouTube video, rips out the transcript, generates high-dimensional embeddings on the fly, and lets you do semantic searches against the video's actual content. It understands *meaning*, so you can ask it a question in plain English and it'll jump straight to the exact timestamp you need.

## ✨ Crazy Features

- 🧠 **Smart Semantic Search**: Powered by State-of-the-Art Transformer models. Don't search for keywords. Search for *concepts*.
- 🔄 **Indestructible API Key Pool**: We built an enterprise-grade round-robin YouTube API key manager. Dead keys? Rate limited? Who cares. We handle failovers, exponential backoffs, and cooldowns automatically.
- 🎨 **Gorgeous, Premium UI**: Glassmorphism. Buttery micro-animations. A custom hyper-smooth cursor follower. You'll want to lick the screen. 
- ⚡ **Lightning Fast Backend**: Built on FastAPI, leveraging async processing to keep up with giant text transcripts. 

---

## 🛠️ The Tech Stack

**Frontend (The Pretty Stuff):**
- React + Vite ⚡
- TailwindCSS 💨
- Pure UI/UX Magic ✨

**Backend (The Brains):**
- Python 🐍
- FastAPI 🚀
- Hugging Face Transformers 🤗
- YouTube Transcript API 📝

---

## 🔥 Getting Started

Want to run this beast locally? Grab a coffee and follow along.

### 1. Clone the repo
```bash
git clone https://github.com/Adityaez/AI-QueryTube.git
cd AI-QueryTube
```

### 2. Ignite the Backend
```bash
cd backend
python -m venv env
# On Mac/Linux: source env/bin/activate
# On Windows:
env\Scripts\activate

pip install -r requirements.txt
```
*Don't forget your `.env` file!* Setup your YouTube API keys and fire it up:
```bash
uvicorn main:app --reload
```

### 3. Spark the Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Witness the Magic 🪄
Open your browser to `http://localhost:5173` and start questioning your YouTube videos!

---

## 🤝 Contributing
Found a bug? Want to make the UI even crazier? 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <b>Built with ❤️ and way too much caffeine by <a href="https://github.com/Adityaez">Adityaez</a></b>
</div>
