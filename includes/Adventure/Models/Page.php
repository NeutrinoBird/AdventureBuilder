<?php
	include_once('Adventure/Models/Model.php');

	class Page extends Model{
		public $ID;
		public $adventureID;
		public $name;
		public $text;
		public $sceneID;
		public $pageTypeID;
		public $imageID;
		public $effectID;

		public $actions;
		public $pageEvents;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblPages';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->adventureID = NULL;
			$this->name = '';
			$this->text = '';
			$this->sceneID = 0;
			$this->pageTypeID = 1;
			$this->imageID = NULL;
			$this->effectID = 0;
			$this->actions = [];
			$this->pageEvents = [];
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Page not found.");
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
			$newPage = new Page();
			$newPage->Insert($adventureID);
			return $newPage;
		}

		private function Insert($adventureID){
			$this->adventureID = $adventureID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblPages
				(adventureID)
				VALUES
				(:adventureID);',
				[
					'adventureID'=>$this->adventureID
				]
			);
		}

		public static function GetAllPages($adventureID){
			$pageSet = [];
			$pages = parent::$db->queryGetAll(
				'SELECT ID, adventureID, name, text, sceneID, pageTypeID, imageID, effectID
				 FROM tblPages
				 WHERE adventureID = :adventureID
				 AND isActive = 1;',
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($pages as $page){
				$pageSet[$page->ID] = new Page();
				$pageSet[$page->ID]->ID = $page->ID;
				$pageSet[$page->ID]->adventureID = $page->adventureID;
				$pageSet[$page->ID]->name = $page->name;
				$pageSet[$page->ID]->text = $page->text;
				$pageSet[$page->ID]->sceneID = $page->sceneID;
				$pageSet[$page->ID]->pageTypeID = $page->pageTypeID;
				$pageSet[$page->ID]->imageID = $page->imageID;
				$pageSet[$page->ID]->effectID = $page->effectID;
			}
			return $pageSet;
		}

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblPages
					 JOIN tblAdventures ON tblAdventures.ID = tblPages.adventureID
					 WHERE tblPages.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblPages.isActive = 1;',
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
				'SELECT adventureID, name, text, sceneID, pageTypeID, imageID, effectID
				 FROM tblPages
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->adventureID = $result->adventureID;
				$this->name = $result->name;
				$this->text = $result->text;
				$this->sceneID = $result->sceneID;
				$this->pageTypeID = $result->pageTypeID;
				$this->imageID = $result->imageID;
				$this->effectID = $result->effectID;
				return true;
			}else{
				return false;
			}
		}

		public function Update($name, $text, $sceneID, $pageTypeID, $imageID, $effectID){
			$this->name = htmlentities($name);
			$this->text = htmlentities($text);
			$this->sceneID = $sceneID;
			$this->pageTypeID = $pageTypeID;
			$this->imageID = $imageID;
			$this->effectID = $effectID;
			return parent::$db->query(
				'UPDATE tblPages
				 SET name = :name,
				 text = :text,
				 sceneID = :sceneID,
				 pageTypeID = :pageTypeID,
				 imageID = :imageID,
				 effectID = :effectID
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'name'=>$this->name,
					'text'=>$this->text,
					'sceneID'=>$this->sceneID,
					'pageTypeID'=>$this->pageTypeID,
					'imageID'=>$this->imageID,
					'effectID'=>$this->effectID,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblPages
				 SET isActive = 0
				 WHERE ID = :ID;

				 UPDATE tblActions
				 SET isActive = 0
				 WHERE pageID = :ID;

				 UPDATE tblPageEvents
				 SET isActive = 0
				 WHERE pageID = :ID;

				 UPDATE tblActionFlagRequirements
				 JOIN tblActions ON tblActions.ID = tblActionFlagRequirements.actionID
				 SET tblActionFlagRequirements.isActive = 0
				 WHERE tblActions.pageID = :ID;

				 UPDATE tblActionEvents
				 JOIN tblActions ON tblActions.ID = tblActionEvents.actionID
				 SET tblActionEvents.isActive = 0
				 WHERE tblActions.pageID = :ID;

				 UPDATE tblActions
				 SET nextPageID = 0
				 WHERE nextPageID = :ID;

				 UPDATE tblEvents
				 SET pageID = 0
				 WHERE pageID = :ID;',
				['ID'=>$this->ID]
			);
		}

	}

?>