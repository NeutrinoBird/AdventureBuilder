Adventure.ActionModel = Backbone.Model.extend({
	defaults: {
		priority: 1,
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
		this.set('actionFlagRequirements', new Adventure.ActionFlagRequirements(this.get('actionFlagRequirements')));
		this.set('actionEvents', new Adventure.ActionEvents(this.get('actionEvents')));
		this.form = this.attributes;
		this.handleBlankName();
		this.on('sync', this.handleBlankName);
	},
	parse: function(response) {
		var collections = ['actionFlagRequirements','actionEvents'];
		for(i=0;i<collections.length;i++){
			if (response[collections[i]] != undefined){
				this.get(collections[i]).add(response[collections[i]]);
				delete response[collections[i]];
			}
		}
		return response;
	},
	handleBlankName: function(){
		if(!this.get('text')){
			this.set('text','(New action #'+this.id+')');
		}
	},
	urlRoot: 'services/action.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"priority",required:true,type:"tinyint"},
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