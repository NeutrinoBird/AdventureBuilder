<?php
	class Response{
		public $JSON;
		public $error;

		function __construct(){
			$this->JSON = '{}';
			$this->error = 0;
		}

		public function send(){
			if($this->error == 0){
				header($_SERVER['SERVER_PROTOCOL']." 200 OK", FALSE, 200); 
			}else{
				header($_SERVER['SERVER_PROTOCOL']." 500 Internal Server Error", FALSE, 500);
			}
			exit($this->JSON);
		}
	}
	$response = new Response();
?>