CREATE DATABASE IF NOT EXISTS to_do_list_db;
 
USE to_do_list_db;
 
CREATE TABLE IF NOT EXISTS tarefas (
  id          	    INT AUTO_INCREMENT PRIMARY KEY,
  name        		  VARCHAR(200) NOT NULL,
  description 		  TEXT NOT NULL,
  status  	        VARCHAR(50) DEFAULT "planeado",   -- "planeado", "iniciado", "concluido", "atrasado"
  priority    		  TINYINT DEFAULT 2,        -- 1=baixa, 2=media, 3=alta
  category    		  VARCHAR(50) NOT NULL,  -- "bem_estar", "lazer", "pessoal", "profissional", "outro"
  date_start  		  DATE,
  date_finish_pred	DATE NOT NULL,
  date_finish_real 	TIMESTAMP NULL,
  created_at  		  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  		  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);






