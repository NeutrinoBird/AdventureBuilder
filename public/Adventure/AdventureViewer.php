<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Adventure Viewer</title>
		<script type="text/javascript">
			function debugImage(){
				alert($("#adventure > style").html());
				alert($(".image-manager .page-"+Adventure.viewer.side+" img").attr('style'));
			}
		</script>
	</head>
	<body style="margin:0px;">
		<div style="width:100%; min-width:400px;">
			<script type="text/javascript" src="js/viewer.min.js.php" data-adventure="<?php if(isset($_GET['adventure'])){ echo $_GET['adventure']; } ?>"></script>
		</div>
		<div style="position: fixed; left: 0px; bottom: 0px; background-color: white; z-index:10000000" onclick="debugImage();">Debug</div>
	</body>
</html>