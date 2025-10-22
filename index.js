// ✅ Telegram Video Downloader Bot (Vercel API Version)
// 💬 Credit: @dexter_xxmorgan
// 📢 Join Channels:
//    🔹 https://t.me/freefirelkies
//    🔹 @owner_of_this_all

import fetch from "node-fetch";

const BOT_TOKEN = "7681148351:AAF3QSNvnbWbLM9oUW-lfo0MVhnaEU0gkeo";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const API_URL = "https://socialdownloder.anshapi.workers.dev/?url=";

// ✅ Main handler (Vercel function)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("🤖 Bot by @dexter_xxmorgan is running!");
  }

  try {
    console.log("📩 Telegram update:", JSON.stringify(req.body, null, 2));
    const message = req.body.message;
    if (!message || !message.chat) return res.status(200).send("ok");

    const chatId = message.chat.id;
    const text = message.text?.trim();

    // /start command
    if (text === "/start") {
      await sendStartMessage(chatId);
      return res.status(200).send("ok");
    }

    // Non-URL text
    if (!text || !text.startsWith("http")) {
      await sendMessage(chatId, "❌ Please send a valid video link.");
      return res.status(200).send("ok");
    }

    // Downloading message
    await sendMessage(chatId, "⏳ Downloading video... please wait...");

    // Fetch from downloader API
    const response = await fetch(API_URL + encodeURIComponent(text));
    const data = await response.json().catch(() => ({}));

    if (data.url) {
      await sendVideo(chatId, data.url);
    } else {
      await sendMessage(chatId, "⚠️ Unable to fetch video. Try another link.");
    }

    return res.status(200).send("ok");
  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).send("error");
  }
}

// ✅ Helper functions
async function sendMessage(chatId, text) {
  return fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function sendStartMessage(chatId) {
  const text = `👋 *Welcome!*\n\nSend me any video link to download.\n\n💬 Credit: @dexter_xxmorgan`;
  const replyMarkup = {
    inline_keyboard: [
      [{ text: "🔥 Join Channel 1", url: "https://t.me/freefirelkies" }],
      [{ text: "⚡ Join Channel 2", url: "https://t.me/owner_of_this_all" }],
    ],
  };

  return fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: replyMarkup,
    }),
  });
}

async function sendVideo(chatId, videoUrl) {
  return fetch(`${TELEGRAM_API}/sendVideo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      video: videoUrl,
      caption: "✅ Here’s your video!\n\n💬 Credit: @dexter_xxmorgan",
    }),
  });
                          }
