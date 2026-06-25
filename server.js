// Configuraçoes
require("dotenv").config()

// Modulos importados
const express = require("express")
const app = express()
const mysql = require("mysql2/promise")
const PORT = 3000


// Pool
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})


// MIDDLEWARES
app.use(express.json())
app.use(express.static("frontend"))

// Midleware para validação POST
function validarTarefa(req, res, next){
  const categoryValidas = ["bem_estar", "lazer", "pessoal", "profissional", "outro"]
  const {name, description, priority, category, date_start, date_finish_pred} = req.body
  const dataAtual = new Date().toISOString().slice(0, 10)
  
    // lidar com valores inexistentes
  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({erro: "Nome da tarefa é obrigatório"})
  }
  if (typeof description !== "string" || description.trim().length === 0) {
    return res.status(400).json({erro: "Descrição da tarefa é obrigatória"})
  }
  if (priority === undefined || priority === null || priority === "") {
    return res.status(400).json({erro: "Prioridade da tarefa é obrigatória"})
  }
  if (typeof category !== "string" || category.trim().length === 0) {
    return res.status(400).json({erro: "Categoria da tarefa é obrigatória"})
  }
  if (!date_start) {
    return res.status(400).json({erro: "Data de início é obrigatória"})
  }
  if (!date_finish_pred) {
    return res.status(400).json({erro: "Data prevista de conclusão é obrigatória"})
  }

  const nameLimpo = String(name).trim()
  const descriptionLimpo = String(description).trim()
  const priorityNumero = Number(priority)
  const categoryLimpo = String(category).trim().toLowerCase() 
  const date_startLimpo = String(date_start)  
  const date_finish_predLimpo = String(date_finish_pred)  

  if (nameLimpo.length < 2 || nameLimpo.length > 200) {
    return res.status(400).json({erro: "Nome da tarefa obrigatório (entre 2 e 200 caracteres)"}) 
  }
  if (descriptionLimpo.length === 0) {
    return res.status(400).json({erro: "Descrição da tarefa obrigatoria"})
  }
  if (priorityNumero < 1 || priorityNumero > 3){
    return res.status(400).json({erro: "Prioridade da tarefa obrigatoria (entre 1 e 3"})
  }
  if (!categoryValidas.includes(categoryLimpo)) {
    return res.status(400).json({erro: "Categoria inválida"})
  }
  if (date_startLimpo < dataAtual){
    return res.status(400).json({erro: "A data de início da tarefa não pode ser no passado"})
  }
  if (date_startLimpo > date_finish_predLimpo){
    return res.status(400).json({erro: "A data de início da tarefa não pode posterior à data prevista de conclusão"}) 
  }
  if (date_finish_predLimpo < dataAtual){
    return res.status(400).json({erro: "A data prevista de conclusão da tarefa não pode ser no passado"}) 
  }
 
  req.body = {
  name: nameLimpo,
  description: descriptionLimpo,
  priority: priorityNumero,
  category: categoryLimpo,
  date_start: date_startLimpo,
  date_finish_pred: date_finish_predLimpo
}
  next()
}

