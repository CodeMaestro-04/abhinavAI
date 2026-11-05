#!/usr/bin/env python3
"""
Abhinav AI — Telegram Visitor & Conversation Notification Bot
Monitors live chat activity on https://abhinav-ai-twin.vercel.app and dispatches
instant visitor alerts directly to your personal Telegram.

Captures:
- 📍 City, State & Country (via Vercel IP headers)
- 📱 Device, Browser & Operating System
- 🔗 Referral URL (LinkedIn, WhatsApp, Portfolio)
- 💬 Exact conversation questions and AI answers
"""

import os
import sys
import requests
from dotenv import load_dotenv

# Load credentials from .env.local or environment
load_dotenv(".env.local")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

TELEGRAM_API_URL = "https://api.telegram.org/bot"


def send_telegram_alert(
    prompt: str,
    reply: str = "",
    city: str = "Unknown City",
    country: str = "Unknown Country",
    device: str = "Unknown Device",
    referrer: str = "Direct",
    ip: str = "N/A"
) -> bool:
    """Dispatches a formatted real-time visitor alert to your Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("⚠️ Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in .env.local")
        return False

    url = f"{TELEGRAM_API_URL}{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    text = (
        "🚨 <b>New Visitor on Abhinav AI!</b>\n\n"
        f"📍 <b>Location:</b> {city}, {country} (IP: <code>{ip}</code>)\n"
        f"📱 <b>Device:</b> {device}\n"
        f"🔗 <b>Source:</b> {referrer}\n\n"
        f"💬 <b>Question Asked:</b>\n"
        f"<i>\"{prompt}\"</i>\n\n"
    )

    if reply:
        preview = reply[:250] + ("..." if len(reply) > 250 else "")
        text += f"🤖 <b>AI Response Preview:</b>\n{preview}"

    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        print("✓ Visitor alert successfully sent to Telegram!")
        return True
    except Exception as e:
        print(f"❌ Failed to send Telegram alert: {e}")
        return False


def test_connection():
    """Verifies your bot token and chat ID with a test notification."""
    print("🤖 Testing Telegram Bot connection...")
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("❌ Missing credentials. Please add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to .env.local")
        return False

    return send_telegram_alert(
        prompt="[TEST] What technical projects did Abhinav build at EasyInsights?",
        reply="I built a real-time RabbitMQ queue monitoring bot, Full Funnel marketing dashboards, and chunked CSV upload pipelines.",
        city="Kolkata",
        country="India",
        device="MacBook / Chrome",
        referrer="https://linkedin.com",
        ip="127.0.0.1"
    )


if __name__ == "__main__":
    test_connection()
