<?php
	include_once(dirname(__FILE__).'/includeOverride.php');
	include_once('Adventure/Response.php');
	include_once('Adventure/CheckSession.php');
	include_once('Adventure/Validation.php');
	include_once('Adventure/Models/EventFlagRequirement.php');

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['eventID']);
				$validation->addVariable('eventID',$input->eventID ?: '','uint',true);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$newEventFlagRequirement = EventFlagRequirement::Create($userSession->user,$valid->eventID);
					$response->JSON = json_encode($newEventFlagRequirement);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','eventID','flagID','counterValue','counterUpperValue','conditionID','pageID','otherFlagID']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('eventID',$input->eventID ?: '','uint',true);
				$validation->addVariable('flagID',$input->flagID,'uint');
				$validation->addVariable('counterValue',$input->counterValue,'int');
				$validation->addVariable('counterUpperValue',$input->counterUpperValue,'int');
				$validation->addVariable('conditionID',$input->conditionID,'tinyint',true);
				$validation->addVariable('pageID',$input->pageID,'uint');
				$validation->addVariable('otherFlagID',$input->otherFlagID,'uint');
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$eventFlagRequirement = new EventFlagRequirement($userSession->user,$valid->ID);
					$eventFlagRequirement->Update($valid->flagID, $valid->counterValue, $valid->counterUpperValue, $valid->conditionID, $valid->pageID, $valid->otherFlagID);
				}
				break;
			case 'GET':
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$eventFlagRequirement = new EventFlagRequirement($userSession->user,$input->ID);
				$response->JSON = json_encode($eventFlagRequirement);
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$eventFlagRequirement = new EventFlagRequirement($userSession->user,$deleteID);
					$eventFlagRequirement->Delete();
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