// Midleware para validação PUT
function validarTarefaPut(req, res, next){
  const categoryValidas = ["bem_estar", "lazer", "pessoal", "profissional", "outro"]
  const {name, description, priority, category, date_start, date_finish_pred} = req.body
  const dataAtual = new Date().toISOString().slice(0, 10)
  
    // lidar com valores inexistentes
  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({erro: "Nome da tarefa é obrigatório"})
  }
  if (typeof description !== "string" || description.trim().length === 0) {
    return res.status(400).json({erro: "Descrição da tarefa é obrigatória"})
  }
  if (priority === undefined || priority === null || priority === "") {
    return res.status(400).json({erro: "Prioridade da tarefa é obrigatória"})
  }
  if (typeof category !== "string" || category.trim().length === 0) {
    return res.status(400).json({erro: "Categoria da tarefa é obrigatória"})
  }
  if (!date_start) {
    return res.status(400).json({erro: "Data de início é obrigatória"})
  }
  if (!date_finish_pred) {
    return res.status(400).json({erro: "Data prevista de conclusão é obrigatória"})
  }

  const nameLimpo = String(name).trim()
  const descriptionLimpo = String(description).trim()
  const priorityNumero = Number(priority)
  const categoryLimpo = String(category).trim().toLowerCase() 
  const date_startLimpo = String(date_start)  
  const date_finish_predLimpo = String(date_finish_pred)  

  if (nameLimpo.length < 2 || nameLimpo.length > 200) {
    return res.status(400).json({erro: "Nome da tarefa obrigatório (entre 2 e 200 caracteres)"}) 
  }
  if (descriptionLimpo.length === 0) {
    return res.status(400).json({erro: "Descrição da tarefa obrigatoria"})
  }
  if (priorityNumero < 1 || priorityNumero > 3){
    return res.status(400).json({erro: "Prioridade da tarefa obrigatoria (entre 1 e 3"})
  }
  if (!categoryValidas.includes(categoryLimpo)) {
    return res.status(400).json({erro: "Categoria inválida"})
  }
  if (date_startLimpo > date_finish_predLimpo){
    return res.status(400).json({erro: "A data de início da tarefa não pode posterior à data prevista de conclusão"}) 
  }
  if (date_finish_predLimpo < dataAtual){
    return res.status(400).json({erro: "A data prevista de conclusão da tarefa não pode ser no passado"}) 
  }

  req.body = {
  name: nameLimpo,
  description: descriptionLimpo,
  priority: priorityNumero,
  category: categoryLimpo,
  date_start: date_startLimpo,
  date_finish_pred: date_finish_predLimpo
}
  next()
}

// Midleware para validar o :id dos parametros
function validarId(req, res, next){
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({erro: "ID inválido"})
  }
  req.params.id = id 
  next()
}


// ROTAS

// Rota principal
app.get("/", (req,res)=>{
  const mensagem = {mensagem: "Principal"}
  res.json(mensagem)
})

// GET all
app.get("/api/tarefas", async (req,res)=>{
  try { 
    const get_tarefas = await pool.execute(`
      SELECT 
        id,
        name,
        description,
        status,
        priority,
        category,
        DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start,
        DATE_FORMAT(date_finish_pred, '%Y-%m-%d') AS date_finish_pred
      FROM tarefas`)
    return res.status(200).json(get_tarefas[0])
  }
  catch (error) {
    return res.status(400).json({ error: "Erro ao buscar tarefas" })
  }
})

// GET :id
app.get("/api/tarefas/:id", validarId, async (req,res) =>{
  try {
    const id = req.params.id
    const query = `
      SELECT 
        id,
        name,
        description,
        status,
        priority,
        category,
        DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start,
        DATE_FORMAT(date_finish_pred, '%Y-%m-%d') AS date_finish_pred
      FROM tarefas
      WHERE id = ?`
    const [tarefa] = await pool.execute(query, [id])
    if (tarefa.length === 0){
        return res.status(404).json({mensagem: "Esta tarefa não existe!"})
    }
    return res.status(200).json(tarefa[0])
  } catch (error) {
    return res.status(500).json({erro: "Erro no servidor!"})
  }
})

  // POST 
app.post("/api/tarefas", validarTarefa, async (req,res) =>{
  try {
    const {name, description, priority, category, date_start, date_finish_pred} = req.body
    const dataAtual = new Date().toISOString().slice(0, 10)
    if (!name || !description || !category || !date_start || !date_finish_pred){
        return res.status(400).json({erro: "Preencher campos obrigatórios"})
    }
    let status = "iniciada"
    if (date_start > dataAtual){
      status = "planeada"
    }
    const query ="INSERT INTO tarefas (name, description, status, priority, category, date_start, date_finish_pred) VALUES (?,?,?,?,?,?,?)"
    const [resposta] = await pool.execute(query, [name, description, status, priority, category, date_start, date_finish_pred])
    return res.status(201).json({mensagem: "Tarefa criada com sucesso!"})
  } catch (error) {
    return res.status(500).json({erro: "Erro no servidor!"})
  }
})


