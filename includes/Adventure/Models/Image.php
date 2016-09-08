<?php
	include_once('Adventure/Models/Model.php');

	class Image extends Model{
		public $ID;
		public $adventureID;
		public $URL;
		public $width;
		public $height;
		public $centerX;
		public $centerY;
		public $scale;

		function __construct($user = NULL, $ID = 0){
			parent::__construct();
			$this->tableName = 'tblImages';
			$this->tableKey = 'ID';
			$this->ID = NULL;
			$this->adventureID = NULL;
			$this->URL = '';
			$this->width = 0;
			$this->height = 0;
			$this->centerX = '50%';
			$this->centerY = '50%';
			$this->scale = '1';
			if(!is_null($user) && $ID > 0){
				if(!$this->Load($user, $ID)){
					throw new Exception("Image not found.");
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
			$newImage = new Image();
			$newImage->Insert($adventureID);
			return $newImage;
		}

		private function Insert($adventureID){
			$this->adventureID = $adventureID;
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblImages
				(adventureID)
				VALUES
				(:adventureID);',
				[
					'adventureID'=>$this->adventureID
				]
			);
		}

		public static function GetAllImages($adventureID){
			$imageSet = [];
			$images = parent::$db->queryGetAll(
				'SELECT ID, adventureID, URL, width, height, centerX, centerY, scale
				 FROM tblImages
				 WHERE adventureID = :adventureID
				 AND isActive = 1;',
				[
					'adventureID'=>$adventureID,
				]
			);
			foreach($images as $image){
				$imageSet[$image->ID] = new Image();
				$imageSet[$image->ID]->ID = $image->ID;
				$imageSet[$image->ID]->adventureID = $image->adventureID;
				$imageSet[$image->ID]->URL = $image->URL;
				$imageSet[$image->ID]->width = $image->width;
				$imageSet[$image->ID]->height = $image->height;
				$imageSet[$image->ID]->centerX = $image->centerX;
				$imageSet[$image->ID]->centerY = $image->centerY;
				$imageSet[$image->ID]->scale = $image->scale;
			}
			return $imageSet;
		}

		private function Load($user, $ID){
			if(is_null($user) || !is_numeric($ID))
				return false;
			if(!$user->isAdmin){
				$result = parent::$db->queryGetRow(
					'SELECT 1
					 FROM tblImages
					 JOIN tblAdventures ON tblAdventures.ID = tblImages.adventureID
					 WHERE tblImages.ID = :ID
					 AND tblAdventures.userID = :userID
					 AND tblImages.isActive = 1;',
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
				'SELECT adventureID, URL, width, height, centerX, centerY, scale
				 FROM tblImages
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'ID'=>$ID
				]
			);
			if ($result){
				$this->ID = $ID;
				$this->adventureID = $result->adventureID;
				$this->URL = $result->URL;
				$this->width = $result->width;
				$this->height = $result->height;
				$this->centerX = $result->centerX;
				$this->centerY = $result->centerY;
				$this->scale = $result->scale;
				return true;
			}else{
				return false;
			}
		}

		public function Update($centerX,$centerY,$scale){
			$this->centerX = $centerX;
			$this->centerY = $centerY;
			$this->scale = $scale;
			return parent::$db->query(
				'UPDATE tblImages
				 SET tblImages.centerX = :centerX,
				 tblImages.centerY = :centerY,
				 tblImages.scale = :scale
				 WHERE tblImages.ID = :ID
				 AND isActive = 1;',
				[
					'centerX'=>$this->centerX,
					'centerY'=>$this->centerY,
					'scale'=>$this->scale,
					'ID'=>$this->ID
				]
			);
		}

		public function Upload($imageFile){
			error_reporting(E_ERROR | E_PARSE);
			// Spoof detection
			if (!isset($imageFile['error']) || is_array($imageFile['error'])) {
				throw new Exception('An error occurred when uploading.');
			}
			// Handle upload errors
			switch ($imageFile['error']) {
				case UPLOAD_ERR_OK:
					break;
				case UPLOAD_ERR_NO_FILE:
					throw new Exception('No file attached.');
					break;
				case UPLOAD_ERR_INI_SIZE:
				case UPLOAD_ERR_FORM_SIZE:
					throw new Exception('File too large.');
					break;
				default:
					throw new Exception('An unknown error occurred.');
			}
			$fileInfo = pathinfo($imageFile['name']);
			$target_dir = $_SERVER['DOCUMENT_ROOT'].'/Adventure/uploads/';
			// Generate unique random name
			do{
				$fileName = substr(preg_replace('/[^a-zA-Z0-9]/','',$fileInfo['filename']),0,16).'_'.substr(hash('md5',date('c').rand(0,100000)),0,16).'.'.$fileInfo['extension'];
			}while(file_exists($target_dir.$fileName));
			// Check filetype
			if(!in_array($imageFile['type'],['image/png','image/gif','image/jpeg'])){
				throw new Exception('Filetype not supported.');
			}
			if(!in_array($fileInfo['extension'],['jpeg','jpg','png','gif'])){
				throw new Exception('Invalid file extension.');
			}
			if(!getimagesize($imageFile['tmp_name'])){
				throw new Exception('Invalid image.');
			}
			$imageSize = getimagesize($imageFile['tmp_name']);
			if($imageSize === false){
				throw new Exception('Invalid image.');
			}
			// Check filesize
			if($imageFile['size'] > 2097152){
				throw new Exception('File too large.');
			}
			// Upload file
			if(!move_uploaded_file($imageFile['tmp_name'], $target_dir.$fileName)){
				throw new Exception('An error occurred while uploading.');
			}
			$this->URL = $fileName;
			$this->width = $imageSize[0];
			$this->height = $imageSize[1];
			return parent::$db->query(
				'UPDATE tblImages
				 SET URL = :URL,
					 width = :width,
					 height = :height
				 WHERE ID = :ID
				 AND isActive = 1;',
				[
					'URL'=>$this->URL,
					'width'=>$this->width,
					'height'=>$this->height,
					'ID'=>$this->ID
				]
			);
		}

		public function Delete(){
			return parent::$db->query(
				'UPDATE tblImages
				 SET isActive = 0
				 WHERE ID = :ID;

				 UPDATE tblAdventures
				 SET imageID = 0
				 WHERE imageID = :ID;

				 UPDATE tblPages
				 SET imageID = 0
				 WHERE imageID = :ID;

				 UPDATE tblFlags
				 SET imageID = 0
				 WHERE imageID = :ID;',
				['ID'=>$this->ID]
			);
		}

	}

?>