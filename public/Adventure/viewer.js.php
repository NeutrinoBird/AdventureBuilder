//TODO: Generate relative file path, and add jQuery getScripts
$(function(){
	var assetPath = '<?php echo preg_replace('/[^\/]+$/','',$_SERVER['PHP_SELF']); ?>';
	$.getScript( assetPath+'js/viewer.min.js' ).done(function( script, textStatus ) {
		console.log( textStatus );
	}).fail(function( jqxhr, settings, exception ) {
		console.log(exception);
	});
});