<?php
	include_once('Adventure/Models/Model.php');
	include_once('Adventure/Models/User.php');
	include_once('Adventure/Models/Page.php');
	include_once('Adventure/Models/Scene.php');
	include_once('Adventure/Models/Image.php');
	include_once('Adventure/Models/Effect.php');
	include_once('Adventure/Models/Flag.php');
	include_once('Adventure/Models/Event.php');
	include_once('Adventure/Models/Action.php');
	include_once('Adventure/Models/ActionFlagRequirement.php');
	include_once('Adventure/Models/SceneEvent.php');
	include_once('Adventure/Models/PageEvent.php');
	include_once('Adventure/Models/ActionEvent.php');

	class Adventure extends Model{
		public $ID;
		public $hashKey;
		public $title;
		public $description;
		public $author;
		public $published;
		public $imageID;
		public $imageURL;

		public $pages;
		public $scenes;
		public $images;
		public $effects;
		public $flags;
		public $events;

		function __construct($getKey = ''){
			parent::__construct();
			$this->tableName = 'tblAdventures';
			$this->tableKey = 'ID';
			$this->author = NULL;
			$this->title = NULL;
			$this->description = NULL;
			$this->hashKey = NULL;
			$this->published = NULL;
			$this->imageID = NULL;
			$this->imageURL = NULL;
			$this->ID = NULL;
			$this->pages = [];
			$this->scenes = [];
			$this->images = [];
			$this->effects = [];
			$this->flags = [];
			$this->events = [];
			if($getKey != ''){
				if(!$this->Load($getKey)){
					throw new Exception("Adventure not found.");
				}
			}
		}

		public static function Create($User, $title, $description){
			$newAdventure = new Adventure();
			$newAdventure->Insert($User, $title, $description);
			return $newAdventure;
		}

		private function Insert($User, $title, $description){
			$this->author = $User->username;
			$this->title = htmlentities($title, ENT_QUOTES);
			$this->description = htmlentities($description, ENT_QUOTES);
			$this->hashKey = hash("sha512",$title.$description.date("Y-m-d H:i:s"));
			$this->published = 0;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblAdventures
				(userID, title, description, hashKey)
				VALUES
				(:userID, :title, :description, :hashKey);',
				[
					'userID'=>$User->ID,
					'title'=>$this->title,
					'description'=>$this->description,
					'hashKey'=>$this->hashKey
				]
			);
		}

		public static function LoadByID($ID, $User){
			$ID = intval($ID);
			if($User->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT tblAdventures.hashKey
					 FROM tblAdventures
					 WHERE tblAdventures.ID = :ID;',
					[
						'ID'=>$ID
					]
				);
			}else{
				$result = parent::$db->queryGetRow(
					'SELECT tblAdventures.hashKey
					 FROM tblAdventures
					 WHERE tblAdventures.ID = :ID
					 AND userID = :userID;',
					[
						'ID'=>$ID,
						'userID'=>$User->ID
					]
				);
			}
			if($result){
				$newAdventure = new Adventure($result->hashKey);
				return $newAdventure;
			}else{
				throw new Exception("Adventure not found.");
			}
		}

		private function Load($getKey){
			if(preg_match('/^[0-9a-f]{128}$/', $getKey) === false)
				return false;
			$result = parent::$db->queryGetRow(
				'SELECT tblAdventures.ID, tblAdventures.title, tblAdventures.description, tblAdventures.published, tblAdventures.imageID, tblUsers.username, tblImages.URL, tblImages.centerX, tblImages.centerY, tblImages.scale
				 FROM tblAdventures
				 JOIN tblUsers ON tblUsers.ID = tblAdventures.userID
				 LEFT JOIN tblImages ON tblImages.ID = tblAdventures.imageID AND tblImages.isActive = 1
				 WHERE tblAdventures.hashKey = :hashKey
				 AND tblAdventures.isActive = 1;',
				['hashKey'=>$getKey]
			);
			if ($result){
				$this->ID = $result->ID;
				$this->title = $result->title;
				$this->description = $result->description;
				$this->author = $result->username;
				$this->published = $result->published;
				$this->hashKey = $getKey;
				$this->imageID = $result->imageID;
				$this->imageURL = $result->URL;
				$this->imageX = $result->centerX;
				$this->imageY = $result->centerY;
				$this->imageScale = $result->scale;
				//Load sub-items
				$this->pages = Page::GetAllPages($this->ID);
				$this->scenes = Scene::GetAllScenes($this->ID);
				//The following sub-items will be immediately converted to indexed arrays for JSON parsing, as they don't require nesting
				$this->images = array_merge(Image::GetAllImages($this->ID));
				$this->effects = array_merge(Effect::GetAllEffects($this->ID));
				$this->flags = array_merge(Flag::GetAllFlags($this->ID));
				$this->events = array_merge(Event::GetAllEvents($this->ID));
				//The following are sub-sub-items, and will be nested
				$actions = Action::GetAllActions($this->ID);
				$actionFlagRequirements = ActionFlagRequirement::GetAllActionFlagRequirements($this->ID);
				$sceneEvents = SceneEvent::GetAllSceneEvents($this->ID);
				$pageEvents = PageEvent::GetAllPageEvents($this->ID);
				$actionEvents = ActionEvent::GetAllActionEvents($this->ID);
				//Nest sub-items
				foreach ($sceneEvents as $sceneEvent){
					array_push($this->scenes[$sceneEvent->sceneID]->sceneEvents,$sceneEvent);
				}
				foreach ($pageEvents as $pageEvent){
					array_push($this->pages[$pageEvent->pageID]->pageEvents,$pageEvent);
				}
				foreach ($actionEvents as $actionEvent){
					array_push($actions[$actionEvent->actionID]->actionEvents,$actionEvent);
				}
				foreach ($actionFlagRequirements as $actionFlagRequirement){
					array_push($actions[$actionFlagRequirement->actionID]->actionFlagRequirements,$actionFlagRequirement);
				}
				foreach ($actions as $action){
					if(intval($action->pageID) > 0){
						array_push($this->pages[$action->pageID]->actions,$action);
					}elseif(intval($action->sceneID) > 0){
						array_push($this->scenes[$action->sceneID]->actions,$action);
					}
				}
				//Convert arrays from associative to indexed (for JSON parsing)
				$this->pages = array_merge($this->pages);
				$this->scenes = array_merge($this->scenes);
				return true;
			}else{
				return false;
			}
		}

		public static function GetList($user){
			if ($user->isAdmin){
				return parent::$db->queryGetAll(
					'SELECT tblAdventures.ID, tblAdventures.title, tblAdventures.description, tblAdventures.hashKey, tblAdventures.published, tblUsers.username as author, tblImages.URL as imageURL, tblImages.centerX as imageX, tblImages.centerY as imageY, tblImages.scale as imageScale
					 FROM tblAdventures
					 JOIN tblUsers ON tblUsers.ID = tblAdventures.userID
					 LEFT JOIN tblImages ON tblImages.ID = tblAdventures.imageID AND tblImages.isActive = 1
					 WHERE tblAdventures.isActive = 1;'
				);
			}else{
				return parent::$db->queryGetAll(
					'SELECT tblAdventures.ID, tblAdventures.title, tblAdventures.description, tblAdventures.hashKey, tblAdventures.published, tblUsers.username as author, tblImages.URL as imageURL, tblImages.centerX as imageX, tblImages.centerY as imageY, tblImages.scale as imageScale
					 FROM tblAdventures
					 JOIN tblUsers ON tblUsers.ID = tblAdventures.userID
					 LEFT JOIN tblImages ON tblImages.ID = tblAdventures.imageID AND tblImages.isActive = 1
					 WHERE tblAdventures.userID = :userID
					 AND tblAdventures.isActive = 1;',
					['userID'=>$user->ID]
				);
			}
		}

		public function Update($title = '', $description = '', $published = 0, $imageID = NULL){
			$this->title = htmlentities($title, ENT_QUOTES);
			$this->description = htmlentities($description, ENT_QUOTES);
			$this->published = $published;
			$this->imageID = $imageID;
			return parent::$db->query(
				'UPDATE tblAdventures
				 SET title = :title,
				 	description = :description,
				 	published = :published,
				 	imageID = :imageID
				 WHERE tblAdventures.ID = :ID
				 AND isActive = 1;',
				[
					'title'=>$this->title,
					'description'=>$this->description,
					'published'=>$this->published,
					'imageID'=>$this->imageID,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblAdventures
				 SET isActive = 0
				 WHERE ID = :ID;',
				['ID'=>$this->ID]
			);
		}

	}

?>