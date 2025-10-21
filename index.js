// ✅ Telegram Video Downloader Bot
// 💬 Credit: @dexter_xxmorgan
// 📢 Join Channels:
//    🔹 https://t.me/freefirelkies
//    🔹 @owner_of_this_all

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BOT_TOKEN = "7681148351:AAF3QSNvnbWbLM9oUW-lfo0MVhnaEU0gkeo";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const API_URL = "https://socialdownloder.anshapi.workers.dev/?url=";

// Start message
async function sendStartMessage(chatId) {
  const text = `👋 *Welcome!*\n\nSend me any video link to download.\n\n💬 Credit: @dexter_xxmorgan`;
  const replyMarkup = {
    inline_keyboard: [
      [{ text: "🔥 Join Channel 1", url: "https://t.me/freefirelkies" }],
      [{ text: "⚡ Join Channel 2", url: "https://t.me/owner_of_this_all" }],
    ],
  };

  await fetch(`${TELEGRAM_API}/sendMessage`, {
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

// Handle messages
app.post("/api/bot", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message || !message.chat) return res.sendStatus(200);

    const chatId = message.chat.id;
    const text = message.text?.trim();

    // /start command
    if (text === "/start") {
      await sendStartMessage(chatId);
      return res.sendStatus(200);
    }

    // URL check
    if (!text || !text.startsWith("http")) {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "❌ Please send a valid video link.",
        }),
      });
      return res.sendStatus(200);
    }

    // Notify downloading
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "⏳ Downloading video... please wait...",
      }),
    });

    // Fetch from API
    const response = await fetch(API_URL + text);
    const data = await response.json();

    if (data.url) {
      await fetch(`${TELEGRAM_API}/sendVideo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          video: data.url,
          caption: "✅ Here’s your video!\n\n💬 Credit: @dexter_xxmorgan",
        }),
      });
    } else {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "⚠️ Unable to fetch video. Try another link.",
        }),
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error:", err);
    res.sendStatus(500);
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("🤖 Telegram Video Downloader Bot by @dexter_xxmorgan is running!");
});

app.listen(3000, () => console.log("Bot server running on port 3000"));