//Функция для кнопки заказать по булевому значению.
let isOpen = false;

const btn = document.querySelector(".main_order");
const btn_on = document.querySelector(".btn_order");
const btn_push = document.querySelector("#form_btn-push");


const block_help = document.querySelector(".main_block-helper");
const btn_helper = document.querySelector(".main_help");
document.querySelector('form').onsubmit = function(e) {
  e.preventDefault();
  const formData = {
    username: this.username.value,
    password: this.password.value
  };
  registerUser(formData);
};


////admin panel user END.
let isOpen_help = false;

btn.addEventListener("click", function () {
  if (!isOpen) {
    btn_on.style.display = "flex";
    btn.textContent = "Свернуть";
    isOpen = true;
  } else {
    btn_on.style.display = "none";
    btn.textContent = "Заказать";
    isOpen = false;
  }
});

btn_helper.addEventListener("click", function () {
  if (!isOpen_help) {
    block_help.style.display = "flex";
    isOpen_help = true;
  } else {
    block_help.style.display = "none";
    isOpen_help = false;
  }
});



// 
document.getElementById('form_one').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  
  const formData = new URLSearchParams();
  formData.append('address', document.getElementById('adres').value);
  formData.append('data', document.getElementById('date').value);
  formData.append('time', document.getElementById('time').value);
  formData.append('passenger', document.getElementById('number').value);
  formData.append('message', document.getElementById('coment').value);
  
  fetch('/submit-form', {  // ← /submit-form!
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  })
  .then(r => r.json())
  .then(data => {
    alert(data.message);
    form.reset();
  })
  .catch(() => alert('Ошибка'));
});



// Отображение пользователя после авторизации 
fetch('/api/current_user')
    .then(response => response.json())
    .then(data => {
      const usernameSpan = document.getElementById('username');
      if (data.username) {
        usernameSpan.textContent = data.username;
      } else {
        usernameSpan.textContent = 'гость';
      }
    })
    .catch(() => {
      document.getElementById('username').textContent = 'гость';
    });


// Аналитика по пользователям
 // Функция для получения и отображения количества пользователей
    function loadUserCount() {
      fetch('/users/count')
        .then(response => response.json())
        .then(data => {
          document.getElementById('userCount').textContent = data.count;
        })
        .catch(error => {
          document.getElementById('userCount').textContent = 'Ошибка загрузки';
          console.error(error);
        });
    }

   

// Сообщене что скрипт работает.
console.log("app JS Start!");
