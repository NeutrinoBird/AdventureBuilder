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

		public $eventFlagRequirements;

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
			$this->eventFlagRequirements = [];
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
			$cleanup = parent::$db->query(
				'UPDATE tblEvents as e1
				JOIN (
					SELECT tblEvents.ID
					FROM tblEvents
					LEFT JOIN tblSceneEvents ON tblSceneEvents.eventID = tblEvents.ID AND tblSceneEvents.isActive = 1
					LEFT JOIN tblActionEvents ON tblActionEvents.eventID = tblEvents.ID AND tblActionEvents.isActive = 1
					LEFT JOIN tblPageEvents ON tblPageEvents.eventID = tblEvents.ID AND tblPageEvents.isActive = 1
					WHERE tblEvents.adventureID = :adventureID
					GROUP BY tblEvents.ID
					HAVING COUNT(tblSceneEvents.ID) + COUNT(tblActionEvents.ID) + COUNT(tblPageEvents.ID) = 0
				) e2 ON e2.ID = e1.ID
				SET e1.isActive = 0;
				UPDATE tblEventFlagRequirements as e1
				JOIN (
					SELECT tblEvents.ID
					FROM tblEvents
					LEFT JOIN tblSceneEvents ON tblSceneEvents.eventID = tblEvents.ID AND tblSceneEvents.isActive = 1
					LEFT JOIN tblActionEvents ON tblActionEvents.eventID = tblEvents.ID AND tblActionEvents.isActive = 1
					LEFT JOIN tblPageEvents ON tblPageEvents.eventID = tblEvents.ID AND tblPageEvents.isActive = 1
					WHERE tblEvents.adventureID = :adventureID
					GROUP BY tblEvents.ID
					HAVING COUNT(tblSceneEvents.ID) + COUNT(tblActionEvents.ID) + COUNT(tblPageEvents.ID) = 0
				) e2 ON e2.ID = e1.eventID
				SET e1.isActive = 0;',
				[
					'adventureID'=>(int)$adventureID
				]
			);
			$eventSet = [];
			$events = parent::$db->queryGetAll(
				'SELECT ID, adventureID, eventTypeID, flagID, value, textBefore, textAfter, pageID
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
				'SELECT adventureID, eventTypeID, flagID, value, textBefore, textAfter, pageID
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
				return true;
			}else{
				return false;
			}
		}

		public function Update($eventTypeID, $flagID, $value, $textBefore, $textAfter, $pageID){
			$this->eventTypeID = $eventTypeID;
			$this->flagID = $flagID;
			$this->value = $value;
			$this->textBefore = htmlentities($textBefore);
			$this->textAfter = htmlentities($textAfter);
			$this->pageID = $pageID;
			return parent::$db->query(
				'UPDATE tblEvents
				 SET eventTypeID = :eventTypeID,
				 flagID = :flagID,
				 value = :value,
				 textBefore = :textBefore,
				 textAfter = :textAfter,
				 pageID = :pageID
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'eventTypeID'=>$this->eventTypeID,
					'flagID'=>$this->flagID,
					'value'=>$this->value,
					'textBefore'=>$this->textBefore,
					'textAfter'=>$this->textAfter,
					'pageID'=>$this->pageID,
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