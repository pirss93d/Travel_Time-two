const { Telegraf, Markup } = require("telegraf"); //  библиотеки Telegraf два объекта: Telegraf и MArkup для интерфейса кнопок.
const bot = new Telegraf("8293335278:AAHVN5rs4yWEzzkdjZr_0t0KaQFa9xdZvZ8"); //Токен Telegram bota.
const fs = require("fs"); //Модуль fs предоставляет API для работы с файловой системой.
let subscribers = new Set(); // создается пустое множество (Set) для хранения уникальных подписчиков.
let subscribersFile = "./subscribers.json"; // JSON фаил с подписчиками на которых ведётся рассылка.

if (fs.existsSync(subscribersFile)) {
  //проверяется, существует ли файл с названием, указанным в subscribersFile.
  const saved = JSON.parse(fs.readFileSync(subscribersFile)); //Если файл есть, его содержимое читается с помощью fs.readFileSync(subscribersFile) (синхронное чтение файла).
  subscribers = new Set(saved); //Этот массив передается в конструктор Set, чтобы создать множество уникальных значений (подписчиков).
}

function saveSubscribers() {
  fs.writeFileSync(subscribersFile, JSON.stringify(Array.from(subscribers)));
}




bot.start((ctx) => {
   if (!subscribers.has(ctx.chat.id)) {
    subscribers.add(ctx.chat.id);      // Добавляем в множество
    saveSubscribers();                 // Сохраняем в файл
    console.log("Новый подписчик добавлен:", ctx.chat.id);
  }
  return ctx.reply(
    `Привет, ${ctx.from.first_name || "друг"}! Я твой бот.`,
    Markup.keyboard([
      ["Помощь", "Информация"],
      ["Настройки", "Связаться"],
    ]).resize()
  );
});

bot.hears("Помощь", (ctx) => {
  ctx.reply(
    "Вот что я умею:\n/start — начать\n/help — помощь\nИ еще немного...\nНастройка 👉Подписаться ✅"
  );
});

bot.hears("Информация", (ctx) => {
  ctx.reply("Это простой бот для заявок");
});


bot.hears("Настройки", (ctx) => {
  const userId = ctx.from.id;
  if (subscribers.has(userId)) {
    ctx.reply(
      "Вы подписаны. Можете отписаться кнопкой ниже.",
      Markup.inlineKeyboard([
        Markup.button.callback("Отписаться ❌", "unsubscribe"),
      ])
    );
  } else {
    ctx.reply(
      "Вы не подписаны. Можете подписаться кнопкой ниже.",
      Markup.inlineKeyboard([
        Markup.button.callback("Подписаться ✅", "subscribe"),
      ])
    );
  }
});

bot.action("subscribe", (ctx) => {
  const userId = ctx.from.id;
  if (!subscribers.has(userId)) {
    subscribers.add(userId);
    saveSubscribers(subscribers);
    ctx.editMessageText("Вы успешно подписались.✅");
  } else {
    ctx.answerCbQuery("Вы уже подписаны. ✅");
  }
});

bot.action("unsubscribe", (ctx) => {
  const userId = ctx.from.id;
  if (subscribers.has(userId)) {
    subscribers.delete(userId);
    saveSubscribers(subscribers);
    ctx.editMessageText("Вы успешно отписались.");
  } else {
    ctx.answerCbQuery("Вы не были подписаны.");
  }
});
//Связаться
bot.hears("Связаться", (ctx) => {
  ctx.reply("Свяжитесь со мной через . Поддержку");
});

//TEST

//TEST//TEST//TEST//TEST//TEST

bot.help((ctx) => ctx.reply("Что я умею:\n/start – начать\n/help – помощь"));

bot.on("text", (ctx) => ctx.reply(`Ты написал: ${ctx.message.text}`));

bot.launch();




module.exports = bot;
console.log("Бот запущен...");
