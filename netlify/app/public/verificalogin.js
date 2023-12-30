document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
  });
  
  
function verificarAutenticacao() {
    fetch('/netlify/functions/api/verificarAutenticacao')
      .then(response => response.json())
      .then(data => {
        if (!data.autenticado) {
          alert('Você não está autenticado. Redirecionando para a página de login.');
          window.location.href = '/login.html'; // Redirecionar para a página de login
        }
      });
  }