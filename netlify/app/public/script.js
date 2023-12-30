function enviarTexto() {
  const section = document.getElementById('inputSection').value;
  const problem = document.getElementById('inputProblem').value;
  const texto = document.getElementById('inputText').value;

  fetch('/netlify/functions/api/enviar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ section, problem, texto }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Texto enviado com sucesso!');
      window.location.href = '/lista.html';
    } else {
      alert('Erro ao enviar texto.');
    }
  });
}
