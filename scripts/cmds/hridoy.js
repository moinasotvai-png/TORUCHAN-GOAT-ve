const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "hridoy",
    version: "2.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Hridoy Auto Reply Profile",
    category: "Admin",
    guide: {
      en: "Auto reply when 'hridoy' or mention detected"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const msg = event.body?.toLowerCase() || "";

    // 🔥 এখানে তোর UID বসা
    const TARGET_UID = "100048786044500";

    // ✅ condition: message এ hridoy থাকলে OR mention করলে
    const isNameMatch = msg.includes("hridoy");
    const isMentioned = Object.keys(event.mentions || {}).includes(TARGET_UID);

    if (!isNameMatch && !isMentioned) return;

    const profileText = 
`✦━━━━━━〔 𝑷𝑹𝑶𝑭𝑰𝑳𝑬 〕━━━━━━✦
✨ NAME   ➤ HR ID OY
✨ AGE    ➤ 20+
✨ STATUS ➤ SINGLE
✨ LOC    ➤ JASHORE

✦━━━━━━━〔 𝑺𝑶𝑪𝑰𝑨𝑳〕━━━━━━━✦
🌐 FB   ➤ fb.me/100048786044500
📧 MAIL ➤ hridoyhossen049@gmail.com
📱 WA   ➤ 01744-******

✦━━━━━━━━〔 𝑮𝑨𝑴𝑬〕━━━━━━━✦
🔫 FREE FIRE

✦━━━━━━━━━━━━━━━━━━━━✦
⚡ SYSTEM STATUS : ONLINE`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "hridoy.jpg");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    const imgLink = "https://i.imgur.com/6dpggxq.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: profileText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send)
      .on("error", () => {
        api.sendMessage("❌ Image load failed!", event.threadID, event.messageID);
      });
  }
};
