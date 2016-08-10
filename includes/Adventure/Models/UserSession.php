<?php
	include_once('Adventure\Models\Model.php');
	include_once('Adventure\Models\User.php');

	class UserSession extends Model{
		public $user;
		public $hashKey;
		public $dateExpire;

		function __construct($load = false){
			parent::__construct();
			$this->tableName = 'tblUserSessions';
			$this->tableKey = 'ID';
			if($load){
				if(!$this->Load()){
					setcookie("sessionKey",'',time()-3600);
					throw new Exception("Session expired.");
				}
			}
		}

		public static function Create($user){
			$newUserSession = new UserSession();
			$newUserSession->Insert($user);			
			return $newUserSession;
		}

		public function Insert($user){
			$this->user = $user;
			$this->hashKey = hash('sha512',$user->ID.'TwoSpices'.date("c").'TryingToGetBy');
			$this->dateExpire = time() + 3600;
			parent::$db->query(
				'INSERT INTO tblUserSessions
				(userID, hashKey, IP, dateExpire)
				VALUES
				(:userID, :hashKey, :IP, :dateExpire);',
				[
					'userID'=>$this->user->ID, 
					'hashKey'=>$this->hashKey, 
					'IP'=>$_SERVER['REMOTE_ADDR'],
					'dateExpire'=>$this->SQLDate($this->dateExpire)
				]
			);
			setcookie("sessionKey",$this->hashKey,time()+3600);
		}

		public function Load(){
			if(!isset($_COOKIE['sessionKey'])){
				return false;
			}
			$hashKey = $_COOKIE['sessionKey'];
			$result = parent::$db->queryGetRow(
				'SELECT tblUsers.ID, tblUsers.username, tblUsers.isAdmin, tblUserSessions.dateExpire
				 FROM tblUserSessions
				 JOIN tblUsers ON tblUserSessions.userID = tblUsers.ID
				 WHERE hashKey = :hashKey
				 AND IP = :IP
				 AND NOW() < dateExpire;', 
				[
					'hashKey'=>$hashKey,
					'IP'=>$_SERVER['REMOTE_ADDR']
				]
			);
			if ($result){
				$this->user = new User();
				$this->user->ID = $result->ID;
				$this->user->username = $result->username;
				$this->user->isAdmin = $result->isAdmin;
				$this->hashKey = $hashKey;
				$this->Update();
				return true;
			}else{
				return false;
			}
		}

		public function Update(){			
			parent::$db->query(
				'UPDATE tblUserSessions				 
				 SET dateExpire = :dateExpire
				 WHERE hashKey = :hashKey
				 AND IP = :IP
				 AND NOW() < dateExpire;', 
				[
					'dateExpire'=>$this->SQLDate(time() + 3600),
					'hashKey'=>$this->hashKey,
					'IP'=>$_SERVER['REMOTE_ADDR']
				]
			);
			$this->dateExpire = time() + 3600;
			setcookie("sessionKey",$this->hashKey,time()+3600);
		}

	}

?>