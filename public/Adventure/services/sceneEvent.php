<?php
	include_once('Adventure\Response.php');
	include_once('Adventure\CheckSession.php');
	include_once('Adventure\Validation.php');
	include_once('Adventure\Models\SceneEvent.php');

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				$input = json_decode(file_get_contents('php://input'));		
				$validation = new Validation();
				$validation->prime($input, ['sceneID']);
				$validation->addVariable('sceneID',$input->sceneID,'uint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$newSceneEvent = SceneEvent::Create($userSession->user,$valid->sceneID);
					$response->JSON = json_encode($newSceneEvent);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','sceneID','eventID','priority']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('sceneID',$input->sceneID,'uint',true);
				$validation->addVariable('eventID',$input->eventID,'uint',true);
				$validation->addVariable('priority',$input->priority,'tinyint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$sceneEvent = new SceneEvent($userSession->user,$valid->ID);
					$sceneEvent->Update($valid->eventID, $valid->priority);
				}
				break;
			case 'GET':			
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$sceneEvent = new SceneEvent($userSession->user,$input->ID);
				$response->JSON = json_encode($sceneEvent);				
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$sceneEvent = new SceneEvent($userSession->user,$deleteID);
					$sceneEvent->Delete();
					$response->JSON = '{"ID":'.$deleteID.'}';
				}
				break;
		}
	} catch (Exception $e) {			
		$response->JSON = '{"errorMsg":"'.$e->getMessage().'","errorFields":[]}';
		$response->error = 1;
	}

	$response->send();
?>