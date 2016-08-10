<?php
	class ValidationVariable{
		private $name;
		private $value;
		private $type;
		private $required;
		private $maxLength;

		function __construct($name, $value, $type="uint", $required=false, $maxLength=0){
			$this->name = $name;
			$this->value = $value;
			$this->type = $type;
			$this->required = $required;
			$this->maxLength = $maxLength;
		}

		function validate(){
			$output = [
				'fieldName' => $this->name,
				'validated' => null,
				'errorMsg' => ''				
			];
			if ($this->required && (is_null($this->value) || $this->value === "")){
				$output['errorMsg'] .= "<li>".$this->name." is required.</li>";
			}else{
				switch($this->type){
					case "uint":
						if (!is_numeric($this->value) && $this->value != ""){
							$output['errorMsg'] .= "<li>".$this->name." is invalid.</li>";						
						}elseif(is_numeric($this->value)){
							if ($this->value > 4294967295){
								$output['errorMsg'] .= "<li>".$this->name." is too large.</li>";
							}elseif($this->value < 0){
								$output['errorMsg'] .= "<li>".$this->name." is too low.</li>";
							}else{
								$output['validated']= (int)$this->value;
							}
						}
						break;
					case "int":
						if (!is_numeric($this->value) && $this->value != ""){
							$output['errorMsg'] .= "<li>".$this->name." is invalid.</li>";
						}elseif (is_numeric($this->value)){
							if ($this->value > 2147483647){
								$output['errorMsg'] .= "<li>".$this->name." is too large.</li>";
							}elseif($this->value < -2147483648){
								$output['errorMsg'] .= "<li>".$this->name." is too low.</li>";
							}else{
								$output['validated']= (int)$this->value;
							}
						}
						break;
					case "tinyint":
						if (!is_numeric($this->value) && $this->value != ""){
							$output['errorMsg'] .= "<li>".$this->name." is invalid.</li>";
						}elseif(is_numeric($this->value)){
							if ($this->value > 255){
								$output['errorMsg'] .= "<li>".$this->name." is too large.</li>";
							}elseif($this->value < 0){
								$output['errorMsg'] .= "<li>".$this->name." is too low.</li>";
							}else{
								$output['validated']= (int)$this->value;
							}
						}
						break;
					case "bit":
						if ($this->value != 0 && $this->value != 1){
							$output['errorMsg'] .= "<li>".$this->name." is invalid.</li>";
						}else{
							$output['validated']= (int)$this->value;
						}
						break;
					case "string":
						if (strlen($this->value) > $this->maxLength){
							$output['errorMsg'] .= "<li>".$this->name." must be ".$this->maxLength." characters or less. It is currently ".strlen($this->value)." characters long.</li>";
						}else{
							$output['validated']= $this->value;
						}
						break;
					case "percent":
						if (strlen($this->value) > $this->maxLength){
							$output['errorMsg'] .= "<li>".$this->name." must be ".$this->maxLength." characters or less. It is currently ".strlen($this->value)." characters long.</li>";
						}elseif(!preg_match('/^[0-9]+(\.[0-9]+)?%$/',$this->value)){
							$output['errorMsg'] .= "<li>".$this->name." is an invalid percentage.</li>";
						}else{
							$output['validated']= $this->value;
						}
						break;
					case "decimal":
						if (strlen($this->value) > $this->maxLength){
							$output['errorMsg'] .= "<li>".$this->name." must be ".$this->maxLength." characters or less. It is currently ".strlen($this->value)." characters long.</li>";
						}elseif(!preg_match('/^[0-9]+(\.[0-9]+)?$/',$this->value)){
							$output['errorMsg'] .= "<li>".$this->name." is an invalid decimal.</li>";
						}else{
							$output['validated']= $this->value;
						}
						break;
				}
			}
			return $output;
		}
	}
?>