<?php
	include_once('Adventure\Response.php');
	include_once('Adventure\CheckSession.php');
	include_once('Adventure\Validation.php');
	include_once('Adventure\Models\Action.php');

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['pageID','sceneID']);
				$validation->addVariable('pageID',$input->pageID,'uint',false);
				$validation->addVariable('sceneID',$input->sceneID,'uint',false);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$newAction = Action::Create($userSession->user,$valid->pageID,$valid->sceneID);
					$response->JSON = json_encode($newAction);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','pageID','sceneID','actionTypeID','text','nextPageID','effectID','transitionID']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('pageID',$input->pageID,'uint',false);
				$validation->addVariable('sceneID',$input->sceneID,'uint',false);
				$validation->addVariable('actionTypeID',$input->actionTypeID,'tinyint',true);
				$validation->addVariable('text',$input->text,'string',true,500);
				$validation->addVariable('nextPageID',$input->nextPageID,'uint',true);
				$validation->addVariable('effectID',$input->effectID,'uint');
				$validation->addVariable('transitionID',$input->transitionID,'tinyint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$action = new Action($userSession->user,$valid->ID);
					$action->Update($valid->actionTypeID, $valid->text, $valid->nextPageID, $valid->effectID, $valid->transitionID);
				}
				break;
			case 'GET':
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$action = new Action($userSession->user,$input->ID);
				$response->JSON = json_encode($action);
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$action = new Action($userSession->user,$deleteID);
					$action->Delete();
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