const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
  const response = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return response.data.mahmud;
};

module.exports = {
  config: {
    name: "onepiece",
    aliases: ["onepiecevid", "onep", "onepvideo"],
    version: "1.8",
    role: 0,
    author: "MahMUD",
    category: "Media",
    guide: {
      en: "Send 'onepiece' or 'one piece video' to get a random video."
    }
  },

  // ⚠️ REQUIRED (fix install error)
  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const body = (event.body || "").toLowerCase();

    // 🔥 NOPREFIX TRIGGERS
    const triggers = [
      "onepiece",
      "one piece",
      "one piece video",
      "onepiece video",
      "onep",
      "onep video"
    ];

    if (!triggers.some(t => body.includes(t))) return;

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `onepiece_${event.senderID}.mp4`);

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const apiUrl = await mahmud();
      const res = await axios.get(
        `${apiUrl}/api/album/mahmud/videos/onepiece?userID=${event.senderID}`
      );

      if (!res.data.success || !res.data.videos.length) {
        return api.sendMessage(
          "❌ | No One Piece videos found.",
          event.threadID,
          event.messageID
        );
      }

      const url =
        res.data.videos[Math.floor(Math.random() * res.data.videos.length)];

      const video = await axios({
        url,
        method: "GET",
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const writer = fs.createWriteStream(filePath);
      video.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: "✨ | Here is your One Piece video ⚔️",
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => {
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          },
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage(
          "❌ | Download error occurred.",
          event.threadID,
          event.messageID
        );
      });
    } catch (e) {
      console.error(e);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage(
        "🥹 | API error, contact Hridoy",
        event.threadID,
        event.messageID
      );
    }
  }
};