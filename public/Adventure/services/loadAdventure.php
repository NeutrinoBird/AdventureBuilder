<?php
	include_once('Adventure\Response.php');
	include_once('Adventure\Models\Adventure.php');

	try{
		if(!isset($_GET['hashKey'])){
			throw new Exception("Adventure not found.");
		}	
		$adventure = new Adventure($_GET['hashKey']);
		$response->JSON = json_encode($adventure);				
	} catch (Exception $e) {			
		$response->JSON = '{"errorMsg":"'.$e->getMessage().'","errorFields":[]}';
		$response->error = 1;
	}

	$response->send();
?>