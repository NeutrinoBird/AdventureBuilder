<?php
	include_once('Adventure\Models\Model.php');

	class Scene extends Model{
		public $ID;
		public $adventureID;
		public $name;
		
		public $actions;
		public $sceneEvents;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblScenes';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->adventureID = NULL;
			$this->name = '';
			$this->actions = [];
			$this->sceneEvents = [];
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Scene not found.");
				}
			}
		}

		public static function Create($user, $adventureID){
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblAdventures
					 WHERE ID = :adventureID
					 AND userID = :userID
					 AND isActive = 1;', 
					[
						'adventureID'=>$adventureID,
						'userID'=>$user->ID,
					]
				);
				if(!$result){
					throw new Exception("Unauthorized user.");
				}
			}
			$newScene = new Scene();
			$newScene->Insert($adventureID);
			return $newScene;
		}	

		private function Insert($adventureID){
			$this->adventureID = $adventureID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblScenes
				(adventureID)
				VALUES
				(:adventureID);',
				[
					'adventureID'=>$this->adventureID
				]
			);
		}

		public static function GetAllScenes($adventureID){
			$sceneSet = [];
			$scenes = parent::$db->queryGetAll(
				'SELECT ID, adventureID, name
				 FROM tblScenes
				 WHERE adventureID = :adventureID
				 AND isActive = 1;', 
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($scenes as $scene){
				$sceneSet[$scene->ID] = new Scene();
				$sceneSet[$scene->ID]->ID = $scene->ID;
				$sceneSet[$scene->ID]->adventureID = $scene->adventureID;
				$sceneSet[$scene->ID]->name = $scene->name;
			}
			return $sceneSet;
		}	

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblScenes
					 JOIN tblAdventures ON tblAdventures.ID = tblScenes.adventureID
					 WHERE tblScenes.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblScenes.isActive = 1;', 
					[
						'ID'=>$ID,
						'userID'=>$user->ID
					]
				);
				if(!$result){
					throw new Exception("Unauthorized user.");
				}
			}
			$result = parent::$db->queryGetRow(
				'SELECT adventureID, name
				 FROM tblScenes
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;	
				$this->name = $result->name;
				$this->adventureID = $result->adventureID;										
				return true;
			}else{
				return false;
			}
		}	

		public function Update($name){
			$this->name = htmlentities($name);
			return parent::$db->query(
				'UPDATE tblScenes
				 SET tblScenes.name = :name
				 WHERE tblScenes.ID = :ID
				 AND isActive = 1;', 
				[
					'name'=>$this->name, 
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblScenes
				 SET isActive = 0
				 WHERE ID = :ID;', 
				['ID'=>$this->ID]
			);
		}
			
	}

?>