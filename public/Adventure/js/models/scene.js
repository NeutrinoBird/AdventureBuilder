Adventure.SceneModel = Backbone.Model.extend({
	defaults: {
		name: '',
		actions: [],
		sceneEvents: []
	},
	idAttribute: "ID",
	initialize: function() {
		this.initSubItems();
		this.form = this.attributes;
		this.handleBlankName();
		this.on('sync', this.handleBlankName);
	},
	initSubItems: function(){
		if(Array.isArray(this.get('actions'))){
			this.set('actions', new Adventure.Actions(this.get('actions')));
		}
		if(Array.isArray(this.get('sceneEvents'))){
			this.set('sceneEvents', new Adventure.SceneEvents(this.get('sceneEvents')));
		}
	},
	handleBlankName: function(){
		if(!this.get('name')){
			this.set('name','(New scene #'+this.id+')');
		}
	},
	urlRoot: 'services/scene.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"name",required:true,type:"string",maxLength:50}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	},
	setSceneID: function(model){
		model.set("sceneID",this.ID);
	}
});
Adventure.Scenes = Backbone.Collection.extend({
	model: Adventure.SceneModel
});