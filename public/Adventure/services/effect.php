<?php
	include_once(dirname(__FILE__).'/includeOverride.php');
	include_once('Adventure/Response.php');
	include_once('Adventure/CheckSession.php');
	include_once('Adventure/Validation.php');
	include_once('Adventure/Models/Effect.php');

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['adventureID']);
				$validation->addVariable('adventureID',$input->adventureID ?: '','uint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$newEffect = Effect::Create($userSession->user,$valid->adventureID);
					$response->JSON = json_encode($newEffect);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','adventureID','name','keyframes', 'timing', 'duration', 'delay', 'loops', 'direction', 'fillMode']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('adventureID',$input->adventureID ?: '','uint',true);
				$validation->addVariable('name',$input->name,'string',true,50);
				$validation->addVariable('keyframes',$input->keyframes,'string',true,1000);
				$validation->addVariable('timing',$input->timing,'string',true,40);
				$validation->addVariable('duration',$input->duration,'decimal',true,10);
				$validation->addVariable('delay',$input->delay,'tinyint',true);
				$validation->addVariable('loops',$input->loops,'tinyint',true);
				$validation->addVariable('direction',$input->direction,'string',true,20);
				$validation->addVariable('fillMode',$input->fillMode,'string',true,20);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$effect = new Effect($userSession->user,$valid->ID);
					$effect->Update($valid->name, $valid->keyframes, $valid->timing, $valid->duration, $valid->delay, $valid->loops, $valid->direction, $valid->fillMode);
				}
				break;
			case 'GET':
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$effect = new Effect($userSession->user,$input->ID);
				$response->JSON = json_encode($effect);
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$effect = new Effect($userSession->user,$deleteID);
					$effect->Delete();
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