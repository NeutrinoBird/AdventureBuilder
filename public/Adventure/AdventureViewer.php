<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Adventure Viewer</title>
	</head>
	<body style="margin:0px;">
		<div style="width:100%; min-width:400px;">
			<script type="text/javascript" src="js/viewer.min.js.php" data-adventure="<?php if(isset($_GET['adventure'])){ echo $_GET['adventure']; } ?>"></script>
		</div>
	</body>
</html>