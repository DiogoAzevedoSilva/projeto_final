// Lista temporária de tarefas
let tarefas = [
  {
    id: 1,
    name: "Estudar Node.js",
    description: "Rever Express, rotas e ligação ao MySQL.",
    category: "profissional",
    priority: 3,
    date_start: "2026-06-18",
    date_finish_pred: "2026-06-25",
    status: "iniciado"
  }
];

// Buscar elementos do HTML
const formTarefa = document.getElementById("formTarefa");
const listaTarefas = document.querySelector(".lista-tarefas");

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
    <div class="tarefa-card">
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

// Mostrar tarefas no ecrã
function renderizarTarefas() {
  if (!listaTarefas) return;

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
    renderizarTarefas();
  });
}

// Iniciar página
renderizarTarefas();