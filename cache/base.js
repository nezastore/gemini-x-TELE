const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Baca token dari file TOKEN.txt
const TELEGRAM_TOKEN = fs.readFileSync('TOKEN.txt', 'utf8').trim();
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// API Key untuk layanan generatif
const API_KEY = "AIzaSyD5iQ8e5qJu72lGt71dpbJjyACTGattIdU";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Fungsi untuk mendapatkan respons dari API
const getAIResponse = async (userMessage) => {
  try {
    const response = await axios.post(API_URL, {
      contents: [{
        role: "user",
        parts: [{ text: userMessage }]
      }]
    });

    const aiResponse = response.data?.candidates[0]?.content?.parts[0]?.text;
    return aiResponse || 'Maaf, saya tidak dapat memberikan respons.';
  } catch (error) {
    return `Terjadi kesalahan: ${error.message}`;
  }
};

// Event saat menerima pesan
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (userMessage && !/^\/start$/.test(userMessage)) {
    // Kirim pesan awal "Sedang mengetik..." untuk memberi respons awal
    const sentMessage = await bot.sendMessage(chatId, 'Sedang mengetik...');

    // Dapatkan respons dari AI berdasarkan pesan pengguna
    const aiResponse = await getAIResponse(userMessage);

    // Kirimkan respons AI dengan tombol Copy
    await bot.editMessageText(aiResponse, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Copy📋', callback_data: 'copy_text' }]
        ]
      }
    });
  }
});

// Callback untuk menangani tombol copy
bot.on('callback_query', async (callbackQuery) => {
  const { data, message } = callbackQuery;
  const chatId = message.chat.id;

  if (data === 'copy_text') {
    // Kirimkan teks dalam format <pre> agar bisa disalin
    const textToCopy = `
<pre>
${message.text}
</pre>`;

    // Edit pesan yang ada dengan teks yang dapat disalin
    await bot.editMessageText(textToCopy, {
      chat_id: chatId,
      message_id: message.message_id,
      parse_mode: 'HTML' // Agar teks muncul dengan format <pre>
    });
  }
});

// Command /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const imageUrl = 'https://envs.sh/rI5.jpg';
  bot.sendPhoto(chatId, imageUrl, {
    caption: 'Halo saya adalah NEZA-AI Pro , Saya siap membantu pekerjaan anda\n\n𝙎𝘾𝙍𝙄𝙋𝙏 𝘽𝙔 NezaFvnky 𝙤𝙧 NEZASTORE',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Chanel Youtube', url: 'https://youtube.com/@NezaFvnky' }],
        [{ text: 'Developer', url: 'https://t.me/nezastore' }],
        [{ text: 'COMUNITY', url: 'https://t.me/jualbeli' }]
      ]
    }
  });
});

console.log(`
███████████████████████████ Script By: NezaFvnky x NEZASTORE
███████▀▀▀░░░░░░░▀▀▀███████ Last Update: 2025
████▀░░░░░░░░░░░░░░░░░▀████ Name:NEZA-Ai 
███│░░░░░░░░░░░░░░░░░░░│███ Version: 1.1
██▌│░░░░░░░░░░░░░░░░░░░│▐██
██░└┐░░░░░░░░░░░░░░░░░┌┘░██
██░░└┐░░░░░░░░░░░░░░░┌┘░░██
██░░┌┘▄▄▄▄▄░░░░░▄▄▄▄▄└┐░░██
██▌░│██████▌░░░▐██████│░▐██
███░│▐███▀▀░░▄░░▀▀███▌│░███
██▀─┘░░░░░░░▐█▌░░░░░░░└─▀██
██▄░░░▄▄▄▓░░▀█▀░░▓▄▄▄░░░▄██
████▄─┘██▌░░░░░░░▐██└─▄████
█████░░▐█─┬┬┬┬┬┬┬─█▌░░█████
████▌░░░▀┬┼┼┼┼┼┼┼┬▀░░░▐████
█████▄░░░└┴┴┴┴┴┴┴┘░░░▄█████
███████▄░░░░░░░░░░░▄███████
██████████▄▄▄▄▄▄▄██████████
███████████████████████████
`);



