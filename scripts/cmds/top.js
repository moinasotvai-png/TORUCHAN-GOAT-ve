const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { Canvas, loadImage } = require("canvas");

const dbPath = path.join(__dirname, "../../data/bot.json");

module.exports = {
  config: {
    name: "top",
    aliases: ["balldb", "topbalance"],
    version: "1.12-fixed-final",
    author: "Hridoy + Fixed AI",
    countDown: 15,
    role: 0,
    description: { en: "Balance leaderboard with glow + fixed image send" },
    category: "Game",
    guide: { en: "{pn} [page number]" },
    envConfig: {
      ACCESS_TOKEN: "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
    }
  },

  onStart: async function({ api, event, args, message }) {

    if (!fs.existsSync(dbPath)) return message.reply("Database not found.");

    let db;
    try {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } catch {
      return message.reply("Database corrupted.");
    }

    // === Loading message ===
    const loadingMsg = await api.sendMessage(
      { body: "" },
      event.threadID
    );

    try {
      await api.editMessage("", loadingMsg.messageID);
    } catch {}

    // === THREAD USERS ===
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(event.threadID);
    } catch {
      return message.reply("Failed to get thread info.");
    }

    const members = threadInfo.participantIDs;

    let data = [];

    for (const uid of members) {
      const money = (db.users && db.users[uid] && db.users[uid].money) || 0;

      let name = "Facebook User";
      try {
        const info = await api.getUserInfo(uid);
        name = info?.[uid]?.name || name;
      } catch {}

      data.push({ uid, name, money, rank: 0 });
    }

    data.sort((a, b) => b.money - a.money);
    data.forEach((u, i) => (u.rank = i + 1));

    const page = parseInt(args[0]) || 1;
    const perPage = 11;

    const start = (page - 1) * perPage;
    const pageData = data.slice(start, start + perPage);

    if (!pageData.length) {
      await api.unsendMessage(loadingMsg.messageID);
      return message.reply("No more pages.");
    }

    // === CANVAS SETUP ===
    const canvas = new Canvas(1200, 1700);
    const ctx = canvas.getContext("2d");

    const bgUrl = "https://i.imgur.com/jMrPT8g.jpeg";
    let bg;

    try {
      bg = await loadImage(bgUrl);
      ctx.drawImage(bg, 0, 0, 1200, 1700);
    } catch {}

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, 1200, 1700);

    const ACCESS_TOKEN = this.config.envConfig.ACCESS_TOKEN;
    const glowColors = ["#FFD700","#FF4500","#00FFFF","#FF00FF","#00FF9D","#FFA500","#1E90FF","#FF69B4"];

    const getAvatar = async (uid) => {
      try {
        let url = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
        if (ACCESS_TOKEN) url += `&access_token=${ACCESS_TOKEN}`;

        const res = await axios.get(url, { responseType: "arraybuffer" });
        return await loadImage(res.data);
      } catch {
        return await loadImage("https://i.imgur.com/blank_avatar.png");
      }
    };

    const drawAvatar = (ctx, img, x, y, r) => {
      if (!img) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
      ctx.restore();
    };

    // === TOP 3 ===
    if (page === 1) {
      const top3 = data.slice(0, 3);

      const pos = [
        { x: 600, y: 280, r: 110 },
        { x: 300, y: 380, r: 85 },
        { x: 900, y: 380, r: 85 }
      ];

      for (let i = 0; i < top3.length; i++) {
        const user = top3[i];
        const avatar = await getAvatar(user.uid);

        const cx = pos[i].x;
        const cy = pos[i].y;
        const color = glowColors[i % glowColors.length];

        ctx.shadowColor = color;
        ctx.shadowBlur = 35;

        ctx.beginPath();
        ctx.arc(cx, cy, pos[i].r + 15, 0, Math.PI * 2);
        ctx.fillStyle = color + "30";
        ctx.fill();

        ctx.shadowBlur = 0;
        drawAvatar(ctx, avatar, cx, cy, pos[i].r);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 42px Arial";
        ctx.textAlign = "center";
        ctx.fillText(user.name, cx, cy + pos[i].r + 70);

        ctx.font = "bold 36px Arial";
        ctx.fillText(`$${user.money}`, cx, cy + pos[i].r + 120);
      }
    }

    // === LIST ===
    let yStart = page === 1 ? 620 : 180;

    for (const user of pageData) {
      if (page === 1 && user.rank <= 3) continue;

      const color = glowColors[(user.rank - 1) % glowColors.length];

      ctx.fillStyle = "rgba(10,10,30,0.85)";
      ctx.fillRect(40, yStart, 1120, 110);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 50px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`#${user.rank}`, 80, yStart + 70);

      const avatar = await getAvatar(user.uid);
      drawAvatar(ctx, avatar, 220, yStart + 55, 45);

      ctx.font = "bold 36px Arial";
      ctx.fillText(user.name, 320, yStart + 70);

      ctx.textAlign = "right";
      ctx.font = "bold 40px Arial";
      ctx.fillText(`$${user.money}`, 1140, yStart + 70);

      yStart += 130;
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#ccc";
    ctx.font = "28px Arial";
    ctx.fillText(`Page ${page}`, 600, 1630);

    // === SAVE IMAGE PROPERLY ===
    const cachePath = path.join(__dirname, "cache", "top_balance.png");
    await fs.ensureDir(path.dirname(cachePath));

    const out = fs.createWriteStream(cachePath);
    const stream = canvas.createPNGStream();

    stream.pipe(out);

    // ✅ FIX: WAIT PROPERLY FOR FILE WRITE
    out.on("finish", async () => {
      try {
        await api.unsendMessage(loadingMsg.messageID);

        return message.reply({
          body: `💰 Balance Leaderboard - Page ${page}`,
          attachment: fs.createReadStream(cachePath)
        });
      } catch {
        return message.reply("❌ Failed to send image.");
      }
    });

    out.on("error", async () => {
      await api.unsendMessage(loadingMsg.messageID);
      return message.reply("❌ Canvas error occurred.");
    });
  }
};