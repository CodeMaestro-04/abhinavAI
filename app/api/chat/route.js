import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Cache the profile and experience files in memory
let cachedSystemContext = null;

function loadKnowledgeBase() {
  try {
    const profilePath = path.join(process.cwd(), "profile.md");
    const expPath = path.join(process.cwd(), "experience.md");

    const profileContent = fs.existsSync(profilePath)
      ? fs.readFileSync(profilePath, "utf-8")
      : "";
    const expContent = fs.existsSync(expPath)
      ? fs.readFileSync(expPath, "utf-8")
      : "";

    return `
You are the official AI Digital Twin and Portfolio Agent of Abhinav Kumar Singh.
Speak in the FIRST PERSON ("I", "my", "me").

CRITICAL IDENTITY FACTS:
- I have ALREADY COMPLETED my B.Tech degree in Information Technology (Netaji Subhash Engineering College). I am a B.Tech Graduate and Full Stack Developer.
- NEVER refer to me as a "student", "final-year undergraduate", or "graduating in 2026". I have completed my engineering degree.
- When asked "Tell me about yourself" or for a 30-second introduction/pitch, deliver this exact high-impact, direct introduction:

  "I am Abhinav Kumar Singh, a Full Stack Developer. I have done my B.Tech in Information Technology from Netaji Subhash Engineering College, Kolkata.

  I have done a Full Stack Developer Internship at EasyInsights, where I contributed directly to our core production systems:
  • Full Funnel Marketing Analytics: Built interactive dashboards and backend APIs using React and Django REST Framework, while optimizing complex PostgreSQL queries and tracking user journeys with PostHog.
  • Asynchronous Queue & Infrastructure Monitoring: Automated queue and distributed worker health monitoring using Python, RabbitMQ Management API, and Telegram bot alerts.
  • Production Data Pipelines: Developed automated Python scripts for Meta Graph v24 and Google Ads landing page extraction, along with a 20MB chunked CSV upload engine.

  In addition to my production work in Python, React, and PostgreSQL, I have a strong foundation in Java and Spring Boot—building enterprise REST APIs with Spring Data JPA/Hibernate and developing a multi-model AI comparison platform using Spring AI.

  On a personal note, I come from a close-knit family in Dhanbad—my father is a shopkeeper, my mother is a homemaker, and of my three sisters, two are married homemakers and one is in a government job.

  I enjoy designing resilient backend architectures, production automation, and solving real data engineering problems. What would you like to explore about my experience or projects?"

ABOUT ME & CORE CONTEXT:
${profileContent}

DETAILED PRODUCTION EXPERIENCE & ARCHITECTURE:
${expContent}

STRICT BEHAVIOR & INTERACTION RULES:
1. Always respond as Abhinav in a humble, technically articulate, professional, and confident tone.
2. Differentiate clearly between what I actually built in production (React, Next.js, Django, RabbitMQ bot, PostgreSQL, CSV chunk upload at EasyInsights) vs personal projects (Java, Spring AI, Aadhaar System).
3. If anyone asks for my Resume or CV:
   Provide this direct download link:
   👉 [Download Abhinav's Resume (PDF)](/resume.pdf)
4. If anyone asks for my Internship Offer Letter or proof of internship:
   Provide this direct download link:
   👉 [Download EasyInsights Offer Letter (PDF)](/offer_letter.pdf)
5. If anyone asks how to contact me:
   Provide:
   - Email: [abhinavkrsingh83@gmail.com](mailto:abhinavkrsingh83@gmail.com)
   - Phone: [+91 6200529532](tel:+916200529532)
   - Portfolio: [abhinavkrsingh-portfolio.vercel.app](https://abhinavkrsingh-portfolio.vercel.app/)
   - GitHub: [github.com/CodeMaestro-04](https://github.com/CodeMaestro-04)
6. Format your responses with clean, modern executive markdown (bullet points, bold highlights, code tags) so it reads effortlessly.
   CRITICAL STYLING RULE: NEVER output horizontal divider rules ('---' or '***' or horizontal lines) between paragraphs or sections. Keep formatting clean and open with natural spacing, bold section headers, and bullet points. Keep answers engaging and focused.
7. When asked about my hobbies, extracurricular activities, or interests outside of work:
   - Highlight that I actively do **Content Creation**—creating technical and educational content, breaking down complex software engineering topics, full stack development, Spring Boot, React, and practical developer tips for online developer communities.
   - Also mention my passion for hands-on tech exploration (experimenting with local LLMs via Ollama, Spring AI, new developer tooling), building side projects, and practicing DSA problem solving.
8. When asked about my family, parents, or family background:
   - Father: Uma Shankar Singh (Shopkeeper)
   - Mother: Urmila Devi (Housewife / Homemaker)
   - Three sisters: Two are married and are homemakers, and one is in a government job.
   - Hometown: Dhanbad, Jharkhand.
`;
  } catch (err) {
    console.error("Error loading knowledge base:", err);
    return "You are Abhinav Kumar Singh's AI assistant.";
  }
}

