<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Adventure Builder</title>
		<!-- <link href="css/lib/bootstrap.min.css" rel="stylesheet"> -->
		<link href="css/AdventureBuilder.css" rel="stylesheet">
		<script type="text/javascript" src="js/lib/jquery-1.12.4.min.js"></script>
		<script type="text/javascript" src="js/lib/jquery.iframe-transport.js"></script>
		<script type="text/javascript" src="js/lib/json2.js"></script>
		<script type="text/javascript" src="js/lib/underscore-min.js"></script>
		<script type="text/javascript" src="js/lib/backbone-min.js"></script>
		<script type="text/javascript" src="js/lib/backbone.babysitter.js"></script>
		<script type="text/javascript" src="js/lib/backbone.wreqr.js"></script>
		<script type="text/javascript" src="js/lib/backbone.marionette.min.js"></script>
		<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/validation.js"></script>
		<script type="text/javascript" src="js/adventure.js"></script>
		<script type="text/javascript" src="js/builder.js"></script>
		<?php
			$components = ['main','adventure','page','action','actionFlagRequirement','scene','flag','image','effect','event','static'];
			foreach($components as $component){
				echo '<script type="text/javascript" src="js/models/'.$component.'.js"></script>';
			}
			foreach($components as $component){
				echo '<script type="text/javascript" src="js/templates/'.$component.'.js"></script>';
			}
			foreach($components as $component){
				echo '<script type="text/javascript" src="js/views/'.$component.'.js"></script>';
			}
		?>
		<script type="text/javascript">
			$(function(){
				Adventure.assetPath = '<?php echo preg_replace('/[^\/]+$/','',$_SERVER['PHP_SELF']); ?>';
			});
		</script>
	</head>
	<body>
		<h1>Adventure Builder</h1>
		<div class="container-fluid">
			<div id="main" class="row"></div>
		</div>
		<div class="status-icon"></div>
		<div id="options-menu"></div>
	</body>
</html>