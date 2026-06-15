CREATE DATABASE IF NOT EXISTS to_do_list_db;
 
USE to_do_list_db;
 
CREATE TABLE IF NOT EXISTS tarefas (
  id          	    INT AUTO_INCREMENT PRIMARY KEY,
  name        		  VARCHAR(255) NOT NULL,
  description 		  TEXT NOT NULL,
  status  	        VARCHAR(50) DEFAULT "iniciado",   --"iniciado", "concluido", "atrasado"
  priority    		  TINYINT DEFAULT 2,        -- 1=low, 2=medium, 3=high
  category    		  VARCHAR(50) NOT NULL,  -- "bem_estar", "lazer", "pessoal", "trabalho", "outro"
  date_start  		  DATE,
  date_finish_pred	DATE NOT NULL,
  date_finish_real 	TIMESTAMP NULL,
  created_at  		  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  		  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);






