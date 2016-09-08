<?php
	include_once(dirname(__FILE__).'/includeOverride.php');
	include_once('Adventure/Response.php');
	include_once('Adventure/CheckSession.php');
	include_once('Adventure/Validation.php');
	include_once('Adventure/Models/Adventure.php');

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['title','description']);
				$validation->addVariable('title',$input->title,'string',true,100);
				$validation->addVariable('description',$input->description,'string',true,500);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$newAdventure = Adventure::Create($userSession->user,$valid->title,$valid->description);
					$response->JSON = json_encode($newAdventure);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','hashKey','title','description','published','imageID']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('hashKey',$input->hashKey,'string',true,128);
				$validation->addVariable('title',$input->title,'string',true,100);
				$validation->addVariable('description',$input->description,'string',true,500);
				$validation->addVariable('published',$input->published,'bit',true);
				$validation->addVariable('imageID',$input->imageID,'uint');
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$adventure = new Adventure($valid->hashKey);
					$adventure->Update($valid->title,$valid->description,$valid->published,$valid->imageID);
				}
				break;
			case 'GET':
				$input = (object)$_GET;
				$adventure = Adventure::LoadByID($input->ID,$userSession->user);
				$response->JSON = json_encode($adventure);
				break;
		}
	} catch (Exception $e) {
		$response->JSON = '{"errorMsg":"'.$e->getMessage().'","errorFields":[]}';
		$response->error = 1;
	}

	$response->send();
?>