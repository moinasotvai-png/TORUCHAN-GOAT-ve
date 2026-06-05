module.exports = {
config: {
name: "roast",
aliases: ["ro"],
version: "5.0",
author: "Hridoy",
countDown: 5,
role: 1,
shortDescription: {
en: "Roast a replied or mentioned user"
},
longDescription: {
en: "Send a random roast line to a replied or mentioned user."
},
category: "Tag Fun",
guide: {
en: "{pn} @mention\n{pn} (reply to someone's message)"
}
},

onStart: async function ({ message, api, event }) {
let targetID, targetName;

// Reply system
if (event.messageReply) {
  targetID = event.messageReply.senderID;
  targetName =
    event.messageReply.senderName ||
    "User";
}

// Mention system
else if (Object.keys(event.mentions).length > 0) {
  targetID = Object.keys(event.mentions)[0];
  targetName = event.mentions[targetID];
}

else {
  return message.reply(
    "❌ | Please reply to someone's message or mention a user."
  );
}

const tagText = `@${targetName}`;

const roasts = [
  "তোর future দেখে Google Maps-ও বলে: Route not found! 🗺️",
  "তুই এত slow, Internet Explorer তোকে দেখে inspiration নেয় 🐌",
  "তোর IQ hide and seek খেলতেছে, এখনও খুঁজে পাওয়া যায় নাই 🔍",
  "তুই online থাকিস, কিন্তু system offline থাকে 📡",
  "তোর crush তোকে দেখে airplane mode on করে ✈️",
  "তুই এমন legend, ভুল উত্তর দিলেও confident থাকিস 😭",
  "তোর brain update নিতে গিয়ে server timeout হয়ে গেছে ⏳",
  "তুই exam hall-এর সেই player, answer না জানলেও page ভরিস 📖",
  "তোর কথা শুনে Siri-ও বলে: Sorry, I didn't understand 😵",
  "তুই এত unlucky, coin toss-এ coin-ই হারিয়ে যায় 🪙",
  "তুই selfie তুললে camera quality নিজেই কমে যায় 📸",
  "তোর logic দেখে calculator-ও চাকরি ছাড়তে চায় 🧮",
  "তুই এমন mystery, তুই নিজেও জানিস না কী করতেছিস 🤦",
  "তোর plan সবসময় perfect... fail হওয়ার জন্য 😆",
  "তুই WiFi password-এর মতো, কেউ মনে রাখতে চায় না 📶",
  "তুই group project-এর সেই member, নাম আছে কাজ নাই 🗿",
  "তোর confidence NASA-র rocket, result local bus 🚍",
  "তুই এমন busy, কিছু না করতেই পুরো দিন শেষ 😭",
  "তোর talent এত hidden, FBI-ও খুঁজে পায় না 🕵️",
  "তুই joke মারলে audience warranty claim করতে চায় 🎤",
  "তুই exam-এর MCQ-এর মতো, চারটা option-ই ভুল 😵‍💫",
  "তোর fashion sense দেখে mannequin-ও ভয় পায় 👕",
  "তুই এমন player, tutorial-এও game over খাস 🎮",
  "তুই keyboard-এর broken key-এর মতো, চাপ দিলেও কাজ হয় না ⌨️",
  "তোর face unlock দেখে phone ভাবে: Try again later 📱",
  "তুই এমন VIP, queue-তে দাঁড়িয়েও last-e থাকিস 😭",
  "তোর idea শুনে light bulb-ও জ্বলে না 💡",
  "তুই Google search-এর 2nd page-এর মতো, কেউ যায় না সেখানে 🌚",
  "তোর brain loading... 1% complete... please wait ⏳",
  "তুই এত random, autocorrect-ও resign করে দেয় 🤖",
  "তোর luck এমন, free trial নিলেও payment কেটে যায় 💳",
  "তুই alarm clock-এর মতো, সবাই বন্ধ করতে চায় ⏰",
  "তোর confidence unlimited, কিন্তু skill trial version 😭",
  "তুই এমন influencer, নিজের pet-ও follow করে না 🐶",
  "তোর কথা শুনে echo-ও reply দিতে অস্বীকার করে 🗣️",
  "তুই এমন chef, পানি ফুটাইলেও recipe লাগে 🍳",
  "তোর presence দেখে ghost-ও disappear হয়ে যায় 👻",
  "তুই এমন genius, charger খুলে phone charge দিতে চাস 🔋",
  "তোর memory RAM 128MB, দুই মিনিট আগের কথাও ভুলে যাস 🤣",
  "তুই online class-এর সেই student, camera off, brain off, mic off 🎓"
];

const randomRoast =
  roasts[Math.floor(Math.random() * roasts.length)];

return api.sendMessage(
  {
    body: `${tagText}, ${randomRoast}`,
    mentions: [
      {
        id: targetID,
        tag: tagText
      }
    ]
  },
  event.threadID,
  event.messageID
);

}
};