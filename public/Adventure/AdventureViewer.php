<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Adventure Viewer</title>
		<!-- <link href="css/lib/bootstrap.min.css" rel="stylesheet"> -->
		<link href="css/AdventureViewer.css" rel="stylesheet">

		<script type="text/javascript" src="js/lib/jquery-1.12.4.min.js"></script>
		<!--<script type="text/javascript" src="js/lib/jquery.iframe-transport.js"></script>-->
		<!--<script type="text/javascript" src="js/lib/json2.js"></script>-->
		<script type="text/javascript" src="js/lib/underscore-min.js"></script>
		<script type="text/javascript" src="js/lib/backbone-min.js"></script>
		<!--<script type="text/javascript" src="js/lib/backbone.babysitter.js"></script>-->
		<!--<script type="text/javascript" src="js/lib/backbone.wreqr.js"></script>-->
		<script type="text/javascript" src="js/lib/backbone.marionette.min.js"></script>
		<!--<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>-->
		<script type="text/javascript" src="js/validation.js"></script>
		<script type="text/javascript" src="js/adventure.js"></script>

		<!--<script type="text/javascript" src="viewer.js.php"></script>-->
		<!--<script type="text/javascript" src="js/viewer.min.js"></script>	-->
		<?php
			 $components = ['main','adventure','page','action','actionFlagRequirement','scene','flag','image','effect','event','static'];
			 foreach($components as $component){
			 	echo '<script type="text/javascript" src="js/models/'.$component.'.js"></script>';
			 }
		?>
		<script type="text/javascript" src="js/templates/viewer.js"></script>
		<script type="text/javascript" src="js/views/viewer.js"></script>
		<script type="text/javascript">
			$(function(){
				Adventure.viewer = new Adventure.Viewer();
			});
		</script>
	</head>
	<body>
		<div id="adventure" data-adventure="<?php if(isset($_GET['adventure'])){ echo $_GET['adventure']; } ?>"></div>
	</body>
</html>