document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    cadastroForm.addEventListener('submit', cadastrarUsuario);
  });
  
  function cadastrarUsuario(event) {
    event.preventDefault();
  
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
  
    fetch('/netlify/functions/api/cadastrarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, senha }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Usuário cadastrado com sucesso!');
        window.location.href = '/login.html'; // Redirecionar para a página de login
      } else {
        alert('Erro ao cadastrar usuário. Tente novamente.');
      }
    });
  }
  