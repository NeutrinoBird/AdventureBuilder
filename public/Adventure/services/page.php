<?php
	include_once('Adventure\Response.php');
	include_once('Adventure\CheckSession.php');
	include_once('Adventure\Validation.php');
	include_once('Adventure\Models\Page.php');

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
					$newPage = Page::Create($userSession->user,$valid->adventureID);
					$response->JSON = json_encode($newPage);
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','adventureID','name','text','sceneID','pageTypeID','imageID','effectID']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('adventureID',$input->adventureID,'uint',true);
				$validation->addVariable('name',$input->name,'string',true,50);
				$validation->addVariable('text',$input->text,'string',true,2000);
				$validation->addVariable('sceneID',$input->sceneID,'uint',true);
				$validation->addVariable('pageTypeID',$input->pageTypeID,'tinyint',true);
				$validation->addVariable('imageID',$input->imageID,'uint');
				$validation->addVariable('effectID',$input->effectID,'uint');
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$page = new Page($userSession->user,$valid->ID);
					$page->Update($valid->name, $valid->text, $valid->sceneID, $valid->pageTypeID, $valid->imageID, $valid->effectID);
				}
				break;
			case 'GET':			
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$page = new Page($userSession->user,$input->ID);
				$response->JSON = json_encode($page);				
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$page = new Page($userSession->user,$deleteID);
					$page->Delete();
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