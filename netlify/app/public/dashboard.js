// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  carregarSecoes();
});

function carregarSecoes() {
  fetch('/netlify/functions/api/obterSecoes', {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      const listaSecoes = document.getElementById('listaSecoes');

      // Limpar a lista antes de adicionar os novos itens
      listaSecoes.innerHTML = '';

      if (data.length > 0) {
        data.forEach(secao => {
          const li = document.createElement('li');
          li.innerHTML = `<div class="title"><h4>Seção: ${secao}</div>`;

          // Adicionar ícones
          const iconeFila = criarIcone('🕒', 'Na Fila', secao);
          const iconeProcesso = criarIcone('🚧', 'Em Processo', secao);
          const iconeFinalizado = criarIcone('✅', 'Finalizado', secao);

          li.appendChild(iconeFila);
          li.appendChild(iconeProcesso);
          li.appendChild(iconeFinalizado);

          // Adicionar evento de clique na seção para exibir detalhes
          li.addEventListener('click', () => abrirDetalhesSecao(secao));

          // Obter o status da seção do banco de dados
          fetch(`/netlify/functions/api/obterStatusSecao/${secao}`, {
            method: 'GET',
            credentials: 'include',
          })
            .then(response => response.json())
            .then(statusData => {
              // Adicionar a classe correspondente ao status
              li.classList.add(statusData.status.toLowerCase().replace(' ', ''));

              listaSecoes.appendChild(li);
            });
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma seção disponível.';
        listaSecoes.appendChild(li);
      }
    });
}

function criarIcone(emoji, novoStatus, secao) {
  const icone = document.createElement('span');
  icone.className = 'icone';
  icone.innerHTML = `<div class="emoji">${emoji}</div>`;
  icone.addEventListener('click', () => atualizarStatus(secao, novoStatus));
  return icone;
}

function atualizarStatus(secao, novoStatus) {
  fetch('/netlify/functions/api/atualizarStatusSecao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ secao, novoStatus }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Atualize o texto do status na interface do usuário
        alert('Status atualizado com sucesso!');
        carregarSecoes(); // Recarregar a lista após a atualização
      } else {
        console.error('Erro ao atualizar o status.');
      }
    });
}

function abrirDetalhesSecao(secao) {
  // Redirecionar para a página de detalhes da seção
  window.location.href = `/detalhesSecao.html?secao=${secao}`;
}
