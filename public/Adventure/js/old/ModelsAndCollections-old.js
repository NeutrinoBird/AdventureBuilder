var Adventure = Adventure || {};
Adventure.ViewStack = [];
Adventure.ViewLevel = 0;
Adventure.defaultImageURL = 'img/builder/icons/image.png';

Adventure.MainView = Backbone.View.extend({
	el: '#main',
	overlayTemplate: _.template(Adventure.Templates.Overlay),
	activeAdventure: null,
	initialize: function() {		
		this.renderAdventureList();
	},
	renderAdventureList: function(){		
		this.addLayer();	
		this.AdventureList = new Adventure.AdventureList({collection: Adventure.Menu, el: "#view-"+Adventure.ViewLevel});		
	},
	renderAdventureEdit: function(adventureModel){
		this.activeAdventure = adventureModel;
		this.addLayer();
		this.AdventureEdit = new Adventure.AdventureEdit({model: adventureModel, el: "#view-"+Adventure.ViewLevel});
	},
	renderSceneSelection: function(sceneCollection){
		this.addLayer();
		this.AdventureEdit = new Adventure.SceneSelection({collection: sceneCollection, el: "#view-"+Adventure.ViewLevel});
	},
	renderSceneEdit: function(sceneModel){
		this.addLayer();
		this.AdventureEdit = new Adventure.SceneEdit({model: sceneModel, el: "#view-"+Adventure.ViewLevel});
	},
	addLayer: function(){
		$(Adventure.ViewStack[0]).addClass("outOfFocus"); 
		Adventure.ViewLevel++;
		Adventure.ViewStack.unshift("#layer-"+Adventure.ViewLevel);	
		this.$el.append(this.overlayTemplate({id: Adventure.ViewLevel}));
		$("#view-"+Adventure.ViewLevel).css("top",($("body").scrollTop()+70*Adventure.ViewLevel)+"px");	
	},
	removeOverlay: function(){
		$(Adventure.ViewStack.shift()).remove();
		Adventure.ViewLevel--;
		$(Adventure.ViewStack[0]).removeClass("outOfFocus");
	}
});

