const express = require("express"); // подключение   веб-фреймворк Express.
const app = express(); // app — это приложение Express, которое обрабатывает GET-запросы к корню / и отвечает текстом.
const bot = require("./bot"); // импортируем  бота
const fs = require("fs"); //Модуль fs предоставляет API для работы с файловой системой
const subscribersFile = "./subscribers.json"; // Те кто подписался через Т.Г
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { findUserByLogin, addUser } = require("./db");

//
app.use(express.static(path.join(__dirname, "public")));

// Стратегия _ Стратегия
passport.use(
  new LocalStrategy(
    { usernameField: "login", passwordField: "password" }, // поля формы
    async (username, password, done) => {
      try {
        // ищем пользователя по логину
        findUserByLogin(username, async (err, user) => {
          if (err) return done(err);
          if (!user)
            return done(null, false, { message: "Пользователь не найден" });
          // сравниваем пароли
          const valid = await bcrypt.compare(password, user.password_hash);
          if (!valid) return done(null, false, { message: "Неверный пароль" });
          return done(null, user);
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id); // сохраняем id пользователя в сессию
});

passport.deserializeUser((id, done) => {
  findUserById(id, (err, user) => {
    if (err) return done(err);
    return done(null, user); // возвращаем пользователя по id
  });
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login.html"); // или другое действие
}

// Защищённый маршрут
app.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.send("Только для авторизованных");
});

// Стратегия _ Стратегия  END END
//

//BOT BOT BOT BOT  server
let subscribers = new Set();
if (fs.existsSync(subscribersFile)) {
  const saved = JSON.parse(fs.readFileSync(subscribersFile));
  subscribers = new Set(saved);
}
function broadcastMessage(text) {
  subscribers.forEach((chatId) => {
    bot.telegram.sendMessage(chatId, text).catch(console.error);
  });
}
//BOT server //BOT server //BOT server END....
app.use(express.urlencoded({ extended: true }));

app.post("/new-application", (req, res) => {
  const { address, data, time, passenger, message, email } = req.body;
  const text = `Новая заявка! 🚀\nАдрес: ${address}\nДата: ${data} Время: ${time}⌚\nПасажиров: ${passenger}\nСообщение: ${message}💭\nEmail: ${email}`;

  broadcastMessage(text);

  res.json({ status: "OK", message: "Заявка принята ✅" });
});

app.listen(3000, () => console.log("Сервер запущен на http://localhost:3000"));
