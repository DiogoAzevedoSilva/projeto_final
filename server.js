// Configuraçoes
require("dotenv").config()

// Modulos importados
const express = require("express")
const app = express()
const path = require("path")
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

// Midleware para validação
function validarTarefa(req, res, next){
  const categoryValidas = ["bem_estar", "lazer", "pessoal", "profissional", "outro"]
  const {name, description, priority, category, date_start, date_finish_pred} = req.body
  const nameLimpo = String(name).trim()
  const descriptionLimpo = String(description).trim()
  const priorityNumero = Number(priority)
  const categoryLimpo = String(category).trim().toLowerCase() 
  const date_startLimpo = String(date_start)  // Possivelmente não é necessário se date_start já vier como string
  // const date_startLimpo = date_start.toISOString().slice(0, 10) Se vier em formato universal de data (não deve ser o caso)
  const date_finish_predLimpo = String(date_finish_pred)  // Possivelmente não é necessário se date_finish_pred já vier como string
  // const date_finish_predLimpo = date_finish_predLimpo.toISOString().slice(0, 10) Se vier em formato universal de data (não deve ser o caso)
  const dataAtual = Date().toISOString().slice(0, 10)

  if (nameLimpo.length < 2 || nameLimpo.length > 200) {
    return res.status(400).json({erro: "Nome da tarefa obrigatório (entre 2 e 200 caracteres)"}) 
  }
  if (descriptionLimpo.length === 0) {
    return res.status(400).json({erro: "Descrição da tarefa obrigatoria"})
  }
  // if (priorityNumero < 1 || priorityNumero > 3){
  //   return res.status(400).json({erro: "Prioridade da tarefa obrigatoria"})
  // }

  if (!categoryValidas.includes(categoryLimpo)) {
    return res.status(400).json({erro: "Categoria inválida"})
  }
  if (date_startLimpo < dataAtual){
    return res.status(400).json({erro: "A data de início da tarefa não pode ser no passado"}) // português está horrível
  }
  if (date_startLimpo > date_finish_predLimpo){
    return res.status(400).json({erro: "A data de início da tarefa não pode posterior à data prevista de conclusão"}) 
  }
  if (date_finish_predLimpo < dataAtual){
    return res.status(400).json({erro: "A data prevista de conclusão da tarefa não pode ser no passado"}) 
  }

 
  req.body = {
    titulo: tituloLimpo,
    artista: artistaLimpo,
    genero: generoLimpo,
    ano: anoNumero
  }
  next()

}

// Date().toISOString().slice(0, 10)




// ROTAS

// Rota principal
app.get("/", (req,res)=>{
  const mensagem = {mensagem: "Principal"}
  res.json(mensagem)
})

// GET
app.get("/api/tarefas", async (req,res)=>{
  try { 
    const get_tarefas = await pool.execute("SELECT * FROM to_do_list_db.tarefas")
    res.status(200).json(get_tarefas[0])
  }
  catch (error) {
    res.status(400).json({ error: "Erro ao buscar tarefas" })
  }
})

// GET :id
app.get("/api/tarefas/:id", async (req,res) =>{
  const id = Number(req.params.id)
  const query = "SELECT * FROM tarefas WHERE id = ?"
  const [tarefa] = await pool.execute(query, [id])
  if (tarefa.length === 0){
      res.status(404).json({mensagem: "Esta tarefa não existe!"})
  }
  res.status(200).json(tarefa[0])
})

  // POST --- É preciso criar o middleware validarTarefa
app.post("/api/tarefas", validarTarefa, async (req,res) =>{
  const {name, description, priority, category, date_start, date_finish_pred} = req.body
  if (!name || !description || !category || !date_start || !date_finish_pred){
      return res.status(400).json({erro: "Preencher campos obrigatórios"})
  }
  const dataHoje = Date().toISOString().slice(0, 10)
  let status = "iniciada"
  if (date_start > dataHoje){
    status = "planeada"
  }
  // if (priority === "baixa"){
  //   priority = 1
  // }
  // else if (priority === "média"){
  //   priority = 2
  // }
  // else {
  //   priority = 3
  // }
  const query ="INSERT INTO musica (name, description, status, priority, category, date_start, date_finish_pred) VALUES (?,?,?,?,?,?,?)"
  const [resposta] = await pool.execute(query, [name, description, status, priority, category, date_start, date_finish_pred])
  res.status(201).json({mensagem: "Tarefa criada com sucesso!"})
})


// PUT
app.put("/api/tarefas/:id", validarTarefa, async (req,res) =>{
    const id = Number(req.params.id)
    const query = "SELECT * FROM tarefas WHERE id = ?"
    const [tarefa] = await pool.execute(query, [id])
    if (tarefa.length === 0){
        res.status(404).json({mensagem: "Esta tarefa não existe!"})
    }
    const {name, description, priority, category, date_start, date_finish_pred} = req.body
    if (!name || !description || !category || !date_start || !date_finish_pred){
        return res.status(400).json({erro: "Preencher campos obrigatórios"})
    }
    const query2 = "UPDATE tarefa SET name = ?, description = ?, priority = ?, category = ?, date_start = ?, date_finish_pred = ? WHERE id = ?"
    const [resultado] = await pool.execute(query2, [name, description, priority, category, date_start, date_finish_pred, id])
 
    res.status(200).json({mensagem: "Tarefa alterada com sucesso"})
  })


// PATCH  -- Alterar o status para "concluído"
app.patch("/api/tarefas/:id/status", async (req,res)=>{
  const id = Number(req.params.id)
  const query = "SELECT * FROM tarefas WHERE id = ?"
  const [tarefa] = await pool.execute(query, [id])
  if (tarefa.length === 0){
      res.status(404).json({mensagem: "Esta tarefa não existe!"})
  }
  const novoValor = "concluído"
  const date_finish_real = Date().toISOString().slice(0, 10)
  const query2 = "UPDATE tarefas SET status = ?, date_finish_real = ?  WHERE id = ?"
  await pool.execute(query2, [novoValor, date_finish_real, id])
  // confirmar se date_finish real está correcto!
  res.status(200).json({mensagem: "Tarefa concluída!"})
})


// PATCH  -- Alterar o status para " atrasado"
// acho que isto não é feito por uma rota mas pelo servidor quando a data actual ultrapassa 
// a data "date_finish_pred"?!




  // DELETE
  app.delete("/api/tarefas/:id", async (req,res)=>{
    const id = Number(req.params.id)
    const query = "SELECT * FROM tarefas WHERE id = ?"
    const [tarefa] = await pool.execute(query, [id])
    if (tarefa.length === 0){
        res.status(404).json({mensagem: "Esta tarefa não existe!"})
    }
    const query2 = "DELETE FROM tarefas WHERE id = ?"
    await pool.execute(query2, [id])

    res.status(200).json({mensagem: "Tarefa eliminada com sucesso"})
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

