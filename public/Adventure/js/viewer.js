// @koala-prepend "lib/jquery.iframe-transport.js"
// @koala-prepend "lib/json2.js"
// @koala-prepend "lib/underscore-min.js"
// @koala-prepend "lib/backbone-min.js"
// @koala-prepend "lib/backbone.babysitter.js"
// @koala-prepend "lib/backbone.wreqr.js"
// @koala-prepend "lib/backbone.marionette.min.js"
// koala-prepend "lib/bootstrap.min.js"
// @koala-prepend "validation.js"
// @koala-prepend "adventure.js"
// @koala-prepend "models/main.js"
// @koala-prepend "models/adventure.js"
// @koala-prepend "models/page.js"
// @koala-prepend "models/action.js"
// @koala-prepend "models/actionFlagRequirement.js"
// @koala-prepend "models/scene.js"
// @koala-prepend "models/flag.js"
// @koala-prepend "models/image.js"
// @koala-prepend "models/effect.js"
// @koala-prepend "models/event.js"
// @koala-prepend "models/static.js"
// @koala-prepend "views/viewer.js"

console.log("?");
//$.getScript(assetPath+'templates/viewer.js');
$(function(){
assetPath = '/Adventure/';
Adventure.viewer = new Adventure.Viewer();
});