// Lista temporária de tarefas
let tarefas = [];

// Buscar elementos do HTML
const formTarefa = document.getElementById("formTarefa");

// Transformar prioridade em texto
function textoPrioridade(priority) {
  if (Number(priority) === 1) return "baixa";
  if (Number(priority) === 2) return "média";
  if (Number(priority) === 3) return "alta";
  return "Sem prioridade";
}
//carregar tarefas do backend
function carregarTarefas() {
  fetch("/api/tarefas")
    .then((response) => response.json())
    .then((data) => {
      tarefas = data;
      console.log("Tarefas carregadas:", tarefas);
      renderizarKanbanHome();
      renderizarListaTarefas();
      console.log("Tarefas renderizadas:", tarefas);
    });
}
 
// Criar o HTML de cada tarefa
function criarCardTarefa(tarefa) {
  return `
    <div class="tarefa-card tarefa-${tarefa.category}">
      <h4>${tarefa.name}</h4>
      <p>${tarefa.description}</p>

      <div class="tarefa-meta">
        <span class="tag tag-${tarefa.category}">${tarefa.category}</span>

        <span class="priority-${textoPrioridade(tarefa.priority).toLowerCase()}">
          ${textoPrioridade(tarefa.priority)}
        </span>

        <span class="status-${tarefa.status}">
          ${tarefa.status}
        </span>
      </div>

      <div class="tarefa-datas">
        <span>📅 Início: ${tarefa.date_start || "-"}</span>
        <span>🏁 Fim: ${tarefa.date_finish_pred || "-"}</span>
      </div>

      <div class="tarefa-acoes">
        <button class="btn-concluir">Concluir</button>
        <button class="btn-editar">Editar</button>
        <button class="btn-apagar">Apagar</button>
      </div>
    </div>
  `;
}

// Mostrar tarefas no Kanban da Home
function renderizarKanbanHome() {
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

  tarefas
    .filter((tarefa) => tarefa.status === "planeada")
    .slice(0, 5)
    .forEach((tarefa) => {
      console.log("Tarefa para iniciar:", tarefa);
      colAIniciar.innerHTML += criarCardTarefa(tarefa);
    });

  tarefas
    .filter((tarefa) => tarefa.status === "iniciada")
    .slice(0, 5)
    .forEach((tarefa) => {
      colIniciado.innerHTML += criarCardTarefa(tarefa);
    });

  tarefas
    .filter((tarefa) => tarefa.status === "concluida")
    .slice(0, 5)
    .forEach((tarefa) => {
      colConcluido.innerHTML += criarCardTarefa(tarefa);
    });

  tarefas
    .filter((tarefa) => tarefa.status === "atrasada")
    .slice(0, 5)
    .forEach((tarefa) => {
      colAtrasado.innerHTML += criarCardTarefa(tarefa);
    });
}

// Mostrar todas as tarefas na página tarefas.html
function renderizarListaTarefas() {
  const listaTarefas = document.querySelector(".lista-tarefas");

  if (!listaTarefas) {
    return;
  }

  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa) => {
    listaTarefas.innerHTML += criarCardTarefa(tarefa);
  });
}

// Criar nova tarefa pelo formulário
if (formTarefa) {
  formTarefa.addEventListener("submit", function (event) {
    event.preventDefault();

    const novaTarefa = {
      id: Date.now(),
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value,
      priority: document.getElementById("priority").value,
      date_start: document.getElementById("date_start").value,
      date_finish_pred: document.getElementById("date_finish_pred").value,
      status: "planeada"
    };

fetch("/api/tarefas", {
   method: "POST",
   headers: {
     "Content-Type": "application/json"
   },
   body: JSON.stringify(novaTarefa)
 });  

    formTarefa.reset();

    renderizarKanbanHome();
    renderizarListaTarefas();
  });
}

// Iniciar página
carregarTarefas();
renderizarListaTarefas();
renderizarKanbanHome();
