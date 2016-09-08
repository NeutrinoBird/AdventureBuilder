<?php
	include_once(dirname(__FILE__).'/includeOverride.php');
	include_once('Adventure/Response.php');
	include_once('Adventure/CheckSession.php');
	include_once('Adventure/Validation.php');
	include_once('Adventure/Models/ActionEvent.php');

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['actionID']);
				$validation->addVariable('actionID',$input->actionID,'uint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$newActionEvent = ActionEvent::Create($userSession->user,$valid->actionID);
					$response->JSON = json_encode($newActionEvent);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','actionID','eventID','priority']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('actionID',$input->actionID,'uint',true);
				$validation->addVariable('eventID',$input->eventID,'uint',true);
				$validation->addVariable('priority',$input->priority,'tinyint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$actionEvent = new ActionEvent($userSession->user,$valid->ID);
					$actionEvent->Update($valid->eventID, $valid->priority);
				}
				break;
			case 'GET':
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$actionEvent = new ActionEvent($userSession->user,$input->ID);
				$response->JSON = json_encode($actionEvent);
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$actionEvent = new ActionEvent($userSession->user,$deleteID);
					$actionEvent->Delete();
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