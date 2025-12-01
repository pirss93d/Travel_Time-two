const express = require("express"); // подключение   веб-фреймворк Express.
const app = express(); // app — это приложение Express, которое обрабатывает GET-запросы к корню / и отвечает текстом.
const bot = require("./bot"); // импортируем  бота
const fs = require("fs"); //Модуль fs предоставляет API для работы с файловой системой
const path = require("path"); //
const session = require("express-session"); //
const LocalStrategy = require("passport-local").Strategy;
let subscribersFile = "./subscribers.json"; //
let subscribers = new Set();

const bcrypt = require("bcrypt");
const passport = require("passport");
const sqlite3 = require("sqlite3").verbose(); //SQllite
const db = require("./db"); //SQllite
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "ваш_секрет", // Любая строка, используемая для подписи cookie
    resave: false, // Экономия ресурсов, если ничего не меняется в сессии
    saveUninitialized: false, // Не сохранять пустые сессии
  })
);



// ***
app.get('/users', (req, res) => {
  // Запрос всех пользователей из таблицы users (замените на вашу таблицу)
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows); // Отправляем массив пользователей в JSON
  });
});
// ***
app.use(passport.initialize());
app.use(passport.session());
//Реализация регистрации пользователей в базу данных SQllite users.db

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // Пользователь авторизован — отдаём контент
    return next();
  }
  // Не авторизован — отправляем на логин
  res.redirect("/login");
}

app.get("/", ensureAuthenticated, (req, res) => {
  if (req.user.username === "admin") {
    res.sendFile(__dirname + "/admin/mainAdmin.html"); // для пользователя admin
  } else {
    res.sendFile(__dirname + "/protected/main.html"); // для всех остальных
  }

  // main.html ДОЛЖЕН лежать вне public
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
   
});
// app.get("/admin", ensureAuthenticated, (req, res) => {
//   res.sendFile(__dirname + "/admin/mainAdmin.html"); // main.html ДОЛЖЕН лежать вне public
// });
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Admin Admin
// --------------------Обновление новых подписок !!!
function loadSubscribers() {
  try {
    const data = fs.readFileSync(subscribersFile, 'utf8');
    subscribers = new Set(JSON.parse(data));
    console.log("Subscribers loaded/updated");
  } catch(e) {
    console.error("Failed to load subscribers", e);
  }
}

// Загрузить при старте
loadSubscribers();

// Автоматически обновлять при изменении файла
fs.watch(subscribersFile, (eventType) => {
  if (eventType === 'change') loadSubscribers();
});

// --------------------



// Стратегия Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(null, false, { message: "Пользователь не найден" });
        if (!bcrypt.compareSync(password, user.password))
          return done(null, false, { message: "Неверный пароль" });
        return done(null, user);
      }
    );
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    if (err || !user) return done(null, false);
    return done(null, user);
  });
});

// Маршрут регистрации
app.post("/register", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).send("Заполните оба поля.");
  const hashed = bcrypt.hashSync(password, 10);
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [name, hashed],
    function (err) {
      if (err) {
        return res.status(400).send("Пользователь уже существует");
      }
      res.send("Регистрация прошла успешно");
    }
  );
});

// ------------


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

if (fs.existsSync(subscribersFile)) {
  const saved = JSON.parse(fs.readFileSync(subscribersFile));
  subscribers = new Set(saved);
}
function broadcastMessage(text) {
  subscribers.forEach((chatId) => {
    bot.telegram.sendMessage(chatId, text).catch(console.error);
  });
}

app.use(express.static("public")); //директива в Express.js, которая подключает встроенный middleware для обслуживания статических файлов из папки
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/new-application", (req, res) => {
  const { address, data, time, passenger, message, email } = req.body;
  const text = `Новая заявка! 🚀\nАдрес: ${address}\nДата: ${data} Время: ${time}⌚\nПасажиров: ${passenger}\nСообщение: ${message}💭\nEmail: ${email}`;

  broadcastMessage(text);

  res.json({ status: "OK", message: "Заявка принята ✅" });
});



// Login
app.get('/api/current_user', (req, res) => {
  if (req.user) {
    res.json({ username: req.user.username });
  } else {
    res.json({ username: null });
  }
});



// ЛОгика удаление пользователя 
app.delete('/users/:id', ensureAuthenticated, (req, res) => {
  const userId = req.params.id;

  // Проверяем, что пользователь имеет права (например, admin), можно добавить вашу логику проверки
  if (req.user.username !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }

  db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json({ message: 'Пользователь успешно удален' });
  });
});
// 
// 
// 






// 
// 
// 








app.listen(3000,() => console.log("Сервер запущен на http://localhost:3000"));
