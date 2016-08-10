<?php
	include_once('Adventure\Models\UserSession.php');
	try{
		$userSession = new UserSession(true);
	} catch (Exception $e) {
		header($_SERVER['SERVER_PROTOCOL']." 500 Internal Server Error", FALSE, 500);		
		exit('{"errorMsg":"'.$e->getMessage().'","errorFields":[],"sessionExpired":1}');		
	}
?>