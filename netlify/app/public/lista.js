// Adicione esta função para obter a classe correspondente ao status
function obterClasseStatus(status) {
    switch (status) {
      case 'Na Fila':
        return 'status-na-fila';
      case 'Em Processo':
        return 'status-em-processo';
      case 'Finalizado':
        return 'status-finalizado';
      default:
        return '';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    carregarTextos();
  });
  
  function carregarTextos() {
    fetch('/netlify/functions/api/obterTextos', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        const listaTextos = document.getElementById('listaTextos');
  
        // Limpar a lista antes de adicionar os novos itens
        listaTextos.innerHTML = '';
  
        if (data.length > 0) {
          data.forEach(texto => {
            const li = document.createElement('li');
            li.textContent = `Seção: ${texto.section}`;
  
            // Adicionar classe correspondente ao status
            const statusClass = obterClasseStatus(texto.status);
            li.classList.add(statusClass);
  
            // Adicionar texto do status abaixo do item da lista
            const statusText = document.createElement('span');
            statusText.textContent = `Status: ${texto.status}`;
            li.appendChild(statusText);
  
            li.addEventListener('click', () => abrirInformacoes(texto._id)); // Passar o ID do texto
            listaTextos.appendChild(li);
          });
        } else {
          const li = document.createElement('li');
          li.textContent = 'Nenhum texto disponível.';
          listaTextos.appendChild(li);
        }
      });
  }
  
  // Função para abrir informações em outra página
  function abrirInformacoes(textoId) {
    // Redirecionar para a página de problema com o ID do texto
    window.location.href = `/problema.html?id=${textoId}`;
  }
  
  // Função para realizar o logout
  function realizarLogout() {
    fetch('/netlify/functions/api/logout', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Logout realizado com sucesso!');
          window.location.href = '/login.html'; // Redirecionar para a página de login
        } else {
          alert('Erro ao realizar logout. Tente novamente.');
        }
      });
  }
  