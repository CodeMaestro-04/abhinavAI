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
import re
import json
import urllib.request
import urllib.error

# Automatically reads the keys you set once at the top of app/api/chat/route.js
def _load_credentials():
    token, chat_id = "", ""
    route_file = os.path.join(os.path.dirname(__file__), "app", "api", "chat", "route.js")
    if os.path.exists(route_file):
        try:
            with open(route_file, "r", encoding="utf-8") as f:
                content = f.read()
            m_token = re.search(r'const\s+TELEGRAM_BOT_TOKEN\s*=\s*["\']([^"\']*)["\']', content)
            m_chat = re.search(r'const\s+TELEGRAM_CHAT_ID\s*=\s*["\']([^"\']*)["\']', content)
            if m_token:
                token = m_token.group(1).strip()
            if m_chat:
                chat_id = m_chat.group(1).strip()
        except Exception:
            pass
    return token or os.getenv("TELEGRAM_BOT_TOKEN", ""), chat_id or os.getenv("TELEGRAM_CHAT_ID", "")

TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID = _load_credentials()

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
        print("⚠️ Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is empty in app/api/chat/route.js")
        return False

    url = f"{TELEGRAM_API_URL}{TELEGRAM_BOT_TOKEN}/sendMessage"
    
    loc_display = f"{city}, {country}" if country and country not in city else city
    text = (
        "🚨 <b>New Visitor on Abhinav AI!</b>\n\n"
        f"📍 <b>Location:</b> {loc_display} (IP: <code>{ip}</code>)\n"
        f"📱 <b>Device:</b> {device}\n"
        f"🔗 <b>Source:</b> {referrer}\n\n"
        f"💬 <b>Question Asked:</b>\n"
        f"<i>\"{prompt}\"</i>\n\n"
    )

    if reply:
        preview = reply[:250] + ("..." if len(reply) > 250 else "")
        text += f"🤖 <b>AI Response Preview:</b>\n{preview}"

    payload = json.dumps({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }).encode("utf-8")

    try:
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                print("✓ Visitor alert successfully sent to Telegram!")
                return True
        return False
    except Exception as e:
        print(f"❌ Failed to send Telegram alert: {e}")
        return False


def get_live_location():
    """Detects actual machine IP and live city/region for the test run."""
    try:
        req = urllib.request.Request(
            "https://ipapi.co/json/",
            headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=4) as res:
            data = json.loads(res.read().decode("utf-8"))
            city = data.get("city") or "Delhi"
            region = data.get("region") or ""
            country = data.get("country_name") or "India"
            ip = data.get("ip") or "127.0.0.1"
            org = data.get("org") or ""
            loc_label = f"{city}, {region}, {country}" if region else f"{city}, {country}"
            if org:
                loc_label += f" ({org})"
            return {"location": loc_label, "ip": ip}
    except Exception:
        return {"location": "Delhi, India", "ip": "Local IP"}


def test_connection():
    """Verifies your bot token and chat ID with a test notification using real live location."""
    print("🤖 Testing Telegram Bot connection with live location...")
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("❌ Missing credentials. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID once at the top of app/api/chat/route.js")
        return False

    info = get_live_location()

    return send_telegram_alert(
        prompt="[TEST] What technical projects did Abhinav build at EasyInsights?",
        reply="I built a real-time RabbitMQ queue monitoring bot, Full Funnel marketing dashboards, and chunked CSV upload pipelines.",
        city=info["location"],
        country="",
        device="MacBook / Chrome (Local Test)",
        referrer="Local Terminal test",
        ip=info["ip"]
    )


if __name__ == "__main__":
    test_connection()
