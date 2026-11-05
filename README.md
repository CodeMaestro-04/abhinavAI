# Abhinav AI — Digital Twin & Interactive Portfolio

[![Live Demo](https://img.shields.io/badge/Live_Demo-abhinav--ai--twin.vercel.app-2ea44f?style=for-the-badge&logo=vercel)](https://abhinav-ai-twin.vercel.app)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live_Site-0969da?style=for-the-badge&logo=google-chrome)](https://abhinavkrsingh-portfolio.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-Flash_AI-8e75ff?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![GitHub](https://img.shields.io/badge/GitHub-CodeMaestro--04-181717?style=for-the-badge&logo=github)](https://github.com/CodeMaestro-04)

An autonomous AI Digital Twin representing **Abhinav Kumar Singh** (Full Stack Developer & B.Tech IT Graduate from Netaji Subhash Engineering College, Kolkata; Ex-Intern at EasyInsights Pvt. Ltd.).

Built with **Next.js 14**, **React 18**, and **Google Gemini API** featuring an intelligent multi-model cascade architecture and first-person grounded responses.

---

## 🌟 Key Highlights & Features

- 🤖 **Authentic AI Persona:** Speaks in the first person (`"I am Abhinav..."`, `"I built..."`) with zero hallucination, grounded in real production engineering code, repositories, and architecture.
- ⚡ **Production Engineering Systems (EasyInsights):**
  - **RabbitMQ Automation & Telegram Bot:** Autonomous queue depth monitoring (`MAX_TASKS = 20`), distributed worker health telemetry, and real-time alerts dispatched via `python-telegram-bot` JobQueue (running every 60s).
  - **Full Funnel Marketing Analytics:** Interactive dashboards and backend APIs using React and Django REST Framework, optimizing complex PostgreSQL queries and tracking user journeys with PostHog.
  - **20MB Chunk CSV Upload Engine:** Client-side slice validation with server-side batch ingestion.
- 🛡️ **Resilient Multi-Model AI Cascade:** Backend architecture automatically cascades across Google Gemini models (`gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-3.1-flash-lite`) with automated exponential backoff to handle free-tier rate limits and 503 high-demand spikes seamlessly.
- 📄 **1-Click Official Document Access:**
  - 📥 [Download Updated Resume (PDF)](public/resume.pdf)
  - 📜 [Download Official EasyInsights Offer Letter (PDF)](public/offer_letter.pdf)
- 🎨 **Modern Executive UI:** Dark glassmorphic interface, segmented prompt categories (`Top Picks`, `Automation`, `EasyInsights`, `Projects`), 1-click clipboard copy, and stop/pause generation controls.
- 🎬 **Content Creation & Community:** Grounded with personal interests in tech content creation, open-source AI tooling (Spring AI, Ollama), and DSA problem solving.

---

## 🏗️ Technical Architecture

```
[ Visitor / Recruiter ]
          │
          ▼
[ Next.js 14 Frontend (React 18 + Custom CSS) ]
          │
          ▼  POST /api/chat
[ Next.js API Route (Edge/Node Runtime) ]
          │
          ├──> [ Knowledge Grounding Engine ] (profile.md + experience.md)
          │
          └──> [ Resilient Model Cascade ]
                     │
                     ├──> Gemini 3.7 Flash (Primary)
                     ├──> Gemini 3.6 Flash (Secondary)
                     ├──> Gemini 3.5 Flash (Fallback)
                     └──> Gemini 3.1 Flash-Lite (High Speed)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router), React 18 |
| **Styling** | Custom CSS3 Variables, Glassmorphism, Responsive Grid |
| **AI Integration** | Google Generative AI SDK (`@google/generative-ai`) |
| **Markdown Rendering** | `marked` |
| **Icons** | `lucide-react` |
| **Hosting & CI/CD** | Vercel |

---

## 🚀 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CodeMaestro-04/abhinavAI.git
   cd abhinavAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   *(Get your free key from [Google AI Studio](https://aistudio.google.com/apikey))*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Connect with Abhinav Kumar Singh

- 🌐 **Live AI Twin:** [abhinav-ai-twin.vercel.app](https://abhinav-ai-twin.vercel.app)
- 💼 **Portfolio:** [abhinavkrsingh-portfolio.vercel.app](https://abhinavkrsingh-portfolio.vercel.app/)
- 🐙 **GitHub:** [@CodeMaestro-04](https://github.com/CodeMaestro-04)
- 📧 **Email:** [abhinavkrsingh83@gmail.com](mailto:abhinavkrsingh83@gmail.com)
- 📍 **Location:** Dhanbad, Jharkhand, India
