<?php
	include_once('Adventure\DatabaseLogin.php');

	class DatabaseConnection{
		private $connection;

		function __construct(){
			try {
				$this->connection = new PDO('mysql:host='.DatabaseLogin::$Host.';dbname='.DatabaseLogin::$Name, DatabaseLogin::$Username, DatabaseLogin::$Password);
				$this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			}catch(PDOException $e){
				die("Database connection failed: ".$e->getMessage());
			}
		}

		public function query($sql, $data = []){
			try{
				$statement = $this->connection->prepare($sql);	
				$statement->execute($data);
			}catch(PDOException $e){
				die("Query execution failed: ".$e->getMessage());
			}
		}

		public function queryGetRow($sql, $data = []){
			try{
				$statement = $this->connection->prepare($sql);
				$statement->execute($data);
				return $statement->fetch(PDO::FETCH_OBJ);
			}catch(PDOException $e){
				die("Query fetch row failed: ".$e->getMessage());
			}
		}

		public function queryGetAll($sql, $data = []){
			try{
				$statement = $this->connection->prepare($sql);
				$statement->execute($data);
				return $statement->fetchAll(PDO::FETCH_OBJ);
			}catch(PDOException $e){
				die("Query fetch all failed: ".$e->getMessage());
			}
		}

		public function queryInsertGetID($sql, $data = []){
			try{
				$result = $this->query($sql, $data);			
				return $this->connection->lastInsertId();
			}catch(PDOException $e){
				die("Query insert failed: ".$e->getMessage());
			}
		}
	}
?>