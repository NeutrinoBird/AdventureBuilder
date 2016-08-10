<?php
	include_once('Adventure\Models\Model.php');

	class Condition extends Model{

		function __construct(){
			parent::__construct();
			$this->tableName = 'tblConditions';
			$this->tableKey = 'ID';
		}

		public static function GetConditions(){
			return parent::$db->queryGetAll(
				'SELECT ID, name, involvesFlag, involvesCounter, involvesRange
				 FROM tblConditions
				 WHERE isActive = 1;'
			);
		}
	}
?>