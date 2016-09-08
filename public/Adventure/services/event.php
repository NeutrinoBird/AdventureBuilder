<?php
	include_once(dirname(__FILE__).'/includeOverride.php');
	include_once('Adventure/Response.php');
	include_once('Adventure/CheckSession.php');
	include_once('Adventure/Validation.php');
	include_once('Adventure/Models/Event.php');

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
					$newEvent = Event::Create($userSession->user,$valid->adventureID);
					$response->JSON = json_encode($newEvent);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','adventureID','eventTypeID','flagID','value','textBefore','textAfter','pageID','conditionID','conditionFlagID','counterValue','counterUpperValue','conditionPageID','conditionOtherFlagID']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('adventureID',$input->adventureID,'uint',true);
				$validation->addVariable('eventTypeID',$input->eventTypeID,'tinyint',true);
				$validation->addVariable('flagID',$input->flagID,'uint');
				$validation->addVariable('value',$input->value,'int');
				$validation->addVariable('textBefore',$input->textBefore,'string',false,200);
				$validation->addVariable('textAfter',$input->textAfter,'string',false,200);
				$validation->addVariable('pageID',$input->pageID,'uint');
				$validation->addVariable('conditionID',$input->conditionID,'tinyint',true);
				$validation->addVariable('conditionFlagID',$input->conditionFlagID,'uint');
				$validation->addVariable('counterValue',$input->counterValue,'int');
				$validation->addVariable('counterUpperValue',$input->counterUpperValue,'int');
				$validation->addVariable('conditionPageID',$input->conditionPageID,'uint');
				$validation->addVariable('conditionOtherFlagID',$input->conditionOtherFlagID,'uint');
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$event = new Event($userSession->user,$valid->ID);
					$event->Update($valid->eventTypeID, $valid->flagID, $valid->value, $valid->textBefore, $valid->textAfter, $valid->pageID, $valid->counterValue, $valid->counterUpperValue, $valid->conditionID, $valid->conditionFlagID, $valid->conditionPageID, $valid->conditionOtherFlagID);
				}
				break;
			case 'GET':
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$event = new Event($userSession->user,$input->ID);
				$response->JSON = json_encode($event);
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$event = new Event($userSession->user,$deleteID);
					$event->Delete();
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