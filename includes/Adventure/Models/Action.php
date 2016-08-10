<?php
	include_once('Adventure\Models\Model.php');

	class Action extends Model{
		public $ID;
		public $pageID;
		public $sceneID;
		public $text;
		public $isSpeech;
		public $nextPageID;
		public $effectID;
		public $transitionID;

		public $actionFlagRequirements;
		public $actionEvents;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblActions';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->pageID = NULL;
			$this->sceneID = NULL;
			$this->text = '';
			$this->isSpeech = 0;
			$this->nextPageID = 0;
			$this->effectID = 0;
			$this->transitionID = 1;
			$this->actionFlagRequirements = [];
			$this->actionEvents = [];
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Action not found.");
				}
			}
		}

		public static function Create($user, $pageID = 0, $sceneID = 0){
			if(!$user->isAdmin){
				$result = false;
				if ($pageID > 0){
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
				}elseif ($sceneID > 0){
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
				}
				if(!$result){
					throw new Exception("Unauthorized user.");
				}
			}
			$newAction = new Action();
			$newAction->Insert($pageID,$sceneID);
			return $newAction;
		}

		private function Insert($pageID = 0, $sceneID = 0){			
			if ($pageID > 0){
				$this->pageID = $pageID;
				$this->ID = parent::$db->queryInsertGetID(
					'INSERT INTO tblActions
					(pageID)
					VALUES
					(:pageID);',
					[
						'pageID'=>$this->pageID
					]
				);
			}elseif ($sceneID > 0){
				$this->sceneID = $sceneID;
				$this->ID = parent::$db->queryInsertGetID(
					'INSERT INTO tblActions
					(sceneID)
					VALUES
					(:sceneID);',
					[
						'sceneID'=>$this->sceneID
					]
				);
			}
		}

		public static function GetAllActions($adventureID){
			$actionSet = [];
			$actions = parent::$db->queryGetAll(
				'SELECT tblActions.ID, tblActions.pageID, tblActions.sceneID, tblActions.text, tblActions.isSpeech, tblActions.nextPageID, tblActions.effectID, tblActions.transitionID
				 FROM tblActions
				 LEFT JOIN tblPages ON tblPages.ID = tblActions.pageID
				 LEFT JOIN tblScenes ON tblScenes.ID = tblActions.sceneID
				 WHERE (tblPages.adventureID = :adventureID OR tblScenes.adventureID = :adventureID)
				 AND tblActions.isActive = 1;', 
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($actions as $action){
				$actionSet[$action->ID] = new Action();
				$actionSet[$action->ID]->ID = $action->ID;
				$actionSet[$action->ID]->pageID = $action->pageID;
				$actionSet[$action->ID]->sceneID = $action->sceneID;
				$actionSet[$action->ID]->text = $action->text;
				$actionSet[$action->ID]->isSpeech = $action->isSpeech;
				$actionSet[$action->ID]->nextPageID = $action->nextPageID;
				$actionSet[$action->ID]->effectID = $action->effectID;
				$actionSet[$action->ID]->transitionID = $action->transitionID;
			}
			return $actionSet;
		}	

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblActions			 
					 LEFT JOIN tblPages ON tblPages.ID = tblActions.pageID
					 LEFT JOIN tblScenes ON tblScenes.ID = tblActions.sceneID
					 JOIN tblAdventures ON tblAdventures.ID = tblPages.adventureID
					 					OR tblAdventures.ID = tblScenes.adventureID
					 WHERE tblActions.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblActions.isActive = 1;', 
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
				'SELECT pageID, sceneID, text, isSpeech, nextPageID, effectID, transitionID
				 FROM tblActions
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'ID'=>$ID
				]
			);			
			if ($result){
				$this->ID = $ID;
				$this->pageID = $result->pageID;	
				$this->sceneID = $result->sceneID;	
				$this->text = $result->text;
				$this->isSpeech = $result->isSpeech;								
				$this->nextPageID = $result->nextPageID;
				$this->effectID = $result->effectID;
				$this->transitionID = $result->transitionID;
				return true;
			}else{
				return false;
			}
		}

		public function Update($text, $isSpeech, $nextPageID, $effectID, $transitionID){
			$this->text = htmlentities($text);
			$this->isSpeech = $isSpeech;								
			$this->nextPageID = $nextPageID;
			$this->effectID = $effectID;
			$this->transitionID = $transitionID;
			return parent::$db->query(
				'UPDATE tblActions
				 SET text = :text,
				 isSpeech = :isSpeech, 
				 nextPageID = :nextPageID, 
				 effectID = :effectID, 
				 transitionID = :transitionID
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'text'=>$this->text, 
					'isSpeech'=>$this->isSpeech, 
					'nextPageID'=>$this->nextPageID, 
					'effectID'=>$this->effectID, 
					'transitionID'=>$this->transitionID,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblActions
				 SET isActive = 0
				 WHERE ID = :ID;', 
				['ID'=>$this->ID]
			);
		}
			
	}

?>