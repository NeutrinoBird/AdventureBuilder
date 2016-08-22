<?php
	include_once('Adventure\Models\Model.php');

	class ActionType extends Model{

		function __construct(){
			parent::__construct();
			$this->tableName = 'tblActionTypes';
			$this->tableKey = 'ID';
		}

		public static function GetActionTypes(){
			return parent::$db->queryGetAll(
				'SELECT ID, name, requiresText
				 FROM tblActionTypes
				 WHERE isActive = 1;'
			);
		}
	}
?>