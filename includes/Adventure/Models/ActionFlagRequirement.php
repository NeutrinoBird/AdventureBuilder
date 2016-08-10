<?php
	include_once('Adventure\Models\Model.php');

	class ActionFlagRequirement extends Model{
		public $ID;
		public $actionID;
		public $flagID;
		public $counterValue;
		public $counterUpperValue;
		public $conditionID;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblActionFlagRequirements';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->actionID = NULL;
			$this->flagID = 0;
			$this->counterValue = NULL;
			$this->counterUpperValue = NULL;
			$this->conditionID = 1;
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Requirement not found.");
				}
			}
		}

		public static function Create($user, $actionID = 0){
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
			$newActionFlagRequirement = new ActionFlagRequirement();
			$newActionFlagRequirement->Insert($actionID);
			return $newActionFlagRequirement;
		}

		private function Insert($actionID = 0){
			$this->actionID = $actionID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblActionFlagRequirements
				(actionID)
				VALUES
				(:actionID);',
				[
					'actionID'=>$this->actionID
				]
			);			
		}

		public static function GetAllActionFlagRequirements($adventureID){
			$actionFlagRequirementSet = [];
			$actionFlagRequirements = parent::$db->queryGetAll(
				'SELECT tblActionFlagRequirements.ID, tblActionFlagRequirements.actionID, tblActionFlagRequirements.flagID, tblActionFlagRequirements.counterValue, tblActionFlagRequirements.counterUpperValue, tblActionFlagRequirements.conditionID
				 FROM tblActionFlagRequirements
				 JOIN tblActions ON tblActions.ID = tblActionFlagRequirements.actionID				 
				 LEFT JOIN tblPages ON tblPages.ID = tblActions.pageID
				 LEFT JOIN tblScenes ON tblScenes.ID = tblActions.sceneID
				 WHERE (tblPages.adventureID = :adventureID OR tblScenes.adventureID = :adventureID)
				 AND tblActionFlagRequirements.isActive = 1;', 
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($actionFlagRequirements as $actionFlagRequirement){
				$actionFlagRequirementSet[$actionFlagRequirement->ID] = new ActionFlagRequirement();
				$actionFlagRequirementSet[$actionFlagRequirement->ID]->ID = $actionFlagRequirement->ID;
				$actionFlagRequirementSet[$actionFlagRequirement->ID]->actionID = $actionFlagRequirement->actionID;
				$actionFlagRequirementSet[$actionFlagRequirement->ID]->flagID = $actionFlagRequirement->flagID;
				$actionFlagRequirementSet[$actionFlagRequirement->ID]->counterValue = $actionFlagRequirement->counterValue;
				$actionFlagRequirementSet[$actionFlagRequirement->ID]->counterUpperValue = $actionFlagRequirement->counterUpperValue;
				$actionFlagRequirementSet[$actionFlagRequirement->ID]->conditionID = $actionFlagRequirement->conditionID;
			}
			return $actionFlagRequirementSet;
		}	

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblActionFlagRequirements
					 JOIN tblActions ON tblActions.ID = tblActionFlagRequirements.actionID			 
					 LEFT JOIN tblPages ON tblPages.ID = tblActions.pageID
					 LEFT JOIN tblScenes ON tblScenes.ID = tblActions.sceneID
					 JOIN tblAdventures ON tblAdventures.ID = tblPages.adventureID
					 					OR tblAdventures.ID = tblScenes.adventureID
					 WHERE tblActionFlagRequirements.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblActionFlagRequirements.isActive = 1;', 
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
				'SELECT actionID, flagID, counterValue, counterUpperValue, conditionID
				 FROM tblActionFlagRequirements
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->actionID = $result->actionID;	
				$this->flagID = $result->flagID;
				$this->counterValue = $result->counterValue;								
				$this->counterUpperValue = $result->counterUpperValue;
				$this->conditionID = $result->conditionID;
				return true;
			}else{
				return false;
			}
		}

		public function Update($flagID, $counterValue, $counterUpperValue, $conditionID){
			$this->flagID = $flagID;
			$this->counterValue = $counterValue;								
			$this->counterUpperValue = $counterUpperValue;
			$this->conditionID = $conditionID;
			return parent::$db->query(
				'UPDATE tblActionFlagRequirements
				 SET flagID = :flagID,
				 counterValue = :counterValue, 
				 counterUpperValue = :counterUpperValue, 
				 conditionID = :conditionID
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'flagID'=>$this->flagID, 
					'counterValue'=>$this->counterValue, 
					'counterUpperValue'=>$this->counterUpperValue, 
					'conditionID'=>$this->conditionID, 
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblActionFlagRequirements
				 SET isActive = 0
				 WHERE ID = :ID;', 
				['ID'=>$this->ID]
			);
		}
			
	}

?>