<?php
	include_once('Adventure/Models/Model.php');

	class Transition extends Model{

		function __construct(){
			parent::__construct();
			$this->tableName = 'tblTransitions';
			$this->tableKey = 'ID';
		}

		public static function GetTransitions(){
			return parent::$db->queryGetAll(
				'SELECT ID, name
				 FROM tblTransitions
				 WHERE isActive = 1;'
			);
		}
	}
?>