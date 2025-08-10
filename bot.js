// Minecraft AFK Bot for Cloud Hosting (Mineflayer)
const mineflayer = require('mineflayer');

// Читаем настройки из переменных окружения или ставим значения по умолчанию
const HOST = process.env.MC_HOST || 'dimchikkr4567.aternos.me';
const PORT = Number(process.env.MC_PORT || 45029);
const VERSION = process.env.MC_VERSION || '1.20.1';
const MODE = (process.env.MODE || 'offline').toLowerCase(); // 'offline' или 'online'
const MS_EMAIL = process.env.MS_EMAIL || ''; // email для online-mode
const NICK = process.env.NICK || 'AFK_Bot'; // ник для offline-mode

function createBot() {
  const opts = { host: HOST, port: PORT, version: VERSION };

  if (MODE === 'online') {
    opts.auth = 'microsoft'; // Вход через Microsoft
    opts.username = MS_EMAIL;
  } else {
    opts.username = NICK; // Оффлайн-режим
  }

  console.log(`[BOT] Connecting to ${HOST}:${PORT} (${MODE} mode)`);

  const bot = mineflayer.createBot(opts);

  bot.once('spawn', () => {
    console.log('[BOT] Spawned. Anti-AFK enabled.');

    // Анти-AFK: прыжки + повороты
    let toggle = false;
    setInterval(() => {
      toggle = !toggle;
      bot.setControlState('jump', toggle);
      bot.look(bot.entity.yaw + 0.6, 0, true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }, 30000);

    // Сообщение в чат раз в 3 минуты (можно отключить)
    setInterval(() => {
      try {
        bot.chat('I am alive and keeping the server online!');
      } catch {}
    }, 180000);
  });

  bot.on('kicked', reason => console.log('[BOT] Kicked:', reason));
  bot.on('error', err => console.log('[BOT] Error:', err.message));
  bot.on('end', () => {
    console.log('[BOT] Disconnected. Reconnecting in 10s...');
    setTimeout(createBot, 10000);
  });
}

createBot();
