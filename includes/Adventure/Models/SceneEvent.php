<?php
	include_once('Adventure\Models\Model.php');

	class SceneEvent extends Model{
		public $ID;
		public $sceneID;
		public $eventID;
		public $priority;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblSceneEvents';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->sceneID = NULL;
			$this->eventID = 0;
			$this->priority = 0;
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Scene Event not found.");
				}
			}
		}

		public static function Create($user, $sceneID){
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblScenes
					 JOIN tblAdventures ON tblAdventures.ID = tblScenes.adventureID
					 WHERE tblScenes.ID = :sceneID
					 AND tblAdventures.userID = :userID
					 AND tblScenes.isActive = 1;', 
					[
						'sceneID'=>$sceneID,
						'userID'=>$user->ID
					]
				);
				if(!$result){
					throw new Exception("Unauthorized user.");
				}
			}
			$newSceneEvent = new SceneEvent();
			$newSceneEvent->Insert($sceneID);
			return $newSceneEvent;
		}	

		private function Insert($sceneID){
			$this->sceneID = $sceneID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblSceneEvents
				(sceneID)
				VALUES
				(:sceneID);',
				[
					'sceneID'=>$this->sceneID
				]
			);
		}

		public static function GetAllSceneEvents($adventureID){
			$sceneEventSet = [];
			$sceneEvents = parent::$db->queryGetAll(
				'SELECT tblSceneEvents.ID, tblSceneEvents.sceneID, tblSceneEvents.eventID, tblSceneEvents.priority
				 FROM tblSceneEvents
				 JOIN tblScenes ON tblScenes.ID = tblSceneEvents.sceneID
				 WHERE tblScenes.adventureID = :adventureID
				 AND tblSceneEvents.isActive = 1;', 
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($sceneEvents as $sceneEvent){
				$sceneEventSet[$sceneEvent->ID] = new SceneEvent();
				$sceneEventSet[$sceneEvent->ID]->ID = $sceneEvent->ID;
				$sceneEventSet[$sceneEvent->ID]->sceneID = $sceneEvent->sceneID;
				$sceneEventSet[$sceneEvent->ID]->eventID = $sceneEvent->eventID;
				$sceneEventSet[$sceneEvent->ID]->priority = $sceneEvent->priority;
			}
			return $sceneEventSet;
		}

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblSceneEvents			 
					 JOIN tblScenes ON tblScenes.ID = tblSceneEvents.sceneID
					 JOIN tblAdventures ON tblAdventures.ID = tblScenes.adventureID
					 WHERE tblSceneEvents.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblSceneEvents.isActive = 1;', 
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
				'SELECT sceneID, eventID, priority
				 FROM tblSceneEvents
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->sceneID = $result->sceneID;	
				$this->eventID = $result->eventID;
				$this->priority = $result->priority;					
				return true;
			}else{
				return false;
			}
		}

		public function Update($eventID, $priority){
			$this->eventID = $eventID;
			$this->priority = $priority;
			return parent::$db->query(
				'UPDATE tblSceneEvents
				 SET eventID = :eventID,
				 priority = :priority
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'eventID'=>$this->eventID, 
					'priority'=>$this->priority,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblSceneEvents
				 SET isActive = 0
				 WHERE ID = :ID;', 
				['ID'=>$this->ID]
			);
		}
			
	}

?>