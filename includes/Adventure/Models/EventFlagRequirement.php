<?php
	include_once('Adventure/Models/Model.php');

	class EventFlagRequirement extends Model{
		public $ID;
		public $eventID;
		public $flagID;
		public $counterValue;
		public $counterUpperValue;
		public $conditionID;
		public $pageID;
		public $otherFlagID;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblEventFlagRequirements';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->eventID = NULL;
			$this->flagID = 0;
			$this->counterValue = NULL;
			$this->counterUpperValue = NULL;
			$this->conditionID = 1;
			$this->pageID = 0;
			$this->otherFlagID = 0;
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Requirement not found.");
				}
			}
		}

		public static function Create($user, $eventID = 0){
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblEvents
					 JOIN tblAdventures ON tblAdventures.ID = tblEvents.adventureID
					 WHERE tblEvents.ID = :eventID
					 AND tblAdventures.userID = :userID
					 AND tblEvents.isActive = 1;',
					[
						'eventID'=>$eventID,
						'userID'=>$user->ID,
					]
				);
				if(!$result){
					throw new Exception("Unauthorized user.");
				}
			}
			$newEventFlagRequirement = new EventFlagRequirement();
			$newEventFlagRequirement->Insert($eventID);
			return $newEventFlagRequirement;
		}

		private function Insert($eventID = 0){
			$this->eventID = $eventID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblEventFlagRequirements
				(eventID)
				VALUES
				(:eventID);',
				[
					'eventID'=>$this->eventID
				]
			);
		}

		public static function GetAllEventFlagRequirements($adventureID){
			$eventFlagRequirementSet = [];
			$eventFlagRequirements = parent::$db->queryGetAll(
				'SELECT tblEventFlagRequirements.ID, tblEventFlagRequirements.eventID, tblEventFlagRequirements.flagID, tblEventFlagRequirements.counterValue, tblEventFlagRequirements.counterUpperValue, tblEventFlagRequirements.conditionID, tblEventFlagRequirements.pageID, tblEventFlagRequirements.otherFlagID
				 FROM tblEventFlagRequirements
				 JOIN tblEvents ON tblEvents.ID = tblEventFlagRequirements.eventID
				 WHERE tblEvents.adventureID = :adventureID
				 AND tblEventFlagRequirements.isActive = 1;',
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($eventFlagRequirements as $eventFlagRequirement){
				$eventFlagRequirementSet[$eventFlagRequirement->ID] = new EventFlagRequirement();
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->ID = $eventFlagRequirement->ID;
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->eventID = $eventFlagRequirement->eventID;
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->flagID = $eventFlagRequirement->flagID;
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->counterValue = $eventFlagRequirement->counterValue;
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->counterUpperValue = $eventFlagRequirement->counterUpperValue;
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->conditionID = $eventFlagRequirement->conditionID;
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->pageID = $eventFlagRequirement->pageID;
				$eventFlagRequirementSet[$eventFlagRequirement->ID]->otherFlagID = $eventFlagRequirement->otherFlagID;
			}
			return $eventFlagRequirementSet;
		}

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblEventFlagRequirements
					 JOIN tblEvents ON tblEvents.ID = tblEventFlagRequirements.eventID
					 JOIN tblAdventures ON tblAdventures.ID = tblEvents.adventureID
					 WHERE tblEventFlagRequirements.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblEventFlagRequirements.isActive = 1;',
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
				'SELECT eventID, flagID, counterValue, counterUpperValue, conditionID, pageID, otherFlagID
				 FROM tblEventFlagRequirements
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->eventID = $result->eventID;
				$this->flagID = $result->flagID;
				$this->counterValue = $result->counterValue;
				$this->counterUpperValue = $result->counterUpperValue;
				$this->conditionID = $result->conditionID;
				$this->pageID = $result->pageID;
				$this->otherFlagID = $result->otherFlagID;
				return true;
			}else{
				return false;
			}
		}

		public function Update($flagID, $counterValue, $counterUpperValue, $conditionID, $pageID, $otherFlagID){
			$this->flagID = $flagID;
			$this->counterValue = $counterValue;
			$this->counterUpperValue = $counterUpperValue;
			$this->conditionID = $conditionID;
			$this->pageID = $pageID;
			$this->otherFlagID = $otherFlagID;
			return parent::$db->query(
				'UPDATE tblEventFlagRequirements
				 SET flagID = :flagID,
				 counterValue = :counterValue,
				 counterUpperValue = :counterUpperValue,
				 conditionID = :conditionID,
				 pageID = :pageID,
				 otherFlagID = :otherFlagID
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'flagID'=>$this->flagID,
					'counterValue'=>$this->counterValue,
					'counterUpperValue'=>$this->counterUpperValue,
					'conditionID'=>$this->conditionID,
					'pageID'=>$this->pageID,
					'otherFlagID'=>$this->otherFlagID,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblEventFlagRequirements
				 SET isActive = 0
				 WHERE ID = :ID;',
				['ID'=>$this->ID]
			);
		}

	}

?>