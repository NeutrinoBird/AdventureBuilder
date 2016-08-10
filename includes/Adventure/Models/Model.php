<?php
	include_once('Adventure\DatabaseConnection.php');
	
	class Model{
		protected static $db;
		protected $tableName;
		protected $tableKey;

		function __construct(){
			//global $database;
			//self::$db =& $database;
		}

		public static function initDB($database){
			self::$db =& $database;
		}

		public function GetByID($ID){
			return self::$db->queryGetRow('SELECT * FROM '.$tableName.' WHERE '.$tableKey.' = :ID LIMIT 1;', ['ID'=>$ID]);
		}

		public function GetAll(){
			return self::$db->queryGetAll('SELECT * FROM '.$tableName.';');			
		}

		protected function SQLDate($timestamp){
			return date('Y-m-d H:i:s',$timestamp);
		}
	}
	Model::initDB(new DatabaseConnection());
?>