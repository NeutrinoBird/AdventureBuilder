<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Adventure Viewer</title>
	</head>
	<body>
		<script type="text/javascript" src="js/viewer.min.js.php" data-adventure="<?php if(isset($_GET['adventure'])){ echo $_GET['adventure']; } ?>"></script>
	</body>
</html>