Adventure.ActionModel = Backbone.Model.extend({
	defaults: {
		actionTypeID: 1,
		text: '',
		nextPageID: 0,
		effectID: 0,
		transitionID: 1,
		actionFlagRequirements: [],
		actionEvents: []
	},
	idAttribute: "ID",
	initialize: function() {
		this.initSubItems();
		this.form = this.attributes;
		this.handleBlankName();
		this.on('sync', this.handleBlankName);
	},
	initSubItems: function(){
		if(Array.isArray(this.get('actionFlagRequirements'))){
			this.set('actionFlagRequirements', new Adventure.ActionFlagRequirements(this.get('actionFlagRequirements')));
		}
		if(Array.isArray(this.get('actionEvents'))){
			this.set('actionEvents', new Adventure.ActionEvents(this.get('actionEvents')));
		}
	},
	handleBlankName: function(){
		if(!this.get('text')){
			this.set('text','(New action #'+this.id+')');
		}
	},
	urlRoot: 'services/action.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"actionTypeID",required:true,type:"tinyint"},
			{name:"text",required:true,type:"string",maxLength:500},
			{name:"nextPageID",required:true,type:"uint"},
			{name:"effectID",required:false,type:"uint"},
			{name:"transitionID",required:true,type:"tinyint"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.Actions = Backbone.Collection.extend({
	model: Adventure.ActionModel
});