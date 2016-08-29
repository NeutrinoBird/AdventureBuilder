<?php
	//include_once('Adventure\CheckSession.php');
	include_once('Adventure\Models\PageType.php');
	include_once('Adventure\Models\Transition.php');
	include_once('Adventure\Models\Condition.php');
	include_once('Adventure\Models\EventType.php');
	include_once('Adventure\Models\ActionType.php');
	$returnJSON = "";
	$error = 0;

	try{
		$pageTypes = PageType::GetPageTypes();
		$transitions = Transition::GetTransitions();
		$conditions = Condition::GetConditions();
		$eventTypes = EventType::GetEventTypes();
		$actionTypes = ActionType::GetActionTypes();
		$returnJSON = '{"pageTypes":'.json_encode($pageTypes).',"transitions":'.json_encode($transitions).',"conditions":'.json_encode($conditions).',"eventTypes":'.json_encode($eventTypes).',"actionTypes":'.json_encode($actionTypes).'}';
	} catch (Exception $e) {
		$returnJSON = '{"errorMsg":"'.$e->getMessage().'","errorFields":[]}';
		$error = 1;
	}

	if($error == 0){
		header($_SERVER['SERVER_PROTOCOL']." 200 OK", FALSE, 200);
	}else{
		header($_SERVER['SERVER_PROTOCOL']." 500 Internal Server Error", FALSE, 500);
	}

	echo $returnJSON;
?>