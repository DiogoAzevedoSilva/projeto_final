// Lista temporária de tarefas
let tarefas = [
  {
    id: 1,
    name: "Organizar documentos pessoais",
    description: "Separar documentos importantes e guardar numa pasta digital.",
    category: "pessoal",
    priority: 2,
    date_start: "2026-06-18",
    date_finish_pred: "2026-06-22",
    status: "ainiciar"
  },
  {
    id: 2,
    name: "Preparar apresentação",
    description: "Rever slides e alinhar os principais pontos do projeto.",
    category: "profissional",
    priority: 3,
    date_start: "2026-06-18",
    date_finish_pred: "2026-06-21",
    status: "iniciado"
  },
  {
    id: 3,
    name: "Fazer caminhada",
    description: "Reservar 30 minutos para caminhar e respirar um pouco.",
    category: "bem_estar",
    priority: 1,
    date_start: "2026-06-17",
    date_finish_pred: "2026-06-17",
    status: "concluido"
  },
  {
    id: 4,
    name: "Ver episódio da série",
    description: "Separar um momento leve para descansar depois do estudo.",
    category: "lazer",
    priority: 1,
    date_start: "2026-06-14",
    date_finish_pred: "2026-06-15",
    status: "atrasado"
  },
  {
    id: 5,
    name: "Atualizar repositório",
    description: "Fazer commit das alterações finais no GitHub.",
    category: "profissional",
    priority: 3,
    date_start: "2026-06-18",
    date_finish_pred: "2026-06-20",
    status: "iniciado"
  }
];

// Buscar elementos do HTML
const formTarefa = document.getElementById("formTarefa");

// Transformar prioridade em texto
function textoPrioridade(priority) {
  if (Number(priority) === 1) return "Low";
  if (Number(priority) === 2) return "Medium";
  if (Number(priority) === 3) return "High";
  return "Sem prioridade";
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
    .filter((tarefa) => tarefa.status === "ainiciar")
    .slice(0, 5)
    .forEach((tarefa) => {
      colAIniciar.innerHTML += criarCardTarefa(tarefa);
    });

  tarefas
    .filter((tarefa) => tarefa.status === "iniciado")
    .slice(0, 5)
    .forEach((tarefa) => {
      colIniciado.innerHTML += criarCardTarefa(tarefa);
    });

  tarefas
    .filter((tarefa) => tarefa.status === "concluido")
    .slice(0, 5)
    .forEach((tarefa) => {
      colConcluido.innerHTML += criarCardTarefa(tarefa);
    });

  tarefas
    .filter((tarefa) => tarefa.status === "atrasado")
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
      status: "ainiciar"
    };

    tarefas.push(novaTarefa);

    formTarefa.reset();

    renderizarKanbanHome();
    renderizarListaTarefas();
  });
}

// Iniciar página
renderizarKanbanHome();
renderizarListaTarefas();