// PUT
app.put("/api/tarefas/:id", validarId, validarTarefaPut,  async (req,res) =>{
  try {
    const id = req.params.id
    const dataAtual = new Date().toISOString().slice(0, 10)
    const query = "SELECT * FROM tarefas WHERE id = ?"
    const [tarefa] = await pool.execute(query, [id])
    if (tarefa.length === 0){
        return res.status(404).json({mensagem: "Esta tarefa não existe!"})
  }

  // tarefas concluídas não podem ser alteradas
  // if (tarefa[0].status === "concluida") {
  //   return res.status(400).json({erro: "Não é possível alterar uma tarefa já concluída"})
  // }

  const {name, description, priority, category, date_start, date_finish_pred} = req.body
  if (!name || !description || !category || !date_start || !date_finish_pred){
      return res.status(400).json({erro: "Preencher campos obrigatórios"})
  }

  // só recalcula o status se a tarefa ainda não foi concluída nem está atrasada
  const statusAtual = tarefa[0].status
  let novoStatus = statusAtual
  if (statusAtual === "planeada" || statusAtual === "iniciada") {
    novoStatus = date_start > dataAtual ? "planeada" : "iniciada"
  } 
  else if (statusAtual === "atrasada" && date_finish_pred >= dataAtual) {
  // deadline foi corrigido para o futuro, deixa de estar atrasada
  novoStatus = date_start > dataAtual ? "planeada" : "iniciada"
  }

  const query2 = "UPDATE tarefas SET name = ?, description = ?, status = ?, priority = ?, category = ?, date_start = ?, date_finish_pred = ? WHERE id = ?"
  const resposta = await pool.execute(query2, [name, description, novoStatus, priority, category, date_start, date_finish_pred, id])
  res.status(200).json({mensagem: "Tarefa alterada com sucesso"})
  } catch (error) {
    res.status(500).json({erro: "Erro no servidor!"})
  }
})


// PATCH  -- Alterar o status para "concluído"
app.patch("/api/tarefas/:id/statusConcluida", validarId, async (req,res)=>{
  try {
    const id = req.params.id
    const query = "SELECT * FROM tarefas WHERE id = ?"
    const [tarefa] = await pool.execute(query, [id])
    if (tarefa.length === 0){
        return res.status(404).json({mensagem: "Esta tarefa não existe!"})
    }
    const novoValor = "concluida"
    const date_finish_real = new Date().toISOString().slice(0, 10)
    const query2 = "UPDATE tarefas SET status = ?, date_finish_real = ?  WHERE id = ?"
    await pool.execute(query2, [novoValor, date_finish_real, id])
    return res.status(200).json({mensagem: "Tarefa concluída!"})
  } catch (error) {
    return res.status(500).json({erro: "Erro no servidor!"})
  }
})


// PATCH  -- Alterar o status para " atrasada"
app.patch("/api/tarefas/:id/statusAtrasada", validarId,  async (req,res)=>{
  try {
    const id = req.params.id
    const dataAtual = new Date().toISOString().slice(0, 10)
    const query = "SELECT * FROM tarefas WHERE id = ?"
    const [tarefa] = await pool.execute(query, [id])
    if (tarefa.length === 0){
        return res.status(404).json({mensagem: "Esta tarefa não existe!"})
    }
    const { date_finish_pred } = tarefa[0]
    const date_finish_pred_clean = new Date(date_finish_pred).toISOString().slice(0, 10)
    const novoValor = "atrasada"
    const query2 = "UPDATE tarefas SET status = ?  WHERE id = ?"   
    if (dataAtual > date_finish_pred_clean){
        await pool.execute(query2, [novoValor, id])
        return res.status(200).json({mensagem: "Tarefa está atrasada!"})
    }
    return res.status(200).json({mensagem: "Tarefa ainda não está atrasada!"})
  } catch (error) {
    return res.status(500).json({erro: "Erro no servidor!"})
  }
})



// DELETE
app.delete("/api/tarefas/:id", validarId, async (req,res)=>{
  try {
    const id = req.params.id
    const query = "SELECT * FROM tarefas WHERE id = ?"
    const [tarefa] = await pool.execute(query, [id])
    if (tarefa.length === 0){
        return res.status(404).json({mensagem: "Esta tarefa não existe!"})
    }
    const query2 = "DELETE FROM tarefas WHERE id = ?"
    await pool.execute(query2, [id])
    return res.status(200).json({mensagem: "Tarefa eliminada com sucesso"})
  } catch (error) {
    return res.status(500).json({erro: "Erro no servidor!"})
  }
})



app.use((erro, req, res, next)=>{
  console.log("Erro: ", erro.mensagem )
  res.status(500).json({erro: "Erro no servidor!"})
})
 


app.listen(PORT, async ()=>{
    console.log(`O servidor está operacional na porta ${PORT}`)
  try {
    await pool.execute("SELECT 1")
    console.log("Ligado à base de dados")
  } catch (error) {
    console.log("Erro na ligação ao servidor SQL")
  }
})



