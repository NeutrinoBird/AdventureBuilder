Adventure.PageModel = Backbone.Model.extend({
	defaults: {
		name : '',
		text : '',
		sceneID : 0,
		pageTypeID : 1,
		imageID : 0,
		effectID : 0,
		actions: [],
		pageEvents: []
	},
	idAttribute: "ID",
	initialize: function() {
		this.initSubItems();
		this.form = this.attributes;
	},
	initSubItems: function(){
		if(Array.isArray(this.get('actions'))){
			this.set('actions', new Adventure.Actions(this.get('actions')));
		}
		if(Array.isArray(this.get('pageEvents'))){
			this.set('pageEvents', new Adventure.PageEvents(this.get('pageEvents')));
		}	
	},
	urlRoot: 'services/page.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"name",required:true,type:"string",maxLength:50},
			{name:"text",required:true,type:"string",maxLength:2000},
			{name:"sceneID",required:true,type:"uint"},
			{name:"pageTypeID",required:true,type:"tinyint"},
			{name:"imageID",required:false,type:"uint"},
			{name:"effectID",required:false,type:"uint"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.Pages = Backbone.Collection.extend({
	model: Adventure.PageModel
});