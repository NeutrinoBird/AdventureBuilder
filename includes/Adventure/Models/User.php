<?php
	include_once('Adventure\Models\Model.php');

	class User extends Model{
		public $ID;
		public $username;
		public $isAdmin;

		function __construct($username = '', $password = ''){
			parent::__construct();
			$this->tableName = 'tblUsers';
			$this->tableKey = 'ID';
			if($username != '' && $password != ''){
				if(!$this->Load($username, $password)){
					throw new Exception("Invalid Login.");
				}
			}
		}

		public static function GetCount(){
			$result = parent::$db->queryGetRow(
				'SELECT COUNT(1) as userCount
				 FROM tblUsers
				 WHERE isActive = 1;'
			);
			return $result->userCount;
		}

		public static function Create($username, $password, $isAdmin = 0){
			$newUser = new User();
			$newUser->Insert($username, $password, $isAdmin);
			if($newUser->ID == 0){
				throw new Exception("An unknown error occurred.");
			}
			return $newUser;
		}

		public function Insert($username, $password, $isAdmin = 0){
			$this->username = htmlentities($username, ENT_QUOTES);
			$this->isAdmin = $isAdmin;
			$result = parent::$db->queryGetRow(
				'SELECT COUNT(1) as userCount
				 FROM tblUsers
				 WHERE username = :username
				 AND isActive = 1;',
				 ['username'=>$this->username]
			);
			if ($result->userCount > 0){
				throw new Exception("Username is taken.");
			}
			$salt = hash('sha512','TwoSpices'.date("c").'TryingToGetBy');
			$passwordSalt = hash('sha512',$password.$salt);
			$this->ID = parent::$db->queryInsertGetID(
				'INSERT INTO tblUsers
				(username, password, salt, isAdmin)
				VALUES
				(:username, :password, :salt, :isAdmin);',
				[
					'username'=>$this->username, 
					'password'=>$passwordSalt, 
					'salt'=>$salt,
					'isAdmin'=>$this->isAdmin
				]
			);
		}

		public function Load($username, $password){
			$result = parent::$db->queryGetRow(
				'SELECT ID, username, password, salt, isAdmin
				 FROM tblUsers
				 WHERE username = :username
				 AND isActive = 1;', 
				['username'=>htmlentities($username, ENT_QUOTES)]
			);
			if ($result){
				if($result->password == hash('sha512',$password.$result->salt)){
					$this->ID = $result->ID;
					$this->username = $result->username;	
					$this->isAdmin = $result->isAdmin;				
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}

	}

?>