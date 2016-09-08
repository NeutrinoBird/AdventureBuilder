<?php
	include_once('Adventure/Models/Model.php');

	class EventType extends Model{

		function __construct(){
			parent::__construct();
			$this->tableName = 'tblEventTypes';
			$this->tableKey = 'ID';
		}

		public static function GetEventTypes(){
			return parent::$db->queryGetAll(
				'SELECT ID, name, involvesFlag, involvesValue, involvesPage
				 FROM tblEventTypes
				 WHERE isActive = 1;'
			);
		}
	}
?>