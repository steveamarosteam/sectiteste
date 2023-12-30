document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', realizarLogin);
  });
  
  function realizarLogin(event) {
    event.preventDefault();
  
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
  
    fetch('/netlify/functions/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, senha }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Login realizado com sucesso!');
        window.location.href = '/lista.html'; // Redirecionar para a página de lista
      } else {
        alert('Usuário ou senha inválidos. Tente novamente.');
      }
    });
  }
  
  