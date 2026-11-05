"use client";

import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import {
  Send,
  Download,
  FileText,
  Github,
  Globe,
  Mail,
  Phone,
  Sparkles,
  User,
  Key,
  ExternalLink,
  MapPin,
  Briefcase,
  Code2,
  ChevronRight,
  Linkedin,
  Copy,
  Check,
  Square,
  Zap,
  X,
  MessageSquare,
  RotateCcw,
  CornerDownLeft,
  Menu,
} from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hi! I am the AI Digital Twin of Abhinav Kumar Singh.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(idx);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const handleUsePrompt = (text) => {
    setInput(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      // Remove the last error AI message if present
      const cleanMessages = messages.filter(
        (m, i) => i !== messages.length - 1 || !m.content.startsWith("⚠️ **Error:")
      );
      setMessages(cleanMessages);
      handleSend(lastUserMsg.content);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customPrompt) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    // Immediately clear input and resize textarea
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessage = {
      role: "user",
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && data.error.includes("Missing Gemini API Key")) {
          setShowKeyModal(true);
        }
        throw new Error(data.error || "Failed to fetch response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      if (err.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "*(Response paused/stopped)*",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `⚠️ **Error:** ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent?.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
    setShowKeyModal(false);
  };

  const renderMarkdown = (content) => {
    let rawHtml = marked.parse(content || "");
    // Ensure ALL anchor links open in a new tab so chat session is never lost
    rawHtml = rawHtml.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/gi, (match, href, rest) => {
      const cleanRest = rest
        .replace(/target="[^"]*"/gi, "")
        .replace(/rel="[^"]*"/gi, "")
        .trim();
      return `<a href="${href}" target="_blank" rel="noopener noreferrer"${cleanRest ? " " + cleanRest : ""}>`;
    });
    return { __html: rawHtml };
  };

  // Structured categories to prevent sidebar clutter
  const categories = {
    overview: {
      name: "⭐ Overview",
      questions: [
        {
          label: "⚡ Tell me about yourself (30-second pitch)",
          prompt: "Tell me about yourself (30-second pitch)",
        },
        {
          label: "🌐 Can you share your live portfolio link?",
          prompt: "Can you share your live portfolio website link and tell me about it?",
        },
        {
          label: "🐰 RabbitMQ Telegram Bot Automation",
          prompt: "Explain your RabbitMQ queue monitoring and Telegram alert bot at EasyInsights. How did you monitor workers and DB errors?",
        },
        {
          label: "📊 Full Funnel Marketing Analytics Dashboard",
          prompt: "Explain your work on the Full Funnel Overview module at EasyInsights. What was the architecture and your implementation?",
        },
        {
          label: "📄 Can I download your resume?",
          prompt: "Can I download your resume?",
        },
      ],
    },
    automation: {
      name: "⚡ Automation",
      questions: [
        {
          label: "📋 Full Project Summary & Setup (All Details)",
          prompt: "Give me a complete summary of the RabbitMQ Telegram Bot project with all details, including Executive summary, Technical architecture, Key operational metrics, and the STAR method interview summary.",
        },
        {
          label: "⚡ How did you automate queue monitoring via Telegram?",
          prompt: "How did you automate EasyInsights' backend operations using the Telegram Bot and RabbitMQ? Explain how this replaced manual monitoring.",
        },
        {
          label: "🚨 How does the bot detect worker bottlenecks & alert?",
          prompt: "Explain how your Telegram bot autonomously detects worker bottlenecks, queue depth spikes, and dispatches recovery alerts.",
        },
        {
          label: "🔍 How does the bot report live PostgreSQL errors?",
          prompt: "How did you integrate PostgreSQL error telemetry into automated Telegram bot commands for live developer debugging?",
        },
      ],
    },
    experience: {
      name: "💼 Experience",
      questions: [
        {
          label: "📊 How did you build the Full Funnel Overview dashboard?",
          prompt: "Explain your work on the Full Funnel Overview module at EasyInsights. What was the architecture and your implementation?",
        },
        {
          label: "📁 How did you build the 20MB chunk CSV uploader?",
          prompt: "Explain how you built the 20MB chunk CSV file upload and import history system at EasyInsights.",
        },
        {
          label: "🔌 What ad and CRM APIs did you integrate?",
          prompt: "What external API integrations did you build at EasyInsights (Meta Graph v24, Google Ads, Zoho CRM, Meritto)?",
        },
        {
          label: "📜 Can I see your EasyInsights Offer Letter?",
          prompt: "Can I see your EasyInsights Offer Letter?",
        },
      ],
    },
    projects: {
      name: "🚀 Projects",
      questions: [
        {
          label: "🤖 Tell me about your Multi SpringAI Chat App",
          prompt: "Tell me in detail about your Multi SpringAI Chat App. How did you integrate multiple LLMs with Spring Boot and React?",
        },
        {
          label: "🛡️ How did you build the Aadhaar Authentication System?",
          prompt: "Explain your Aadhaar Management & Authentication System project. What was the Spring Boot and MySQL architecture?",
        },
        {
          label: "🎬 What are your hobbies & content creation interests?",
          prompt: "What are your hobbies, extracurricular activities, and content creation work outside of software development?",
        },
      ],
    },
  };

  return (
    <div className="layout-container">
      {/* 1. Sleek, Uncluttered Sidebar (Responsive Drawer on Mobile) */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Mobile-Only Close Header */}
        <div className="mobile-sidebar-header">
          <span className="mobile-sidebar-title">Menu & Profile</span>
          <button
            className="mobile-sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
            title="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar-wrapper">
            <img src="/profile.jpg?v=ai" alt="Abhinav Kumar Singh" className="avatar-img" />
            <span className="online-badge" title="AI Avatar Live"></span>
          </div>
          <h1 className="profile-name">Abhinav Kumar Singh</h1>
          <p className="profile-tagline">
            Full Stack Developer • B.Tech IT Graduate<br />
            Ex-Intern at <strong>EasyInsights</strong>
          </p>
        </div>

        {/* Action Buttons: Resume & Contact Modal */}
        <div className="sidebar-actions">
          <a
            href="/resume.pdf"
            download="Abhinav_Kumar_Singh_Resume.pdf"
            className="btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            <Download size={15} />
            Download Resume (PDF)
          </a>

          <button
            onClick={() => setShowContactModal(true)}
            className="btn-secondary"
            style={{ width: "100%", cursor: "pointer" }}
          >
            <Phone size={14} />
            Contact Info & Links
          </button>
        </div>

        {/* Clean Segmented Filter Tabs (Prevents long scroll) */}
        <div style={{ marginTop: "4px" }}>
          <div className="sidebar-tabs">
            {Object.keys(categories).map((catKey) => (
              <button
                key={catKey}
                onClick={() => setActiveTab(catKey)}
                className={`tab-btn ${activeTab === catKey ? "active" : ""}`}
              >
                {categories[catKey].name.split(" ")[1] || categories[catKey].name}
              </button>
            ))}
          </div>
        </div>

        {/* Only 3-4 sleek question pills displayed based on active tab */}
        <div style={{ marginTop: "2px" }}>
          <div className="prompt-list">
            {categories[activeTab].questions.map((q, idx) => (
              <button
                key={idx}
                className="prompt-pill"
                onClick={() => {
                  handleSend(q.prompt);
                  setMobileMenuOpen(false);
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Social Links & Settings Footer */}
        <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
          <div className="social-links" style={{ marginBottom: "10px" }}>
            <a
              href="https://github.com/CodeMaestro-04"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://abhinavkrsingh-portfolio.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              title="Live Portfolio"
            >
              <Globe size={16} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <button
              onClick={() => setShowContactModal(true)}
              className="social-icon-btn"
              title="Email & Phone"
            >
              <Mail size={16} />
            </button>
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.76rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Key size={13} />
            {apiKey ? "Gemini Key Configured ✓" : "Configure API Key"}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Chat View */}
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <div className="header-title-box">
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              title="Open Navigation Menu & Profile"
            >
              <Menu size={18} />
            </button>
            <span className="status-dot"></span>
            <div>
              <div className="header-title">Abhinav AI • Digital Twin</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setShowContactModal(true)}
              className="btn-secondary"
              style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer" }}
            >
              <Phone size={13} /> Contact
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              className="btn-primary"
              style={{ padding: "6px 12px", fontSize: "0.8rem" }}
            >
              <Download size={13} /> Resume
            </a>
          </div>
        </header>

        {/* Messages Container */}
        <div className="messages-container">
          {/* Conversation Messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.role}`}>
              <div className={`msg-avatar ${msg.role}`}>
                {msg.role === "ai" ? (
                  <img src="/profile.jpg?v=ai" alt="Abhinav" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className="msg-content-wrapper">
                <div
                  className="msg-bubble"
                  dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                />
                <div className="msg-toolbar">
                  <span className="msg-time">{msg.time}</span>
                  {index > 0 && (
                    <button
                      className="msg-action-btn"
                      title="Copy full message to clipboard"
                      onClick={() => handleCopyMessage(msg.content, index)}
                    >
                      {copiedMsgIdx === index ? (
                        <>
                          <Check size={12} color="#3fb950" />
                          <span style={{ color: "#3fb950", fontWeight: 600 }}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}

                  {msg.role === "user" && (
                    <button
                      className="msg-action-btn"
                      title="Paste prompt back into input box"
                      onClick={() => handleUsePrompt(msg.content)}
                    >
                      <CornerDownLeft size={12} />
                      <span>Use Prompt</span>
                    </button>
                  )}

                  {msg.role === "ai" && msg.content.startsWith("⚠️ **Error:") && (
                    <button
                      className="msg-action-btn retry-btn"
                      title="Retry this request"
                      onClick={handleRetry}
                    >
                      <RotateCcw size={12} />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row ai">
              <div className="msg-avatar ai">
                <img src="/profile.jpg?v=ai" alt="Abhinav" />
              </div>
              <div className="msg-content-wrapper">
                <div className="msg-bubble">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-container">
          {loading && (
            <div className="stop-pill-container">
              <button onClick={handleStop} className="stop-pill" title="Stop generating">
                <Square size={11} fill="currentColor" /> Stop generating
              </button>
            </div>
          )}
          <div className="chat-input-wrapper">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Abhinav's projects, experience , or resume..."
              className="chat-textarea"
            />
            {input && !loading && (
              <button
                onClick={() => {
                  setInput("");
                  if (textareaRef.current) textareaRef.current.style.height = "auto";
                }}
                className="btn-clear-input"
                title="Clear input"
              >
                <X size={15} />
              </button>
            )}
            {loading ? (
              <button
                onClick={handleStop}
                className="btn-stop"
                title="Stop / Pause generation"
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="btn-send"
                title="Send message"
              >
                <Send size={16} />
              </button>
            )}
          </div>
          <div className="input-footer">
            Abhinav AI is grounded in real production code, GitHub repos, and EasyInsights internship architecture.
          </div>
        </div>
      </main>

      {/* 3. Glassmorphic Contact Modal */}
      {showContactModal && (
        <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <div className="contact-modal-title">
                <Phone size={16} color="#58a6ff" /> Contact Information
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="contact-modal-body">
              {/* Email */}
              <div className="contact-item">
                <Mail size={15} className="contact-icon" />
                <a href="mailto:abhinavkrsingh83@gmail.com" className="contact-link">
                  abhinavkrsingh83@gmail.com
                </a>
                <button
                  className={`copy-btn ${copiedField === "email" ? "copied" : ""}`}
                  title="Copy email"
                  onClick={() => handleCopy("abhinavkrsingh83@gmail.com", "email")}
                >
                  {copiedField === "email" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>

              {/* Phone */}
              <div className="contact-item">
                <Phone size={15} className="contact-icon" />
                <a href="tel:+916200529532" className="contact-link">
                  +91 6200529532
                </a>
                <button
                  className={`copy-btn ${copiedField === "phone" ? "copied" : ""}`}
                  title="Copy phone"
                  onClick={() => handleCopy("+916200529532", "phone")}
                >
                  {copiedField === "phone" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>

              {/* Location */}
              <div className="contact-item">
                <MapPin size={15} className="contact-icon" />
                <span className="contact-link">Dhanbad, Jharkhand, India</span>
                <button
                  className={`copy-btn ${copiedField === "location" ? "copied" : ""}`}
                  title="Copy location"
                  onClick={() => handleCopy("Dhanbad, Jharkhand, India", "location")}
                >
                  {copiedField === "location" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>

              {/* Portfolio */}
              <div className="contact-item">
                <Globe size={15} className="contact-icon" />
                <a
                  href="https://abhinavkrsingh-portfolio.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  abhinavkrsingh-portfolio.vercel.app
                </a>
                <button
                  className={`copy-btn ${copiedField === "portfolio" ? "copied" : ""}`}
                  title="Copy portfolio URL"
                  onClick={() => handleCopy("https://abhinavkrsingh-portfolio.vercel.app/", "portfolio")}
                >
                  {copiedField === "portfolio" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>

              {/* GitHub */}
              <div className="contact-item">
                <Github size={15} className="contact-icon" />
                <a
                  href="https://github.com/CodeMaestro-04"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  github.com/CodeMaestro-04
                </a>
                <button
                  className={`copy-btn ${copiedField === "github" ? "copied" : ""}`}
                  title="Copy GitHub URL"
                  onClick={() => handleCopy("https://github.com/CodeMaestro-04", "github")}
                >
                  {copiedField === "github" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>

              {/* LinkedIn */}
              <div className="contact-item">
                <Linkedin size={15} className="contact-icon" />
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  LinkedIn Profile
                </a>
                <button
                  className={`copy-btn ${copiedField === "linkedin" ? "copied" : ""}`}
                  title="Copy LinkedIn URL"
                  onClick={() => handleCopy("https://www.linkedin.com", "linkedin")}
                >
                  {copiedField === "linkedin" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>

              {/* Resume download link in modal */}
              <div style={{ marginTop: "6px", paddingTop: "10px", borderTop: "1px solid var(--border-color)" }}>
                <a
                  href="/resume.pdf"
                  download="Abhinav_Kumar_Singh_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.84rem" }}
                >
                  <Download size={14} /> Download Resume (PDF)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. API Key Modal */}
      {showKeyModal && (
        <div
          className="contact-modal-overlay"
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="contact-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "24px" }}
          >
            <h3 style={{ marginBottom: "10px", fontSize: "1.1rem" }}>Configure Google Gemini API Key</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.4" }}>
              To enable the AI chat for free, paste your Google Gemini API key from Google AI Studio. It will be stored locally in your browser.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              defaultValue={apiKey}
              id="apiKeyInput"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "0.9rem",
                marginBottom: "16px",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setShowKeyModal(false)}
                className="btn-secondary"
                style={{ cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = document.getElementById("apiKeyInput")?.value || "";
                  saveApiKey(val);
                }}
                className="btn-primary"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
