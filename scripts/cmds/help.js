const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "11.0",
    author: "HRIDOY",
    shortDescription: "Animated Help Menu With Category Filter",
    category: "System",
    guide: "{pn}help [command | all]"
  },

  onStart: async function ({ message, args, prefix, api }) {

    const commandsMap = global.GoatBot.commands;
    const categories = {};
    const commands = [];

    // ===== CATEGORY WHITELIST =====
    const allowedCategories = [
      "AI",
      "Group",
      "Image",
      "Game",
      "Love",
      "Tag Fun",
      "Media"
    ];

    // ===== SINGLE COMMAND INFO =====
    if (args[0] && args[0] !== "all") {
      const cmd = commandsMap.get(args[0].toLowerCase());
      if (!cmd) return message.reply("❌ Command not found!");

      return message.reply(
`╭━━━〔 ✦ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✦ 〕━━━⬣
┃ ⌬ 𝐍𝐚𝐦𝐞 : ${cmd.config.name}
┃ ⌬ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 : ${cmd.config.category}
┃ ⌬ 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧 : ${cmd.config.shortDescription}
┃ ⌬ 𝐔𝐬𝐚𝐠𝐞 : \( {prefix} \){cmd.config.name}
╰━━━━━━━━━━━━━━━━━━━⬣`
      );
    }

    // ===== BUILD CATEGORY SYSTEM =====
    for (let [name, cmd] of commandsMap) {
      const cat = cmd.config.category || "Others";

      if (args[0] !== "all") {
        if (!allowedCategories.includes(cat)) continue;
      }

      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
      commands.push(name);
    }

    for (let cat in categories)
      categories[cat].sort();

    // ===== LOADING ANIMATION (PROGRESS BAR) =====
    const loadingFrames = [
      "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▱▱▱▱▱▱▱▱▱ 10%",
      "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▱▱▱▱▱▱▱ 30%",
      "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▱▱▱▱▱ 50%",
      "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▰▰▱▱▱ 70%",
      "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▰▰▰▰▱ 90%",
      "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮...\n▰▰▰▰▰▰▰▰▰▰ 100%"
    ];

    let loadingMsg;
    try {
      loadingMsg = await message.reply(loadingFrames[0]);
    } catch (e) {
      console.error("Failed to send loading message");
    }

    // Animate loading
    for (let i = 1; i < loadingFrames.length; i++) {
      await new Promise(res => setTimeout(res, 400));
      if (loadingMsg) {
        try {
          await api.editMessage(loadingFrames[i], loadingMsg.messageID);
        } catch (e) {
          // Ignore if message is too old or deleted
        }
      }
    }

    // ===== BUILD HELP TEXT =====
    let msg = `╭━━━〔 ✦ 𝐀𝐃𝐕𝐀𝐍𝐂𝐄𝐃 𝐇𝐄𝐋𝐏 𝐏𝐀𝐍𝐄𝐋 ✦ 〕━━━⬣\n`;
    msg += `┃ ⌬ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 : ${commands.length}\n`;
    msg += `┃ ⌬ 𝐁𝐨𝐭 𝐏𝐫𝐞𝐟𝐢𝐱 : 『 ${prefix} 』\n`;
    msg += `┃ ⌬ 𝐒𝐭𝐚𝐭𝐮𝐬 : 𝐀𝐜𝐭𝐢𝐯𝐞 🟢\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━⬣\n\n`;

    for (let [cat, cmds] of Object.entries(categories)) {
      msg += `╭━━━〔 🗂️  ${cat.toUpperCase()} 〕━━━⬣\n`;

      for (let i = 0; i < cmds.length; i += 2) {
        const row = [`✧ ${cmds[i]}`];
        if (cmds[i + 1])
          row.push(`┃ ✧ ${cmds[i + 1]}`);

        msg += `┃ ${row.join("   ")}\n`;
      }

      msg += `╰━━━━━━━━━━━━━━━━━━━⬣\n\n`;
    }

    msg += `╭━━━〔 👑 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 〕━━━⬣\n`;
    msg += `┃ 👤 𝐀𝐝𝐦𝐢𝐧 : Kakashi Hatake\n`;
    msg += `┃ 📩 𝐑𝐞𝐩𝐨𝐫𝐭 : ${prefix}callad (yourmsg)\n`;
    msg += `┃ ⚡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 : HRIDOY\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━⬣\n`;

    // ===== RANDOM GIF =====
    const gifURLs = [
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

    const randomGifURL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
    const gifFolder = path.join(__dirname, "cache");

    if (!fs.existsSync(gifFolder))
      fs.mkdirSync(gifFolder, { recursive: true });

    const gifName = path.basename(randomGifURL);
    const gifPath = path.join(gifFolder, gifName);

    if (!fs.existsSync(gifPath)) {
      try {
        await downloadGif(randomGifURL, gifPath);
      } catch (err) {
        console.error("Failed to download GIF:", err);
      }
    }

    // Remove loading message
    if (loadingMsg) {
      try {
        await api.unsendMessage(loadingMsg.messageID);
      } catch (e) {}
    }

    // Send final help message
    const sent = await message.reply({
      body: msg,
      attachment: fs.existsSync(gifPath) ? fs.createReadStream(gifPath) : null
    });

    // ===== AUTO DELETE AFTER 30s =====
    setTimeout(() => {
      try {
        api.unsendMessage(sent.messageID);
      } catch (e) {}
    }, 30000);
  }
};

// ===== DOWNLOAD FUNCTION =====
function downloadGif(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}