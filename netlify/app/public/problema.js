document.addEventListener('DOMContentLoaded', () => {
  exibirInformacoes();
});

function exibirInformacoes() {
  const urlParams = new URLSearchParams(window.location.search);
  const problemaTituloElemento = document.getElementById('problemaTitulo');
  const problemaConteudoElemento = document.getElementById('problemaConteudo');

  if (urlParams.has('id')) {
    const textoId = urlParams.get('id');

    // Obter os detalhes do texto pelo ID
    fetch(`/netlify/functions/api/obterDetalhesPorId/${textoId}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          problemaTituloElemento.innerHTML = `Informações da Seção: <strong>${data.section}</strong>`;
          problemaConteudoElemento.innerHTML = `
            <h2>Problema:</h2><p> ${data.problem}</p>
            <h2>Descrição:</h2><p> ${data.conteudo}</p>
          `;
        } else {
          problemaTituloElemento.textContent = 'Informações não encontradas.';
        }
      });
  } else {
    problemaTituloElemento.textContent = 'Informações não encontradas.';
  }
}
