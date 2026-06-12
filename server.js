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
// ...............


// Rota principal
app.get("/", (req,res)=>{
    const mensagem = {mensagem: "Principal"}
    res.json(mensagem)
})


