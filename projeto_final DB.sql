CREATE TABLE tarefas (
  id          	INT AUTO_INCREMENT PRIMARY KEY,
  name        		VARCHAR(255) NOT NULL,
  description 		TEXT,
  is_completed  	BOOLEAN DEFAULT FALSE,
  priority    		TINYINT DEFAULT 2,        -- 1=low, 2=medium, 3=high
  category    		VARCHAR(100),
  date_start  		DATE,
  date_finish_pred	DATE,
  date_finish_real 	TIMESTAMP NULL,
  created_at  		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);






