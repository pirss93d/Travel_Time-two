 
//  Пропрос пользователей через db.js
 
fetch('/users')
  .then(res => res.json())
  .then(users => {
    const tbody = document.getElementById('users-body');
    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td >${u.id}</td>
        <td >${u.username}</td>
        <td>
          <button class="delete-btn" data-id="${u.id}">Удалить</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Добавляем обработчик события на все кнопки удаления
    tbody.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', event => {
        const userId = event.target.getAttribute('data-id');

        fetch(`/users/${userId}`, {
          method: 'DELETE'
        })
        .then(res => {
          if (res.ok) {
            // Удаляем строку из таблицы после успешного удаления
            event.target.closest('tr').remove();
          } else {
            alert('Ошибка при удалении пользователя');
          }
        });
      });
    });
  });

      console.log("User_Tab okey")