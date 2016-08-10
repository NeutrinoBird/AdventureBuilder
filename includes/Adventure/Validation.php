<?php
	include_once('Adventure\ValidationVariable.php');

	class Validation{
		private $validationVariables;
		public $result;

		function __construct(){
			$this->validationVariables = []; 
			$this->result = [
				'validated' => [],
				'error' => 0,
				'errorMsg' => '',
				'errorFields' => []
			];
		}

		function prime($input, $variableArray){
			foreach($variableArray as $var){
				if (!isset($input->$var)){
					$input->$var = null;
				}
			}
		}

		function addVariable($name, $value, $type="uint", $required=false, $maxLength=0){
			array_push($this->validationVariables, new ValidationVariable($name, $value, $type, $required, $maxLength));
		}

		function validate(){
			foreach($this->validationVariables as $validationVariable){
				$validationResult = $validationVariable->validate();
				if ($validationResult['errorMsg'] != ''){
					array_push($this->result['errorFields'],$validationResult['fieldName']);
					$this->result['errorMsg'] .= $validationResult['errorMsg'];
					$this->result['error'] = 1;
				}else{
					$this->result['validated'][$validationResult['fieldName']] = $validationResult['validated'];
				}
			}			
		}
	}
?>