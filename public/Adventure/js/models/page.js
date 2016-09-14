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
		this.set('actions', new Adventure.Actions(this.get('actions')));
		this.set('pageEvents', new Adventure.PageEvents(this.get('pageEvents')));
		this.form = this.attributes;
		this.handleBlankName();
		this.on('sync', this.handleBlankName);
		if(this.get('text')){
			this.set("filteredText",this.get('text').replace(/\r?\n/g,'<br>'));
		}else{
			this.set("filteredText",'');
		}
	},
	parse: function(response) {
		var collections = ['actions','pageEvents'];
		for(i=0;i<collections.length;i++){
			if (response[collections[i]] != undefined){
				this.get(collections[i]).add(response[collections[i]]);
				delete response[collections[i]];
			}
		}
		return response;
	},
	handleBlankName: function(){
		if(!this.get('name')){
			this.set('name','(New page #'+this.id+')');
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