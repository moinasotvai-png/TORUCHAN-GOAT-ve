const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "prefix",
    version: "14.0",
    author: "Hridoy",
    description: "Full Prefix System",
    category: "Utility"
  },

  onStart: async function ({ message, event, api, args }) {

    const prefixFile = path.join(__dirname, "prefixData.json");

    if (!fs.existsSync(prefixFile)) {
      fs.writeFileSync(prefixFile, JSON.stringify({}, null, 2));
    }

    const getPrefix = (threadID) => {
      const data = JSON.parse(fs.readFileSync(prefixFile));
      return data[threadID] || global.GoatBot.config.prefix;
    };

    const setPrefix = (threadID, newPrefix) => {
      const data = JSON.parse(fs.readFileSync(prefixFile));
      data[threadID] = newPrefix;
      fs.writeFileSync(prefixFile, JSON.stringify(data, null, 2));
    };

    const botPrefix = global.GoatBot.config.prefix || "!";
    const groupPrefix = getPrefix(event.threadID);

    // ================= DOT PREFIX =================
    if (event.body && event.body.trim() === botPrefix) {
      return message.reply("🎀\nιт'ѕ ʝυѕт му ρяєƒιχ");
    }

    // ================= SET PREFIX =================
    if (args && args[0] === "set") {
      const newPrefix = args[1];

      if (!newPrefix) {
        return message.reply("❌ | Example: prefix set !");
      }

      setPrefix(event.threadID, newPrefix);
      global.GoatBot.config.prefix = newPrefix;

      return message.reply(`✅ Prefix Changed Successfully!\nNew Prefix: ${newPrefix}`);
    }

    // ================= INFO =================
    const ping = Date.now() - event.timestamp;
    const day = new Date().toLocaleString("en-US", { weekday: "long" });

    const BOTNAME = global.GoatBot.config.nickNameBot || "KakashiBot";
    const BOTPREFIX = botPrefix;
    const GROUPPREFIX = groupPrefix;

    // ================= ALL LOADING SETS =================
    const loadingSets = [

      [
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n▰▱▱▱▱▱▱▱▱▱ 10%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n▰▰▰▱▱▱▱▱▱▱ 30%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n▰▰▰▰▰▱▱▱▱▱ 50%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n▰▰▰▰▰▰▰▱▱▱ 70%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n▰▰▰▰▰▰▰▰▰▱ 90%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠...\n▰▰▰▰▰▰▰▰▰▰ 100%"
      ],

      [
        "Loading...\n[■□□□□□□□□□] 10%",
        "Loading...\n[■■■□□□□□□□] 30%",
        "Loading...\n[■■■■■□□□□□] 50%",
        "Loading...\n[■■■■■■■□□□] 70%",
        "Loading...\n[■■■■■■■■■□] 90%",
        "Loading...\n[■■■■■■■■■■] 100%"
      ],

      [
        "Loading...\n◉□□□□□□□□□ 10%",
        "Loading...\n◉◉◉□□□□□□□ 30%",
        "Loading...\n◉◉◉◉◉□□□□□ 50%",
        "Loading...\n◉◉◉◉◉◉◉□□□ 70%",
        "Loading...\n◉◉◉◉◉◉◉◉◉□ 90%",
        "Loading...\n◉◉◉◉◉◉◉◉◉◉ 100%"
      ]

    ];

    // ================= ALL GIF =================
    const gifs = [
      "https://i.imgur.com/zex8uo7.gif",
      "https://i.imgur.com/4ki8eBI.gif",
      "https://i.imgur.com/AMKQCJc.gif",
      "https://i.imgur.com/rkjO7YV.gif",
      "https://i.imgur.com/SgNPn8E.gif",
      "https://i.imgur.com/u3qB5y2.gif",
      "https://i.imgur.com/KUFxWlF.gif",
      "https://i.imgur.com/FV9krHV.gif",
      "https://i.imgur.com/lFrFMEn.gif",
      "https://i.imgur.com/KrEez4A.gif"
    ];

    // ================= TEXT FRAMES =================
    const textFrames = [

`🌟╔═༶• PREFIX INFO •༶═╗🌟
🕒 Ping: ${ping}ms
📅 Day: ${day}
💠 Bot Prefix: ${BOTPREFIX}
💬 Group Prefix: ${GROUPPREFIX}
🤖 Bot Name: ${BOTNAME}
🌟╚═════༶• END •༶════╝🌟`,

`╭━• PREFIX STATUS •━╮
⏱ Ping: ${ping}ms
📆 Day: ${day}
🔹 Bot Prefix: ${BOTPREFIX}
🔹 Group Prefix: ${GROUPPREFIX}
🤖 Bot: ${BOTNAME}
╰━━━━━━━━━━━━━━━━╯`,

`┏━ PREFIX INFO ━┓
🕒 Ping: ${ping}ms
📅 Date: ${day}
💠 Bot Prefix: ${BOTPREFIX}
💬 Group Prefix: ${GROUPPREFIX}
🤖 Bot:${BOTNAME}
┗━━━━━━━━━━━━━┛`,
      
`▸▸▸ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗦𝗧𝗔𝗧𝗨𝗦 ◂◂◂
Ping: ${ping}ms
Day: ${day}
Bot Prefix: ${BOTPREFIX}
Group Prefix: ${GROUPPREFIX}
Bot Name: ${BOTNAME}`

    ];

    // ================= RANDOM =================
    const randomLoading = loadingSets[Math.floor(Math.random() * loadingSets.length)];
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    const randomText = textFrames[Math.floor(Math.random() * textFrames.length)];

    // ================= LOADING ANIMATION =================
    const msg = await message.reply(randomLoading[0]);

    for (let i = 1; i < randomLoading.length; i++) {
      await new Promise(r => setTimeout(r, 1000));
      api.editMessage(randomLoading[i], msg.messageID);
    }

    await new Promise(r => setTimeout(r, 500));
    api.unsendMessage(msg.messageID);

    // ================= GIF SEND =================
    const cacheFolder = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

    const fileName = path.basename(randomGif);
    const filePath = path.join(cacheFolder, fileName);

    if (!fs.existsSync(filePath)) {
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(randomGif, res => {
          res.pipe(file);
          file.on("finish", () => file.close(resolve));
        }).on("error", reject);
      });
    }

    api.sendMessage({
      body: randomText,
      attachment: fs.createReadStream(filePath)
    }, event.threadID);
  },

  onChat: async function ({ event, message, api }) {
    if (!event.body) return;

    const body = event.body.trim();

    if (body === "prefix") {
      return this.onStart({ message, event, api, args: [] });
    }

    if (body.startsWith("prefix set")) {
      const args = body.split(" ");
      return this.onStart({ message, event, api, args });
    }

    // 🔥 শুধু "." দিলে trigger
    if (body === global.GoatBot.config.prefix) {
      return this.onStart({ message, event, api, args: [] });
    }
  }
};
