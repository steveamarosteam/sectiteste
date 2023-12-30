// detalhesSecao.js
document.addEventListener('DOMContentLoaded', () => {
    exibirDetalhesSecao();
  });
  
  function exibirDetalhesSecao() {
    const urlParams = new URLSearchParams(window.location.search);
    const secaoTituloElemento = document.getElementById('secaoTitulo');
    const listaDetalhesSecao = document.getElementById('listaDetalhesSecao');
  
    if (urlParams.has('secao')) {
      const secao = urlParams.get('secao');
      secaoTituloElemento.innerHTML = `<h3>Detalhes da Seção: <strong>${secao}</strong>`;
  
      fetch(`/netlify/functions/api/obterDetalhesSecao/${secao}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          // Limpar a lista antes de adicionar os novos itens
          listaDetalhesSecao.innerHTML = '';
  
          if (data.length > 0) {
            data.forEach(texto => {
              const li = document.createElement('li');
              li.innerHTML = `<h2>Problema: <p>${texto.problem} <h2> Descrição: <p>${texto.conteudo}`;
              listaDetalhesSecao.appendChild(li);
            });
          } else {
            const li = document.createElement('li');
            li.textContent = 'Nenhum detalhe disponível para esta seção.';
            listaDetalhesSecao.appendChild(li);
          }
        });
    } else {
      secaoTituloElemento.textContent = 'Detalhes não encontrados.';
    }
  }

  