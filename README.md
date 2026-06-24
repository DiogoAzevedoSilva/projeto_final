# TaskFlow

Aplicação web para gerir tarefas com organização por categorias, prioridades, datas e status.

## Descrição

O projeto consiste numa aplicação full-stack simples que permite:

- criar, consultar, editar e eliminar tarefas;
- organizar tarefas por categorias;
- definir prioridades e datas de início/conclusão;
- acompanhar o estado das tarefas em diferentes fases.

## Tecnologias

- Node.js
- Express
- MySQL
- HTML, CSS e JavaScript

## Requisitos

Antes de iniciar, certificarmo-nos de ter instalado:

- Node.js
- MySQL
- npm

## Instalação

1. Clonar o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd projeto_final
   ```
2. Instale as dependências:
   ```bash
   npm install express nodemon dotenv mysql2
   npm init -y
   ir ao ficheiro "package.json" na linha 8 e preciso colocar uma virgula no final e na linha 9 "dev": "nodemon server.js"
   ```
3. Criar um ficheiro `.env` na raiz do projeto, inicialmente o ficheiro vai aparecer como `.env.example`, temos que trocar o nome do ficheiro para 
apenas `.env` com as seguintes variáveis:  
   ```env
   DATABASE_HOST="localhost"
   DATABASE_PORT=3306
   DATABASE_USER="root"
   DATABASE_PASSWORD="**nossa senha**"
   DATABASE_NAME="to_do_list_db"
   ```
4. Criar a base de dados e a tabela executando o ficheiro SQL fornecido:
   ```bash
   mysql -u root -p < projeto_final_DB.sql
   ```

## Execução

Para iniciar o servidor:

```bash
npm start
```

Para iniciar em modo desenvolvimento com reinício automático:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Estrutura do projeto

- `server.js` — servidor Express e rotas da API
- `frontend/` — páginas e recursos do frontend
- `projeto_final_DB.sql` — script de criação da base de dados

## Observações

- Se a ligação à base de dados falhar, confirme as credenciais no ficheiro `.env` e se o MySQL está a correr.
- O projeto utiliza a base de dados `to_do_list_db`.
