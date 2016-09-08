<?php
	include_once(dirname(__FILE__).'/includeOverride.php');
	include_once('Adventure/Response.php');
	include_once('Adventure/CheckSession.php');
	include_once('Adventure/Validation.php');
	include_once('Adventure/Models/Flag.php');

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['adventureID']);
				$validation->addVariable('adventureID',$input->adventureID,'uint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$newFlag = Flag::Create($userSession->user,$valid->adventureID);
					$response->JSON = json_encode($newFlag);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','adventureID','name','isItem','description','imageID','isCounter','counterDefault','counterMinimum','counterMaximum','counterWraps']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('adventureID',$input->adventureID,'uint',true);
				$validation->addVariable('name',$input->name,'string',true,50);
				$validation->addVariable('isItem',$input->isItem,'bit',true);
				$validation->addVariable('description',$input->description,'string',false,200);
				$validation->addVariable('imageID',$input->imageID,'uint');
				$validation->addVariable('isCounter',$input->isCounter,'bit',true);
				$validation->addVariable('counterDefault',$input->counterDefault,'int');
				$validation->addVariable('counterMinimum',$input->counterMinimum,'int');
				$validation->addVariable('counterMaximum',$input->counterMaximum,'int');
				$validation->addVariable('counterWraps',$input->counterWraps,'bit',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$flag = new Flag($userSession->user,$valid->ID);
					$flag->Update($valid->name, $valid->isItem, $valid->description, $valid->imageID, $valid->isCounter, $valid->counterDefault, $valid->counterMinimum, $valid->counterMaximum, $valid->counterWraps);
				}
				break;
			case 'GET':
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$flag = new Flag($userSession->user,$input->ID);
				$response->JSON = json_encode($flag);
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$flag = new Flag($userSession->user,$deleteID);
					$flag->Delete();
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