// Конструкция для отображение алерата на фронте об успешной регистрации .


document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // ✅ КЛЮЧЕВОЕ: new FormData(this)
  const formData = new FormData(this);
  
  fetch('/register', {
    method: 'POST',
    body: formData  // НЕ JSON.stringify!
  })
  .then(response => response.text())
  .then(text => alert(text))
  .catch(err => console.error(err));
});
console.log("Start REfresh ")