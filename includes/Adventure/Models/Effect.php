<?php
	include_once('Adventure\Models\Model.php');

	class Effect extends Model{
		public $ID;
		public $adventureID;
		public $name;
		public $keyframes;
		public $timing;
		public $duration;
		public $delay;
		public $loops;
		public $direction;
		public $fillMode;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblEffects';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->adventureID = NULL;
			$this->name = '';
			$this->keyframes = '';
			$this->timing = 'linear';
			$this->duration = 1;
			$this->delay = 0;
			$this->loops = 0;
			$this->direction = 'normal';
			$this->fillMode = 'none';
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Effect not found.");
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
			$newEffect = new Effect();
			$newEffect->Insert($adventureID);
			return $newEffect;
		}

		private function Insert($adventureID){
			$this->adventureID = $adventureID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblEffects
				(adventureID)
				VALUES
				(:adventureID);',
				[
					'adventureID'=>$this->adventureID
				]
			);
		}

		public static function GetAllEffects($adventureID){
			$effectSet = [];
			$effects = parent::$db->queryGetAll(
				'SELECT ID, adventureID, name, keyframes, timing, duration, delay, loops, direction, fillMode
				 FROM tblEffects
				 WHERE adventureID = :adventureID
				 AND isActive = 1;', 
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($effects as $effect){
				$effectSet[$effect->ID] = new Effect();
				$effectSet[$effect->ID]->ID = $effect->ID;
				$effectSet[$effect->ID]->adventureID = $effect->adventureID;
				$effectSet[$effect->ID]->name = $effect->name;
				$effectSet[$effect->ID]->keyframes = $effect->keyframes;
				$effectSet[$effect->ID]->timing = $effect->timing;
				$effectSet[$effect->ID]->duration = $effect->duration;
				$effectSet[$effect->ID]->delay = $effect->delay;
				$effectSet[$effect->ID]->loops = $effect->loops;
				$effectSet[$effect->ID]->direction = $effect->direction;
				$effectSet[$effect->ID]->fillMode = $effect->fillMode;
			}
			return $effectSet;
		}	

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblEffects
					 JOIN tblAdventures ON tblAdventures.ID = tblEffects.adventureID
					 WHERE tblEffects.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblEffects.isActive = 1;', 
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
				'SELECT adventureID, name, keyframes, timing, duration, delay, loops, direction, fillMode
				 FROM tblEffects
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
				$this->keyframes = $result->keyframes;		
				$this->timing = $result->timing;
				$this->duration = $result->duration;
				$this->delay = $result->delay;
				$this->loops = $result->loops;
				$this->direction = $result->direction;
				$this->fillMode = $result->fillMode;						
				return true;
			}else{
				return false;
			}
		}

		public function Update($name, $keyframes, $timing, $duration, $delay, $loops, $direction, $fillMode){
			$this->name = htmlentities($name);
			$this->keyframes = htmlspecialchars($keyframes);	
			$this->timing = htmlspecialchars($timing);
			$this->duration = $duration;
			$this->delay = $delay;
			$this->loops = $loops;
			$this->direction = htmlspecialchars($direction);
			$this->fillMode = htmlspecialchars($fillMode);
			return parent::$db->query(
				'UPDATE tblEffects
				 SET name = :name,
				 keyframes = :keyframes,
				 timing = :timing,
				 duration = :duration,
				 delay = :delay,
				 loops = :loops,
				 direction = :direction,
				 fillMode = :fillMode
				 WHERE ID = :ID
				 AND isActive = 1;', 
				[
					'name'=>$this->name, 
					'keyframes'=>$this->keyframes,
					'timing'=>$this->timing,
					'duration'=>$this->duration,
					'delay'=>$this->delay,
					'loops'=>$this->loops,
					'direction'=>$this->direction,
					'fillMode'=>$this->fillMode,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblEffects
				 SET isActive = 0
				 WHERE ID = :ID;', 
				['ID'=>$this->ID]
			);
		}
			
	}

?>