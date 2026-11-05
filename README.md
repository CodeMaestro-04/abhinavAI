# Abhinav AI — Digital Twin & Interactive Portfolio

An autonomous AI chatbot and digital twin representing **Abhinav Kumar Singh** (Full Stack Developer & 2026 B.Tech IT graduate). Built with Next.js, React, and Google Gemini API (Flash).

---

## 🚀 Features

- **Grounded AI Digital Twin:** Speaks in the first person ("I built...", "During my internship at EasyInsights...") with factual accuracy based on actual production code, repositories, and architecture.
- **Official Document Access:**
  - 📥 **Resume PDF Download:** Directly downloadable from the UI or via AI prompt.
  - 📜 **EasyInsights Internship Offer Letter:** Downloadable and viewable for verification.
- **Interactive UI:** Dark mode ChatGPT/Gemini-style layout with suggested interview prompt chips.
- **100% Free Stack:** Uses Google Gemini 1.5/2.0 Flash via Google AI Studio free tier (no credit card or paid tiers needed).

---

## 🛠️ Quick Start

### 1. Configure Your Gemini API Key
Add your API key copied from [Google AI Studio](https://aistudio.google.com/apikey) to `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
```
*(Or paste it directly into the browser settings modal on first load).*

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 1-Click Free Deployment to Vercel

1. Push this folder to your GitHub (`CodeMaestro-04/abhinav-ai`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Abhinav AI Digital Twin"
   git remote add origin https://github.com/CodeMaestro-04/abhinav-ai.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `abhinav-ai` repository.
4. Add the Environment Variable:
   - `GEMINI_API_KEY` = *your Gemini key*
5. Click **Deploy**!
