Adventure.AdventureModel = Backbone.Model.extend({
	defaults: {
		hashKey : '',
		title : '',
		description : '',
		author : '',
		imageID : '',
		imageURL : '',
		imageX : '50%',
		imageY : '50%',
		imageScale : '1',
		published : 0
	},
	idAttribute: "ID",
	initialize: function() {
		var thisAdventure = this;
		this.set('events', new Adventure.Events());
		this.set('scenes', new Adventure.Scenes());
		this.set('images', new Adventure.Images());
		this.set('effects', new Adventure.Effects());
		this.set('pages', new Adventure.Pages());
		this.set('flags', new Adventure.Flags());
		this.set('unassignedScene', new Adventure.SceneModel({ID: 0, name:'Unassigned'}))
		this.form = this.attributes;
	},
	urlRoot: 'services/adventure.php',
	parse: function(response) {
		var collections = ['pages','flags','events','scenes','images','effects'];
		//Fun fact: for-of refuses to compile
		for(i=0;i<collections.length;i++){
			if (response[collections[i]] != undefined){
				this.get(collections[i]).add(response[collections[i]]);
				delete response[collections[i]];
			}
		}
		return response;
	},
	validate: function(){
		var validation = validate(this.form,[
			{name:"title",required:true,type:"string",maxLength:100},
			{name:"description",required:true,type:"string",maxLength:500}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.Adventures = Backbone.Collection.extend({
	model: Adventure.AdventureModel,
	url: 'services/adventures.php'
});

Adventure.AdventureViewingModel = Backbone.Model.extend({
	defaults: {
		hashKey : '',
		title : '',
		description : '',
		imageID : 0,
		published : 0,
		events: [],
		scenes: [],
		images: [],
		effects: [],
		pages: [],
		flags: []
	},
	idAttribute: "ID",
	initialize: function() {
		var modelHandle = this;
		Adventure.activeAdventure = this;
		this.urlRoot = Adventure.assetPath + this.urlRoot;
		this.fetch({
			wait:true,
			data:{
				hashKey: this.get('hashKey')
			},
			success: function(){
				modelHandle.set('scenes', new Adventure.Scenes(modelHandle.get('scenes')));
				modelHandle.set('images', new Adventure.Images(modelHandle.get('images')));
				modelHandle.set('effects', new Adventure.Effects(modelHandle.get('effects')));
				modelHandle.set('pages', new Adventure.Pages(modelHandle.get('pages')));
				modelHandle.set('flags', new Adventure.Flags(modelHandle.get('flags')));
				modelHandle.set('events', new Adventure.Events(modelHandle.get('events')));
			},
			error: function(){
				alert("An error occurred while loading the adventure.");
			}
		});
	},
	urlRoot: 'services/loadAdventure.php'
});