Adventure.AdventureModel = Backbone.Model.extend({
	defaults: {
		hashKey : '',
		title : '',
		description : '',
		author : '',
		imageURL : Adventure.defaultImageURL,
		published : 0
	},
	initialize: function() {
		this.set('scenes', new Adventure.Scenes);
		//this.scenes.on('add', this.setAdventureID);
		this.set('images', new Adventure.Images);
		//this.images.on('add', this.setAdventureID);
		this.set('effects', new Adventure.Effects);
		//this.effects.on('add', this.setAdventureID);
		this.set('pages', new Adventure.Pages);
		//this.pages.on('add', this.setAdventureID);
		this.set('flags', new Adventure.Flags);
		//this.flags.on('add', this.setAdventureID);
		this.set('events', new Adventure.Events);
		//this.events.on('add', this.setAdventureID);
		this.on('add:scenes add:images add:effects add:pages add:flags add:events', this.setAdventureID)
	},
	url: 'services/adventure.php',
	validate: function(){
		var validation = validate(this.attributes,[
			{name:"title",required:true,type:"string",maxLength:100},
			{name:"description",required:true,type:"string",maxLength:500}
		]);
		if (validation.error){
			$(".adventure-edit .errorRow").html("<ul>"+validation.errorMsg+"</ul>");
			return validation;
		}
	},
	setAdventureID: function(model){
		model.set("adventureID",this.id);
	}
});
Adventure.Adventures = Backbone.Collection.extend({
	model: Adventure.AdventureModel,
	constructor : function ( attributes, options ) {
		Backbone.Collection.apply( this, arguments );
		this.newAdventure = new Adventure.AdventureModel({
			id:'x', hashKey: 'NewAdventure', title: 'New Adventure'
		});
		this.add(this.newAdventure);
	}
});
Adventure.AdventureView = Backbone.View.extend({
	initialize: function() {
		this.id = "adventure-"+this.model.attributes.hashKey;
		this.template = _.template((this.model.id == 'x') ? Adventure.Templates.AdventureCreate : Adventure.Templates.Adventure);	
		this.model.on('change', this.reRender);
		this.model.on('remove', this.unRender);
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	reRender: function(){
		this.$el.html(this.template(this.model.attributes));
		if(this.model.id == 'x'){
			this.createAdventureSetup();
		}else{
			this.clickAdventureSetup();
		}
	},
	unRender: function() {
		$("#"+this.id).remove();
	},
	createAdventureSetup: function() {
		$("#CreateAdventureForm").hide();
		$("#CreateAdventureButton").click(function(){
			$("#CreateAdventureButton").hide();
			$("#CreateAdventureForm").slideDown();
			return false;
		});
		$("#CreateAdventureForm button.create").click(function(){
			event.preventDefault();
			var validation = validate("#CreateAdventureForm",[
				{name:"title",required:true,type:"string",maxLength:100},
				{name:"description",required:true,type:"string",maxLength:500}
			]);
			if (validation.error){
				$("#CreateAdventureForm .errorRow").html("<ul>"+validation.errorMsg+"</ul>");
			}else{
				var NewAdventure = new Adventure.AdventureModel({
					hashKey: Math.floor((Math.random() * 10000) + 10), title: validation.form.title, description: validation.form.description
					//TODO: Remove the hashKey when using AJAX
				});
				Adventure.Menu.create(NewAdventure);
				Adventure.Menu.remove('x');
				Adventure.Menu.add(Adventure.Menu.newAdventure);
			}
			return false;
		});
	},
	clickAdventureSetup: function() {
		var adventureModel = this.model;
		$("#"+this.id).click(function(){
			Adventure.Main.renderAdventureEdit(adventureModel);
			//$(this).slideUp();
		});
	}
});
Adventure.AdventureList = Backbone.View.extend({	
	initialize: function() {
		this.id = "adventure-list";
		this.render();
		this.collection.on('add', this.append);
	},
	render: function() {
		this.$el.html('');
		this.collection.each(this.addAdventure, this);
		return this;
	},
	append: function() {
		this.collection.each(this.addAdventure, this);
		return this;
	},
	addAdventure: function(adventureModel){
		if ($("#adventure-"+adventureModel.attributes.hashKey).length == 0){
			var view = new Adventure.AdventureView({model: adventureModel});
			this.$el.append(view.render().el);
			if(adventureModel.id == 'x'){
				view.createAdventureSetup();
			}else{
				view.clickAdventureSetup();
			}
		}
	}
});
Adventure.AdventureEdit = Backbone.View.extend({
	template: _.template(Adventure.Templates.AdventureEdit),
	initialize: function() {	
		this.render();
		console.log(this.model);
		//this.SceneList = new Adventure.SceneList({collection: this.model.scenes, el: this.$el.selector+" .scene-select .selections-full"});
	},
	formMap: function() {
		return {
			title: this.$el.find('form [name="title"]').val(),
			description: this.$el.find('form [name="description"]').val()
		};
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		this.buttonSetup();
		return this;
	},
	buttonSetup: function() {
		var viewHandle = this;
		$(".adventure-edit .saveClose").click(function(){			
			event.preventDefault();
			if (viewHandle.model.save(viewHandle.formMap())){
				viewHandle.$el.find(".adventure-edit").addClass("removing");
				setTimeout(function(){
					Adventure.MainView.activeAdventure = null;
					Adventure.Main.removeOverlay();			
					viewHandle.remove();
				}, 495);
			}
			return false;
		});
		$(this.$el.selector+" .scene-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderSceneSelection(viewHandle.model.get('scenes'));
			return false;
		});
	}
});

//==========================================================================

