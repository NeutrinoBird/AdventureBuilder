<?php
	include_once('Adventure/Models/Model.php');

	class Event extends Model{
		public $ID;
		public $adventureID;
		public $name;
		public $eventTypeID;
		public $flagID;
		public $value;
		public $textBefore;
		public $textAfter;
		public $pageID;
		public $counterValue;
		public $counterUpperValue;
		public $conditionID;
		public $conditionFlagID;
		public $conditionPageID;
		public $conditionOtherFlagID;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblEvents';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->adventureID = NULL;
			$this->eventTypeID = 1;
			$this->flagID = 0;
			$this->value = NULL;
			$this->textBefore = '';
			$this->textAfter = '';
			$this->pageID = 0;
			$this->counterValue = NULL;
			$this->counterUpperValue = NULL;
			$this->conditionID = 1;
			$this->conditionFlagID = 0;
			$this->conditionPageID = 0;
			$this->conditionOtherFlagID = 0;
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Event not found.");
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
			$newEvent = new Event();
			$newEvent->Insert($adventureID);
			return $newEvent;
		}

		private function Insert($adventureID){
			$this->adventureID = $adventureID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblEvents
				(adventureID)
				VALUES
				(:adventureID);',
				[
					'adventureID'=>$this->adventureID
				]
			);
		}

		public static function GetAllEvents($adventureID){
			$eventSet = [];
			$events = parent::$db->queryGetAll(
				'SELECT ID, adventureID, eventTypeID, flagID, value, textBefore, textAfter, pageID, counterValue, counterUpperValue, conditionID, conditionFlagID, conditionPageID, conditionOtherFlagID
				 FROM tblEvents
				 WHERE adventureID = :adventureID
				 AND isActive = 1;',
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($events as $event){
				$eventSet[$event->ID] = new Event();
				$eventSet[$event->ID]->ID = $event->ID;
				$eventSet[$event->ID]->adventureID = $event->adventureID;
				$eventSet[$event->ID]->eventTypeID = $event->eventTypeID;
				$eventSet[$event->ID]->flagID = $event->flagID;
				$eventSet[$event->ID]->value = $event->value;
				$eventSet[$event->ID]->textBefore = $event->textBefore;
				$eventSet[$event->ID]->textAfter = $event->textAfter;
				$eventSet[$event->ID]->pageID = $event->pageID;
				$eventSet[$event->ID]->counterValue = $event->counterValue;
				$eventSet[$event->ID]->counterUpperValue = $event->counterUpperValue;
				$eventSet[$event->ID]->conditionID = $event->conditionID;
				$eventSet[$event->ID]->conditionFlagID = $event->conditionFlagID;
				$eventSet[$event->ID]->conditionPageID = $event->conditionPageID;
				$eventSet[$event->ID]->conditionOtherFlagID = $event->conditionOtherFlagID;
			}
			return $eventSet;
		}

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblEvents
					 JOIN tblAdventures ON tblAdventures.ID = tblEvents.adventureID
					 WHERE tblEvents.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblEvents.isActive = 1;',
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
				'SELECT adventureID, eventTypeID, flagID, value, textBefore, textAfter, pageID, counterValue, counterUpperValue, conditionID, conditionFlagID, conditionPageID, conditionOtherFlagID
				 FROM tblEvents
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->adventureID = $result->adventureID;
				$this->eventTypeID = $result->eventTypeID;
				$this->flagID = $result->flagID;
				$this->value = $result->value;
				$this->textBefore = $result->textBefore;
				$this->textAfter = $result->textAfter;
				$this->pageID = $result->pageID;
				$this->counterValue = $result->counterValue;
				$this->counterUpperValue = $result->counterUpperValue;
				$this->conditionID = $result->conditionID;
				$this->conditionFlagID = $result->conditionFlagID;
				$this->conditionPageID = $result->conditionPageID;
				$this->conditionOtherFlagID = $result->conditionOtherFlagID;
				return true;
			}else{
				return false;
			}
		}

		public function Update($eventTypeID, $flagID, $value, $textBefore, $textAfter, $pageID, $counterValue, $counterUpperValue, $conditionID, $conditionFlagID, $conditionPageID, $conditionOtherFlagID){
			$this->eventTypeID = $eventTypeID;
			$this->flagID = $flagID;
			$this->value = $value;
			$this->textBefore = htmlentities($textBefore);
			$this->textAfter = htmlentities($textAfter);
			$this->pageID = $pageID;
			$this->counterValue = $counterValue;
			$this->counterUpperValue = $counterUpperValue;
			$this->conditionID = $conditionID;
			$this->conditionFlagID = $conditionFlagID;
			$this->conditionPageID = $conditionPageID;
			$this->conditionOtherFlagID = $conditionOtherFlagID;
			return parent::$db->query(
				'UPDATE tblEvents
				 SET eventTypeID = :eventTypeID,
				 flagID = :flagID,
				 value = :value,
				 textBefore = :textBefore,
				 textAfter = :textAfter,
				 pageID = :pageID,
				 counterValue = :counterValue,
				 counterUpperValue = :counterUpperValue,
				 conditionID = :conditionID,
				 conditionFlagID = :conditionFlagID,
				 conditionPageID = :conditionPageID,
				 conditionOtherFlagID = :conditionOtherFlagID
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'eventTypeID'=>$this->eventTypeID,
					'flagID'=>$this->flagID,
					'value'=>$this->value,
					'textBefore'=>$this->textBefore,
					'textAfter'=>$this->textAfter,
					'pageID'=>$this->pageID,
					'counterValue'=>$this->counterValue,
					'counterUpperValue'=>$this->counterUpperValue,
					'conditionID'=>$this->conditionID,
					'conditionFlagID'=>$this->conditionFlagID,
					'conditionPageID'=>$this->conditionPageID,
					'conditionOtherFlagID'=>$this->conditionOtherFlagID,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblEvents
				 SET isActive = 0
				 WHERE ID = :ID;',
				['ID'=>$this->ID]
			);
		}

	}

?>