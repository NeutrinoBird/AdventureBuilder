<?php
	include_once('Adventure/Models/Model.php');

	class PageType extends Model{

		function __construct(){
			parent::__construct();
			$this->tableName = 'tblPageTypes';
			$this->tableKey = 'ID';
		}

		public static function GetPageTypes(){
			return parent::$db->queryGetAll(
				'SELECT ID, name, style
				 FROM tblPageTypes
				 WHERE isActive = 1;'
			);
		}
	}
?>