Adventure.SceneModel = Backbone.Model.extend({
	defaults: {
		name: ''
	},
	initialize: function() {		
		this.set('sceneEvents', new Adventure.SceneEvents);
		this.on('sceneEvents:add', this.setSceneID);
	},
	url: 'services/scene.php',
	setSceneID: function(model){
		model.set("sceneID",this.id);
	}
});
Adventure.Scenes = Backbone.Collection.extend({
	model: Adventure.SceneModel
});
Adventure.SceneButton = Backbone.View.extend({
	template: _.template(Adventure.Templates.SceneButton),
	initialize: function() {
		this.id = "scene-"+this.model.attributes.id;
		this.model.on('change', this.render, this);
		this.model.on('remove', this.remove);
		console.log(this.model);
	},
	render: function() {
		console.log(this.model.attributes);
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	clickSceneSetup: function() {
		var sceneModel = this.model;
		this.$el.find(".selection").click(function(){
			Adventure.Main.renderSceneEdit(sceneModel);
		});
	}
});
Adventure.SceneList = Backbone.View.extend({	
	initialize: function() {
		console.log(this);
		this.render();
		this.collection.on('add', this.append);
	},
	render: function() {
		this.$el.html('');
		this.collection.each(this.addScene, this);
		return this;
	},
	append: function() {
		this.collection.each(this.addScene, this);
		return this;
	},
	addScene: function(sceneModel){
		var view = new Adventure.SceneButton({model: sceneModel});
		this.$el.append(view.render().el);
		view.clickSceneSetup();
	}
});
Adventure.SceneSelection = Backbone.View.extend({	
	template: _.template(Adventure.Templates.SceneSelection),
	initialize: function() {	
		this.render();
		this.SceneList = new Adventure.SceneList({collection: this.collection, el: this.$el.selector+" .selections"});
	},
	render: function() {
		this.$el.html(this.template);
		this.buttonSetup();
		return this;
	},
	buttonSetup: function() {
		var viewHandle = this;
		$(this.$el.selector+" .new-button").click(function(){			
			event.preventDefault();
			var sceneModel = new Adventure.SceneModel();
			Adventure.Main.renderSceneEdit(sceneModel);
			return false;
		});
		$(this.$el.selector+" .close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.find(".scene-selection").addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeOverlay();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});
Adventure.SceneEdit = Backbone.View.extend({	
	template: _.template(Adventure.Templates.SceneEdit),
	initialize: function() {		
		this.render();		
		this.SceneEventList = new Adventure.SceneEventList({collection: this.model.get('sceneEvents'), el: this.$el.selector+" .selections"});
		if (this.model.attributes.name == ""){
			$(this.$el.selector+" .save-button").hide();				
		}else{
			$(this.$el.selector+" .create-button").hide();
			$(this.$el.selector+" .close-button").hide();	
		}
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		this.buttonSetup();
		return this;
	},
	buttonSetup: function() {
		var viewHandle = this;
		$(this.$el.selector+" .save-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.find(".scene-edit").addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeOverlay();			
				viewHandle.remove();
			}, 495);
			return false;
		});
		$(this.$el.selector+" .close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.find(".scene-edit").addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeOverlay();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});

//=====================================================================

Adventure.PageModel = Backbone.Model.extend({
	constructor: function() {
		_.bindAll(this, 'setPageID');
		this.name = '';
		this.text = '';
		this.sceneID = 0;
		this.pageTypeID = 0;
		this.imageID = null;
		this.effectID = null;
		this.pageEvents = new Adventure.PageEvents;		
		this.pageEvents.on('add', this.setPageID);
		this.actions = new Adventure.Actions;
		this.actions.on('add', this.setPageID);
		Backbone.Model.apply(this, arguments);
	},
	url: 'services/page.php',
	setPageID: function(model){
		model.set("pageID",this.id);
	}
});
Adventure.Pages = Backbone.Collection.extend({
	model: Adventure.PageModel
});

Adventure.ImageModel = Backbone.Model.extend({
	defaults: {
		width: 0,
		height: 0	
	},
	url: 'services/image.php'
});
Adventure.Images = Backbone.Collection.extend({
	model: Adventure.ImageModel
});

Adventure.EffectModel = Backbone.Model.extend({
	defaults: {
		name: null,
		script: '',	
	},
	url: 'services/effect.php'
});
Adventure.Effects = Backbone.Collection.extend({
	model: Adventure.EffectModel
});

Adventure.ActionModel = Backbone.Model.extend({
	constructor: function() {
		_.bindAll(this, 'setActionID');
		this.text = '';
		this.isSpeech = 0;		
		this.effectID = null;
		this.actionEvents = new Adventure.ActionEvents;
		this.actionEvents.on('add', this.setActionID);
		this.actionFlagRequirements = new Adventure.ActionFlagRequirements;
		this.actionFlagRequirements.on('add', this.setActionID);
		Backbone.Model.apply(this, arguments);
	},
	url: 'services/action.php',
	setActionID: function(model){
		model.set("actionID",this.id);
	}
});
Adventure.Actions = Backbone.Collection.extend({
	model: Adventure.ActionModel
});

Adventure.ActionFlagRequirementModel = Backbone.Model.extend({
	defaults:{
		flagID: 0,
		counterValue: null,
		counterUpperValue: null,
		conditionID: null
	},
	url: 'services/actionFlagRequirement.php'
});
Adventure.ActionFlagRequirements = Backbone.Collection.extend({
	model: Adventure.ActionFlagRequirementModel
});

Adventure.FlagModel = Backbone.Model.extend({
	defaults: {
		name: '',
		isItem: 0,
		imageID: null,
		isCounter: 0,
		counterDefault: null,
		counterMinimum: null,
		counterMaximum: null
	},
	url: 'services/flag.php'
});
Adventure.Flags = Backbone.Collection.extend({
	model: Adventure.FlagModel
});

/*============================
            EVENTS            
============================*/

Adventure.EventModel = Backbone.Model.extend({
	defaults: {
		eventTypeID: 0,
		flagID: null,
		value: null,
		textBefore: null,
		textAfter: null,
		pageID: null,
		counterValue: null,
		counterUpperValue: null,
		conditionID: null,
		conditionFlagID: null
	},
	url: 'services/event.php'
});
Adventure.Events = Backbone.Collection.extend({
	model: Adventure.EventModel
});

Adventure.SceneEventModel = Backbone.Model.extend({
	defaults:{
		eventID: 0,
		priority: 0,
		flagID: null
	},
	url: 'services/sceneEvent.php'
});
Adventure.SceneEvents = Backbone.Collection.extend({
	model: Adventure.SceneEventModel
});
Adventure.SceneEventButton = Backbone.View.extend({
	template: _.template(Adventure.Templates.EventButton),
	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('remove', this.remove);
		console.log(this.model);
	},
	render: function() {
		console.log(this.model.attributes);
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	clickSceneEventSetup: function() {
		var sceneModel = this.model;
		this.$el.find(".selection").click(function(){
			//Adventure.Main.renderSceneEventEdit(sceneModel);
		});
	}
});
Adventure.SceneEventList = Backbone.View.extend({	
	initialize: function() {
		this.render();
		this.collection.on('add', this.append);
	},
	render: function() {
		this.$el.html('');
		this.collection.each(this.addScene, this);
		return this;
	},
	append: function() {
		this.collection.each(this.addScene, this);
		return this;
	},
	addSceneEvent: function(sceneModel){
		var view = new Adventure.SceneButton({model: sceneModel});
		this.$el.append(view.render().el);
		view.clickSceneEventSetup();
	}
});

Adventure.PageEventModel = Backbone.Model.extend({
	defaults:{
		eventID: 0,
		priority: 0
	},
	url: 'services/pageEvent.php'
});
Adventure.PageEvents = Backbone.Collection.extend({
	model: Adventure.PageEventModel
});

Adventure.ActionEventModel = Backbone.Model.extend({
	defaults:{
		eventID: 0,
		priority: 0
	},
	url: 'services/actionEvent.php'
});
Adventure.ActionEvents = Backbone.Collection.extend({
	model: Adventure.ActionEventModel
});

/*===============================
            TYPE DATA
===============================*/

Adventure.ConditionModel = Backbone.Model.extend({
	defaults:{
		name: '',
		involvesCounter: 0,
		involvesRange: 0
	},
	url: 'services/condition.php'
});
Adventure.Conditions = Backbone.Collection.extend({
	model: Adventure.ConditionModel
});

Adventure.EventTypeModel = Backbone.Model.extend({
	defaults:{
		name: ''
	},
	url: 'services/eventType.php'
});
Adventure.EventTypes = Backbone.Collection.extend({
	model: Adventure.PageTypeModel
});

Adventure.PageTypeModel = Backbone.Model.extend({
	defaults:{
		name: '',
		style: ''
	},
	url: 'services/pageType.php'
});
Adventure.PageTypes = Backbone.Collection.extend({
	model: Adventure.PageTypeModel
});