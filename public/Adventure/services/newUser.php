<?php
	include_once(dirname(__FILE__).'/includeOverride.php');
	include_once('Adventure/CheckSession.php');
	$returnJSON = "";
	$error = 0;

	$username = isset($_POST['username']) ? $_POST['username'] : '';
	$password = isset($_POST['password']) ? $_POST['password'] : '';

	if ($username == '' || $password == ''){
		$returnJSON = '{"errorMsg":"Please enter a username and password.","errorFields":[]}';
		$error = 1;
	}else{
		try{
			$user = User::Create($username,$password,0);
			$returnJSON = '{"userID":'.$user->ID.',"isAdmin":'.$user->isAdmin.'}';
		} catch (Exception $e) {
			$returnJSON = '{"errorMsg":"'.$e->getMessage().'","errorFields":[]}';
			$error = 1;
		}
	}

	if($error == 0){
		header($_SERVER['SERVER_PROTOCOL']." 200 OK", FALSE, 200);
	}else{
		header($_SERVER['SERVER_PROTOCOL']." 500 Internal Server Error", FALSE, 500);
	}

	exit($returnJSON);
?>