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


// Midlewares
app.use(express.json())
// Midleware para validação
// function validarTarefa(req, res, next){}


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

  // POST
app.post("/api/tarefas", validarTarefa, async (req,res) =>{
  const {name, description, is_completed, priority, category, date_start, date_finish_pred} = req.body
  if (!name || !description || !category || !date_start || !date_finish_pred){
      return res.status(400).json({erro: "Preencher campos obrigatórios"})
  }
  const query ="INSERT INTO musica (name, description, is_completed, priority, category, date_start, date_finish_pred) VALUES (?,?,?,?,?,?,?)"
  const [resposta] = await pool.execute(query, [name, description, is_completed, priority, category, date_start, date_finish_pred])
  res.status(201).json({mensagem: "Tarefa criada com sucesso!"})
})


