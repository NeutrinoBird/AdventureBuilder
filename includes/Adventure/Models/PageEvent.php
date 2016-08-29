<?php
	include_once('Adventure\Models\Model.php');

	class PageEvent extends Model{
		public $ID;
		public $pageID;
		public $eventID;
		public $priority;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblPageEvents';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->pageID = NULL;
			$this->eventID = 0;
			$this->priority = 0;
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Page Event not found.");
				}
			}
		}

		public static function Create($user, $pageID){
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblPages
					 JOIN tblAdventures ON tblAdventures.ID = tblPages.adventureID
					 WHERE tblPages.ID = :pageID
					 AND tblAdventures.userID = :userID
					 AND tblPages.isActive = 1;',
					[
						'pageID'=>$pageID,
						'userID'=>$user->ID
					]
				);
				if(!$result){
					throw new Exception("Unauthorized user.");
				}
			}
			$newPageEvent = new PageEvent();
			$newPageEvent->Insert($pageID);
			return $newPageEvent;
		}

		private function Insert($pageID){
			$this->pageID = $pageID;
			$result = parent::$db->queryGetRow(
				'SELECT IFNULL(MAX(priority),0)+1 as nextPriority
				 FROM tblPageEvents
				 WHERE pageID = :pageID
				 AND isActive = 1;',
				[
					'pageID'=>$this->pageID
				]
			);
			$this->priority = $result->nextPriority;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblPageEvents
				(pageID, priority)
				VALUES
				(:pageID, :priority);',
				[
					'pageID'=>$this->pageID,
					'priority'=>$this->priority
				]
			);
		}

		public static function GetAllPageEvents($adventureID){
			$pageEventSet = [];
			$pageEvents = parent::$db->queryGetAll(
				'SELECT tblPageEvents.ID, tblPageEvents.pageID, tblPageEvents.eventID, tblPageEvents.priority
				 FROM tblPageEvents
				 JOIN tblPages ON tblPages.ID = tblPageEvents.pageID
				 WHERE tblPages.adventureID = :adventureID
				 AND tblPageEvents.isActive = 1;',
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($pageEvents as $pageEvent){
				$pageEventSet[$pageEvent->ID] = new PageEvent();
				$pageEventSet[$pageEvent->ID]->ID = $pageEvent->ID;
				$pageEventSet[$pageEvent->ID]->pageID = $pageEvent->pageID;
				$pageEventSet[$pageEvent->ID]->eventID = $pageEvent->eventID;
				$pageEventSet[$pageEvent->ID]->priority = $pageEvent->priority;
			}
			return $pageEventSet;
		}

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblPageEvents
					 JOIN tblPages ON tblPages.ID = tblPageEvents.pageID
					 JOIN tblAdventures ON tblAdventures.ID = tblPages.adventureID
					 WHERE tblPageEvents.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblPageEvents.isActive = 1;',
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
				'SELECT pageID, eventID, priority
				 FROM tblPageEvents
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->pageID = $result->pageID;
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
				'UPDATE tblPageEvents
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
				'UPDATE tblPageEvents
				 SET isActive = 0
				 WHERE ID = :ID;',
				['ID'=>$this->ID]
			);
		}

	}

?>