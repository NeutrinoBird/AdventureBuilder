<?php
	include_once('Adventure\Models\Model.php');

	class ActionEvent extends Model{
		public $ID;
		public $actionID;
		public $eventID;
		public $priority;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblActionEvents';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->actionID = NULL;
			$this->eventID = 0;
			$this->priority = 0;
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Action Event not found.");
				}
			}
		}

		public static function Create($user, $actionID){
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblActions
					 LEFT JOIN tblPages ON tblPages.ID = tblActions.pageID
					 LEFT JOIN tblScenes ON tblScenes.ID = tblActions.sceneID
					 JOIN tblAdventures ON tblAdventures.ID = tblPages.adventureID
					 					OR tblAdventures.ID = tblScenes.adventureID
					 WHERE tblActions.ID = :actionID
					 AND tblAdventures.userID = :userID
					 AND tblActions.isActive = 1;',
					[
						'actionID'=>$actionID,
						'userID'=>$user->ID,
					]
				);
				if(!$result){
					throw new Exception("Unauthorized user.");
				}
			}
			$newActionEvent = new ActionEvent();
			$newActionEvent->Insert($actionID);
			return $newActionEvent;
		}

		private function Insert($actionID){
			$this->actionID = $actionID;
			$result = parent::$db->queryGetRow(
				'SELECT IFNULL(MAX(priority),0)+1 as nextPriority
				 FROM tblActionEvents
				 WHERE actionID = :actionID
				 AND isActive = 1;',
				[
					'actionID'=>$this->actionID
				]
			);
			$this->priority = $result->nextPriority;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblActionEvents
				(actionID, priority)
				VALUES
				(:actionID, :priority);',
				[
					'actionID'=>$this->actionID,
					'priority'=>$this->priority
				]
			);
		}

		public static function GetAllActionEvents($adventureID){
			$actionEventSet = [];
			$actionEvents = parent::$db->queryGetAll(
				'SELECT tblActionEvents.ID, tblActionEvents.actionID, tblActionEvents.eventID, tblActionEvents.priority
				 FROM tblActionEvents
				 JOIN tblActions ON tblActions.ID = tblActionEvents.actionID
				 LEFT JOIN tblPages ON tblPages.ID = tblActions.pageID
				 LEFT JOIN tblScenes ON tblScenes.ID = tblActions.sceneID
				 WHERE (tblPages.adventureID = :adventureID OR tblScenes.adventureID = :adventureID)
				 AND tblActionEvents.isActive = 1;',
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($actionEvents as $actionEvent){
				$actionEventSet[$actionEvent->ID] = new ActionEvent();
				$actionEventSet[$actionEvent->ID]->ID = $actionEvent->ID;
				$actionEventSet[$actionEvent->ID]->actionID = $actionEvent->actionID;
				$actionEventSet[$actionEvent->ID]->eventID = $actionEvent->eventID;
				$actionEventSet[$actionEvent->ID]->priority = $actionEvent->priority;
			}
			return $actionEventSet;
		}

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblActionEvents
					 JOIN tblActions ON tblActions.ID = tblActionEvents.actionID
					 LEFT JOIN tblPages ON tblPages.ID = tblActions.pageID
					 LEFT JOIN tblScenes ON tblScenes.ID = tblActions.sceneID
					 JOIN tblAdventures ON tblAdventures.ID = tblPages.adventureID
					 					OR tblAdventures.ID = tblScenes.adventureID
					 WHERE tblActionEvents.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblActionEvents.isActive = 1;',
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
				'SELECT actionID, eventID, priority
				 FROM tblActionEvents
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->actionID = $result->actionID;
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
				'UPDATE tblActionEvents
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
				'UPDATE tblActionEvents
				 SET isActive = 0
				 WHERE ID = :ID;',
				['ID'=>$this->ID]
			);
		}

	}

?>