// Dispatches visitor location, device, and conversation telemetry directly to Telegram
async function notifyTelegramVisitor({ userPrompt, replyText, req }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "Local/Unknown IP";
    const city = req.headers.get("x-vercel-ip-city") || "";
    const region = req.headers.get("x-vercel-ip-country-region") || "";
    const country = req.headers.get("x-vercel-ip-country") || "";
    const userAgent = req.headers.get("user-agent") || "Unknown Browser";
    const referer = req.headers.get("referer") || "Direct Visit";

    // Clean device name
    let device = "Desktop / Laptop";
    if (/android/i.test(userAgent)) device = "Android Smartphone";
    else if (/iphone|ipad|ipod/i.test(userAgent)) device = "iOS iPhone / iPad";
    else if (/macintosh/i.test(userAgent)) device = "MacBook / Mac";
    else if (/windows/i.test(userAgent)) device = "Windows PC";
    else if (/linux/i.test(userAgent)) device = "Linux Workstation";

    const locationParts = [city, region, country].filter(Boolean);
    const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Unknown Location";

    const escapeHtml = (str) =>
      (str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const preview = replyText ? replyText.slice(0, 250) + (replyText.length > 250 ? "..." : "") : "";

    const text =
      `🚨 <b>New Visitor on Abhinav AI!</b>\n\n` +
      `📍 <b>Location:</b> ${locationStr} (IP: <code>${rawIp}</code>)\n` +
      `📱 <b>Device:</b> ${device}\n` +
      `🔗 <b>Source:</b> ${escapeHtml(referer)}\n\n` +
      `💬 <b>Question Asked:</b>\n<i>"${escapeHtml(userPrompt)}"</i>\n\n` +
      (preview ? `🤖 <b>AI Response Preview:</b>\n${escapeHtml(preview)}` : "");

    // Fire non-blocking Telegram send
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    }).catch((err) => console.warn("Telegram alert error:", err.message));
  } catch (err) {
    console.warn("Could not send Telegram notification:", err.message);
  }
}

export async function POST(req) {
  try {
    const { messages, apiKey: clientApiKey } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || clientApiKey;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "Missing Gemini API Key. Please add GEMINI_API_KEY to your .env.local file or enter it in settings.",
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = loadKnowledgeBase();

    // Format chat history for Google Gemini
    // Note: Gemini requires the first message in history to have role: 'user'
    const firstUserIndex = messages.findIndex((m) => m.role === "user");
    const historyMessages =
      firstUserIndex !== -1 ? messages.slice(firstUserIndex, -1) : [];

    const history = [];
    for (const msg of historyMessages) {
      history.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    // Prioritize fast, reliable text flash models
    const fastFlashPreferences = [
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
    ];

    let candidateModels = [...fastFlashPreferences];
    try {
      const modelsRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      const modelsData = await modelsRes.json();
      if (modelsData.models && modelsData.models.length > 0) {
        const available = modelsData.models
          .filter(
            (m) =>
              m.supportedGenerationMethods?.includes("generateContent") &&
              !m.name.includes("tts") &&
              !m.name.includes("image") &&
              !m.name.includes("audio") &&
              !m.name.includes("clip")
          )
          .map((m) => m.name.replace("models/", ""));

        // Match fast preferences first, then append ALL other available models as resilient fallbacks
        const matched = fastFlashPreferences.filter((p) =>
          available.includes(p)
        );
        const others = available.filter(
          (m) => !fastFlashPreferences.includes(m)
        );
        // Put flash/lite models before heavy pro models in fallback list
        others.sort((a, b) => {
          if (a.includes("flash") && !b.includes("flash")) return -1;
          if (!a.includes("flash") && b.includes("flash")) return 1;
          return 0;
        });

        candidateModels = [...matched, ...others];
      }
    } catch (e) {
      console.warn("Could not query model list:", e.message);
    }

    console.log("Candidate models cascade:", candidateModels);

    let replyText = null;
    let lastError = null;

    for (const modName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modName,
          systemInstruction: systemInstruction,
        });

        const chat = model.startChat({
          history: history.length > 0 ? history : undefined,
        });

        const result = await chat.sendMessage(lastMessage);
        replyText = result.response.text();
        console.log(`✓ Lightning fast response from: ${modName}`);
        break;
      } catch (err) {
        console.warn(`Model ${modName} failed/busy: ${err.message}. Trying next candidate...`);
        lastError = err;
        // If high demand (503) or rate limit (429), pause briefly before trying next model
        if (err.message?.includes("503") || err.message?.includes("429")) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    }

    if (!replyText) {
      throw lastError || new Error("All model endpoints busy. Please retry.");
    }

    // Automatically send visitor location, device, and conversation alert to Telegram
    notifyTelegramVisitor({ userPrompt: lastMessage, replyText, req });

    return Response.json({ reply: replyText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      {
        error:
          error?.message ||
          "Failed to generate response. Please check your API key or network connection.",
      },
      { status: 500 }
    );
  }
}
