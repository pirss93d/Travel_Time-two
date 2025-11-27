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

// Открывает в админке регистрацию ***
// let isOpen_admin_registr = false;
// btn_admin_registr.addEventListener("click", function(){
//   if(!isOpen_admin_registr){
//    form_admin_registr.style.display = "flex";
//     isOpen_admin_registr = true;
//   }else{
//     form_admin_registr.style.display = "none";
//     isOpen_admin_registr = false
//   }
// })

// 
document
  .getElementById("form_one")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/new-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Заявка успешно отправлена!");
        this.reset();
      } else {
        alert(result.message || "Ошибка отправки заявки");
      }
    } catch (error) {
      alert("Ошибка сети");
    }
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

    // Функция для получения и отображения списка пользователей
  

// 
// Статус регистрации 
  // document.getElementById("registerForm").addEventListener("submit", function(event) {
  //   event.preventDefault();
  //   const formData = new FormData(this);
  //   fetch('/register', {
  //     method: 'POST',
  //     body: new URLSearchParams(formData)
  //   })
  //   .then(response => response.text())
  //   .then(text => alert(text))
  //   .catch(err => alert('Ошибка при регистрации'));
  // });




// 

// выврод пользователей 

// 
  // const form = document.getElementById('registerForm');
  // form.addEventListener('submit', async function (e) {
  //   e.preventDefault(); // отменяем обычную отправку формы
  //   const formData = new FormData(form);
  //   const response = await fetch('/register', {
  //     method: 'POST',
  //     body: formData
  //   });
  //   const text = await response.text();
  //   alert(text);
  //   if (response.ok) {
      // можно очистить форму или перенаправить вручную, если надо:
      // window.location.href = '/login';
  //   }
  // });
// Сообщене что скрипт работает.
console.log("app JS Start!");
