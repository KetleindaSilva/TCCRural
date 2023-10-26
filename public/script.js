// script.js
document.getElementById("buscarPorCategoria").addEventListener("click", function() {
    const categoriaId = document.getElementById("categoria_id").value;
  
    fetch(`/receitas/categoria/${categoriaId}`)
      .then(response => response.json())
      .then(data => {
        const receitasContainer = document.getElementById("receitas");
  
        receitasContainer.innerHTML = '';
  
        if (data && data.length > 0) {
          data.forEach(receita => {
            const receitaDiv = document.createElement('div');
            receitaDiv.textContent = receita.titulo;
            receitasContainer.appendChild(receitaDiv);
          });
        } else {
          receitasContainer.textContent = 'Nenhuma receita encontrada para esta categoria.';
        }
      })
      .catch(error => {
        console.error("Erro ao buscar receitas por categoria:", error);
      });
  });
  