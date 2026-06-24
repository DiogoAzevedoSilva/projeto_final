let tarefas = [];

const API_URL = "/api/tarefas";

document.addEventListener("DOMContentLoaded", () => {
  const formTarefa = document.getElementById("formTarefa");

  if (formTarefa) {
    formTarefa.addEventListener("submit", criarTarefa);
  }

  carregarTarefas();
});

function textoPrioridade(priority) {
  if (Number(priority) === 1) return "baixa";
  if (Number(priority) === 2) return "media";
  if (Number(priority) === 3) return "alta";
  return "sem-prioridade";
}

function textoStatus(status) {
  if (status === "planeada") return "Planeada"; 
  if (status === "iniciada") return "Iniciada"; 
  if (status === "concluida") return "Concluida"; 
  if (status === "atrasada") return "Atrasada"; 
  return status || "Sem status";
}

async function carregarTarefas() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar tarefas");
    }

    tarefas = await response.json();

    renderizarKanban();
    renderizarCategoria();
    atualizarResumoTarefas();
    
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
  }
}

function criarCardTarefa(tarefa) {
  const prioridade = textoPrioridade(tarefa.priority);

  return `
    <div class="tarefa-card tarefa-${tarefa.category}">
      <h4>${tarefa.name}</h4>
      <p>${tarefa.description}</p>

      <div class="tarefa-meta">
        <span class="tag tag-${tarefa.category}">${tarefa.category}</span>
        <span class="priority-${prioridade}">${prioridade}</span>
        <span class="status-${tarefa.status}">${textoStatus(tarefa.status)}</span>
      </div>

      <div class="tarefa-datas">
        <span>Inicio: ${formatarData(tarefa.date_start)}</span>
        <span>Fim previsto: ${formatarData(tarefa.date_finish_pred)}</span>
      </div>

      <div class="tarefa-acoes">
        ${
          tarefa.status !== "concluida"
            ? `<button class="btn-concluir" onclick="concluirTarefa(${tarefa.id})">Concluir</button>`
            : ""
        }
        
        <button class="btn-editar" onclick="editarTarefa(${tarefa.id})">Editar</button>
        <button class="btn-apagar" onclick="apagarTarefa(${tarefa.id})">Apagar</button>
      </div>
    </div>
  `;
}

function renderizarKanban() {
  const colAIniciar = document.getElementById("tarefasAIniciar");
  const colIniciado = document.getElementById("tarefasIniciado");
  const colConcluido = document.getElementById("tarefasConcluido");
  const colAtrasado = document.getElementById("tarefasAtrasado");

  if (!colAIniciar || !colIniciado || !colConcluido || !colAtrasado) {
    return;
  }
  colAIniciar.innerHTML = "";
  colIniciado.innerHTML = "";
  colConcluido.innerHTML = "";
  colAtrasado.innerHTML = "";

  tarefas.forEach((tarefa) => {
    const card = criarCardTarefa(tarefa);
    console.log(card)
    console.log(tarefa.status)
    if (tarefa.status === "planeada") {
      console.log("Adicionando tarefa à coluna A Iniciar:", tarefa);
      colAIniciar.innerHTML += card;
    }

    if (tarefa.status === "iniciada") {
      colIniciado.innerHTML += card;
    }

    if (tarefa.status === "concluida") {
      colConcluido.innerHTML += card;
    }

    if (tarefa.status === "atrasada") {
      colAtrasado.innerHTML += card;
    }
  });
}

// function renderizarListaTarefas() {
//   const listaTarefas = document.querySelector(".lista-tarefas");

//   if (!listaTarefas) {
//     return;
//   }

//   listaTarefas.innerHTML = "";

//   tarefas.forEach((tarefa) => {
//     listaTarefas.innerHTML += criarCardTarefa(tarefa);
//   });
// }

