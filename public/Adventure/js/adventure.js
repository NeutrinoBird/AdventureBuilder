var Adventure = new Marionette.Application();
Adventure.Templates = {};
Adventure.assetPath = (typeof Adventure.assetPath !== 'undefined') ? Adventure.assetPath : '';
Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
	return Adventure.Templates[templateId];
}
/*
Marionette.TemplateCache.prototype.compileTemplate  = function(rawTemplate, options){
	console.log(rawTemplate);
	return _.template(rawTemplate, options);
}
*/
Adventure.addCSSSupport = function(CSSstring){
	keyframes = CSSstring.replace(/transform: ([^;]+);/g,'transform: $1; -webkit-transform: $1; -ms-transform: $1;');
	keyframes = keyframes.replace(/filter: ([^;]+);/g,'filter: $1; -webkit-filter: $1; -moz-filter: $1;');
	return keyframes;
};
function int(value){
	return parseInt(value) || 0;
}