<?php
	include_once('Adventure\Response.php');
	include_once('Adventure\CheckSession.php');
	include_once('Adventure\Validation.php');
	include_once('Adventure\Models\Image.php');
	$imageUpdateResponse = false;

	try{
		switch($_SERVER['REQUEST_METHOD']){
			case 'POST':
				if (isset($_SERVER['PATH_INFO'])){
					//Upload image
					$imageUpdateResponse = true;
					$input = (object)$_POST;
					$validation = new Validation();
					$validation->prime($input, ['ID','adventureID']);
					$validation->addVariable('ID',$input->ID,'uint',true);
					$validation->addVariable('adventureID',$input->adventureID ?: '','uint',true);
					$validation->validate();
					if($validation->result['error'] == 1){
						$response->JSON = '<textarea data-type="application/json" data-status="500">{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}</textarea>';
						$response->error = 1;
					}else{
						$valid = (object)$validation->result['validated'];
						$image = new Image($userSession->user,$valid->ID);
						$image->Upload($_FILES['imageFile']);
						$response->JSON = json_encode($image);						
					}				
				}else{
					//New blank image record
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
						$newImage = Image::Create($userSession->user,$valid->adventureID);
						$response->JSON = json_encode($newImage);
					}
				}
				break;
			case 'PUT':
				$input = json_decode(file_get_contents('php://input'));
				$validation = new Validation();
				$validation->prime($input, ['ID','adventureID','centerX','centerY','scale']);
				$validation->addVariable('ID',$input->ID,'uint',true);
				$validation->addVariable('adventureID',$input->adventureID,'uint',true);
				$validation->addVariable('centerX',$input->centerX,'percent',true,10);
				$validation->addVariable('centerY',$input->centerY,'percent',true,10);
				$validation->addVariable('scale',$input->scale,'decimal',true,10);
				$validation->validate();
				if($validation->result['error'] == 1){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$valid = (object)$validation->result['validated'];
					$image = new Image($userSession->user,$valid->ID);
					$image->Update($valid->centerX, $valid->centerY, $valid->scale);
				}
				break;
			case 'GET':			
				$input = (object)$_GET;
				if(!isset($input->ID) || !is_numeric($input->ID)){
					throw new Exception("Invalid ID.");
				}
				$image = new Image($userSession->user,$input->ID);
				$response->JSON = json_encode($image);				
				break;
			case 'DELETE':
				$deleteID = substr($_SERVER['PATH_INFO'],1);
				if(!is_numeric($deleteID)){
					$response->JSON = '{"errorMsg":"'.$validation->result['errorMsg'].'","errorFields":'.json_encode($validation->result['errorFields']).'}';
					$response->error = 1;
				}else{
					$image = new Image($userSession->user,$deleteID);
					$image->Delete();
					$response->JSON = '{"ID":'.$deleteID.'}';
				}
				break;
		}
	} catch (Exception $e) {	
		if($imageUpdateResponse){
			$response->JSON = '<textarea data-type="application/json" data-status="500">{"errorMsg":"'.$e->getMessage().'", "errorFields":"imageFile"}</textarea>';
		}else{
			$response->JSON = '{"errorMsg":"'.$e->getMessage().'","errorFields":[]}';
		}
		$response->error = 1;
	}

	$response->send();
?>