async function criarTarefa(event) {
  event.preventDefault();

  const formTarefa = document.getElementById("formTarefa");

  const novaTarefa = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    date_start: document.getElementById("date_start").value,
    date_finish_pred: document.getElementById("date_finish_pred").value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novaTarefa)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro || "Erro ao criar tarefa");
      return;
    }

    formTarefa.reset();
    await carregarTarefas();
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    alert("Erro ao criar tarefa");
  }
}

async function concluirTarefa(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/statusConcluida`, {
      method: "PATCH"
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro || "Erro ao concluir tarefa");
      return;
    }

    await carregarTarefas();
  } catch (error) {
    console.error("Erro ao concluir tarefa:", error);
  }
}

async function editarTarefa(id) {
  const tarefa = tarefas.find((item) => item.id === id);

  if (!tarefa) {
    alert("Tarefa não encontrada");
    return;
  }

  const name = prompt("Nome da tarefa:", tarefa.name);
  const description = prompt("Descrição:", tarefa.description);
  const category = prompt("Categoria: pessoal, profissional, bem_estar, lazer ou outro", tarefa.category);
  const priority = prompt("Prioridade 1, 2 ou 3:", tarefa.priority);
  const date_start = prompt("Data de início YYYY-MM-DD:", formatarData(tarefa.date_start));
  const date_finish_pred = prompt("Data fim prevista YYYY-MM-DD:", formatarData(tarefa.date_finish_pred));

  if (!name || !description || !category || !priority || !date_start || !date_finish_pred) {
    alert("Edição cancelada ou campos incompletos");
    return;
  }

  const tarefaAtualizada = {
    name,
    description,
    category,
    priority,
    date_start,
    date_finish_pred
  };

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tarefaAtualizada)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro || "Erro ao atualizar tarefa");
      return;
    }

    await carregarTarefas();
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    alert("Erro ao atualizar tarefa");
  }
}

async function apagarTarefa(id) {
  const confirmar = confirm("Tem certeza que deseja apagar esta tarefa?");

  if (!confirmar) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

   if (!response.ok) {
  console.log("Erro do PUT:", data);
  alert(data.erro || data.error || "Erro ao atualizar tarefa");
  return;
}

    await carregarTarefas();
  } catch (error) {
    console.error("Erro ao apagar tarefa:", error);
  }
   
}

function formatarData(data) {
  if (!data) {
    return "-";
  }

  return String(data).slice(0, 10);
}

function renderizarCategoria() {
  const paginaCategoria = document.querySelector(".pagina-categoria");
  const listaCategoria = document.getElementById("tarefasCategoria");

  if (!paginaCategoria || !listaCategoria) {
    return;
  }

  const categoriaAtual = paginaCategoria.dataset.categoria;

  listaCategoria.innerHTML = "";

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    return tarefa.category === categoriaAtual;
  });

  if (tarefasFiltradas.length === 0) {
    listaCategoria.innerHTML = "<p>Nenhuma tarefa nesta categoria.</p>";
    return;
  }

  tarefasFiltradas.forEach((tarefa) => {
    listaCategoria.innerHTML += criarCardTarefa(tarefa);
  });
}

function atualizarResumoTarefas() {
  const totalPlaneadas = document.getElementById("totalPlaneadas");
  const totalIniciadas = document.getElementById("totalIniciadas");
  const totalAtrasadas = document.getElementById("totalAtrasadas");
  const totalConcluidas = document.getElementById("totalConcluidas");

  if (!totalPlaneadas || !totalIniciadas || !totalAtrasadas || !totalConcluidas) {
    return;
  }

  const planeadas = tarefas.filter((tarefa) => tarefa.status === "planeada").length;
  const iniciadas = tarefas.filter((tarefa) => tarefa.status === "iniciada").length;
  const atrasadas = tarefas.filter((tarefa) => tarefa.status === "atrasada").length;
  const concluidas = tarefas.filter((tarefa) => tarefa.status === "concluida").length;

  totalPlaneadas.textContent = planeadas;
  totalIniciadas.textContent = iniciadas;
  totalAtrasadas.textContent = atrasadas;
  totalConcluidas.textContent = concluidas;
}