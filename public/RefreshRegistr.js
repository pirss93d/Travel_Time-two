// Конструкция для отображение алерата на фронте об успешной регистрации .


document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new URLSearchParams();
  formData.append('name', document.getElementById('name').value);
  formData.append('password', document.getElementById('password').value);

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formData.toString()
  })
    .then(response => response.text())
    .then(text => alert(text))
    .catch(err => console.error(err));
});
console.log("Start REfresh ")