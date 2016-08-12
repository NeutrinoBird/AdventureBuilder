<?php
	include_once('Adventure\Models\Model.php');

	class Flag extends Model{
		public $ID;
		public $adventureID;
		public $name;
		public $isItem;
		public $description;
		public $imageID;
		public $isCounter;
		public $counterDefault;
		public $counterMinimum;
		public $counterMaximum;
		public $counterWraps;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblFlags';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->adventureID = NULL;
			$this->name = '';
			$this->isItem = 0;
			$this->description = '';
			$this->imageID = NULL;
			$this->isCounter = 0;
			$this->counterDefault = NULL;
			$this->counterMinimum = NULL;
			$this->counterMaximum = NULL;
			$this->counterWraps = 0;
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Flag not found.");
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
			$newFlag = new Flag();
			$newFlag->Insert($adventureID);
			return $newFlag;
		}

		private function Insert($adventureID){
			$this->adventureID = $adventureID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblFlags
				(adventureID)
				VALUES
				(:adventureID);',
				[
					'adventureID'=>$this->adventureID
				]
			);
		}

		public static function GetAllFlags($adventureID){
			$flagSet = [];
			$flags = parent::$db->queryGetAll(
				'SELECT ID, adventureID, name, isItem, description, imageID, isCounter, counterDefault, counterMinimum, counterMaximum, counterWraps
				 FROM tblFlags
				 WHERE adventureID = :adventureID
				 AND isActive = 1;', 
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($flags as $flag){
				$flagSet[$flag->ID] = new Flag();
				$flagSet[$flag->ID]->ID = $flag->ID;
				$flagSet[$flag->ID]->adventureID = $flag->adventureID;
				$flagSet[$flag->ID]->name = $flag->name;
				$flagSet[$flag->ID]->isItem = $flag->isItem;
				$flagSet[$flag->ID]->description = $flag->description;
				$flagSet[$flag->ID]->imageID = $flag->imageID;
				$flagSet[$flag->ID]->isCounter = $flag->isCounter;
				$flagSet[$flag->ID]->counterDefault = $flag->counterDefault;
				$flagSet[$flag->ID]->counterMinimum = $flag->counterMinimum;
				$flagSet[$flag->ID]->counterMaximum = $flag->counterMaximum;
				$flagSet[$flag->ID]->counterWraps = $flag->counterWraps;
			}
			return $flagSet;
		}	

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblFlags
					 JOIN tblAdventures ON tblAdventures.ID = tblFlags.adventureID
					 WHERE tblFlags.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblFlags.isActive = 1;', 
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
				'SELECT adventureID, name, isItem, description, imageID, isCounter, counterDefault, counterMinimum, counterMaximum, counterWraps
				 FROM tblFlags
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
				$this->isItem = $result->isItem;
				$this->description = $result->description;		
				$this->imageID = $result->imageID;	
				$this->isCounter = $result->isCounter;
				$this->counterDefault = $result->counterDefault;
				$this->counterMinimum = $result->counterMinimum;
				$this->counterMaximum = $result->counterMaximum;
				$this->counterWraps = $result->counterWraps;
				return true;
			}else{
				return false;
			}
		}

		public function Update($name, $isItem, $description, $imageID, $isCounter, $counterDefault, $counterMinimum, $counterMaximum, $counterWraps){
			$this->name = htmlentities($name);
			$this->isItem = $isItem;	
			$this->description = $description;	
			$this->imageID = $imageID;
			$this->isCounter = $isCounter;	
			$this->counterDefault = $counterDefault;	
			$this->counterMinimum = $counterMinimum;	
			$this->counterMaximum = $counterMaximum;	
			$this->counterWraps = $counterWraps;	
			return parent::$db->query(
				'UPDATE tblFlags
				 SET name = :name,
				 isItem = :isItem,
				 description = :description,
				 imageID = :imageID,
				 isCounter = :isCounter,
				 counterDefault = :counterDefault,
				 counterMinimum = :counterMinimum,
				 counterMaximum = :counterMaximum,
				 counterWraps = :counterWraps
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'name'=>$this->name, 
					'isItem'=>$this->isItem,
					'description'=>$this->description,
					'imageID'=>$this->imageID,
					'isCounter'=>$this->isCounter, 
					'counterDefault'=>$this->counterDefault, 
					'counterMinimum'=>$this->counterMinimum, 
					'counterMaximum'=>$this->counterMaximum, 
					'counterWraps'=>$this->counterWraps, 
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblFlags
				 SET isActive = 0
				 WHERE ID = :ID;

				 UPDATE tblActionFlagRequirements				 	
				 SET flagID = 0
				 WHERE flagID = :ID;

				 UPDATE tblEvents				 	
				 SET flagID = 0
				 WHERE flagID = :ID;

				 UPDATE tblEvents				 	
				 SET conditionFlagID = 0
				 WHERE conditionFlagID = :ID;', 
				['ID'=>$this->ID]
			);
		}
			
	}

?>