Adventure.LayerView = Marionette.LayoutView.extend({
	template: 'Layer',
	regions: {layerView:'.layer-view'},
	className: 'layer',
	onRender: function(){
		this.showChildView('layerView', this.model.get('view'));
		this.$el.find(".layer-view").css("top",($("body").scrollTop()+40+30*this.model.get("id"))+"px");
		//console.log(this.model.get('view'));
	}
});
Adventure.MainView = Marionette.CollectionView.extend({
	childView: Adventure.LayerView,	
	el: '#main',	
	collection: new Backbone.Collection(),
	//overlayTemplate: Marionette.TemplateCache.get("Layer"),
	layerCollection: [],
	viewLevel: 0,	
	initialize: function() {
		//console.log(this.collection.length);
		//this.childView = Adventure.LayerView;
		//this.collection.add({id: this.collection.length});
		//console.log(this.childView);
		//this.collection.add({id: 0, view: new Adventure.AdventureList({collection: Adventure.Menu})});
		this.renderAdventureList();
		this.render();
	},
	onRender: function(){
		//console.log(this.collection.length);
	},
	renderAdventureList: function(){		
		this.addLayer(new Adventure.AdventureList({collection: Adventure.Menu}));
	},
	renderAdventureEdit: function(adventureModel){
		Adventure.activeAdventure = adventureModel;
		this.addLayer(new Adventure.AdventureEdit({model: adventureModel}));
	},
	renderPageEdit: function(pageModel){
		this.addLayer(new Adventure.PageEdit({model: pageModel}));
	},
	renderSceneSelection: function(sceneCollection){
		this.addLayer(new Adventure.SceneSelection({collection: sceneCollection}));
	},
	renderSceneEdit: function(sceneModel){
		this.addLayer(new Adventure.SceneEdit({model: sceneModel}));
	},
	renderSceneEventEdit: function(sceneEventModel){
		this.addLayer(new Adventure.SceneEventEdit({model: sceneEventModel}));
	},
	renderFlagSelection: function(flagCollection){
		this.addLayer(new Adventure.FlagSelection({collection: flagCollection}));
	},
	renderFlagEdit: function(flagModel){
		this.addLayer(new Adventure.FlagEdit({model: flagModel}));
	},
	renderEffectSelection: function(effectCollection){
		this.addLayer(new Adventure.EffectSelection({collection: effectCollection}));
	},
	renderEffectEdit: function(effectModel){
		this.addLayer(new Adventure.EffectEdit({model: effectModel}));
	},
	renderImageSelection: function(imageCollection){
		this.addLayer(new Adventure.ImageSelection({collection: imageCollection}));
	},
	renderImageEdit: function(imageModel){
		this.addLayer(new Adventure.ImageEdit({model: imageModel}));
	},
	addLayer: function(view){
		//this.viewLevel++;
		//this.$el.append(this.overlayTemplate({id: this.viewLevel}));
		//$("#view-"+this.viewLevel).css("top",($("body").scrollTop()+70*this.viewLevel)+"px");
		this.collection.push({id: this.collection.length+1, view: view});
		//this.collection.add({view: this.collection.length});
	},
	removeLayer: function(){
		//this.$el.find(".layer:last-child").remove();
		this.collection.pop();
		//this.viewLevel--;
		if(this.collection.length == 0){
			Adventure.activeAdventure = null;
		}
	}
});


Adventure.AdventureView = Marionette.ItemView.extend({
	initialize: function() {
		this.id = "adventure-"+this.model.get("hashKey");
		//this.template = _.template((this.model.id == 'x') ? Adventure.Templates.AdventureCreate : Adventure.Templates.Adventure);	
		this.template = (this.model.id == 'x') ? 'AdventureCreate' : 'Adventure';	
		//this.model.on('change', this.reRender);
		//this.model.on('remove', this.unRender);
	},
	/*
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	*/
	onRender: function(){
		//console.log(this.$el);
		//console.log(this.$el.find("#CreateAdventureForm").length);
		if(this.model.id == 'x'){
			this.createAdventureSetup();
		}else{
			this.clickAdventureSetup();
		}
	},
	/*
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
	*/
	createAdventureSetup: function() {
		var el = this.$el;
		el.addClass('adventure-edit');
		el.find("#CreateAdventureForm").hide();
		el.find("#CreateAdventureButton").click(function(){
			el.find("#CreateAdventureButton").hide();
			el.find("#CreateAdventureForm").slideDown();
			return false;
		});
		el.find("#CreateAdventureForm button.create").click(function(){
			event.preventDefault();
			var validation = validate("#CreateAdventureForm",[
				{name:"title",required:true,type:"string",maxLength:100},
				{name:"description",required:true,type:"string",maxLength:500}
			]);
			if (validation.error){
				el.find("#CreateAdventureForm .errorRow").html("<ul>"+validation.errorMsg+"</ul>");
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
		this.$el.addClass('adventure-select clickable');
		this.$el.click(function(){
			Adventure.Main.renderAdventureEdit(adventureModel);
			//$(this).slideUp();
		});
	}
});
Adventure.AdventureList = Marionette.CollectionView.extend({
	childView: Adventure.AdventureView,
	className: 'adventure-list',
	initialize: function() {
		//this.id = "adventure-list";
		//this.render();
		//this.collection.on('add', this.append);
	}/*,
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
	*/
});
Adventure.AdventureEdit = Marionette.LayoutView.extend({
	template: 'AdventureEdit',
	className: 'adventure-edit',
	regions: {pageList:'.page-select .selections'},
	formMap: function() {
		return {
			title: this.$el.find('form [name="title"]').val(),
			description: this.$el.find('form [name="description"]').val()
		};
	},
	onRender: function() {
		var viewHandle = this;
		this.$el.find(".saveClose").click(function(){			
			event.preventDefault();
			if (viewHandle.model.save(viewHandle.formMap())){
				viewHandle.$el.addClass("removing");
				setTimeout(function(){
					Adventure.MainView.activeAdventure = null;
					Adventure.Main.removeLayer();			
					viewHandle.remove();
				}, 495);
			}
			return false;
		});
		this.showChildView('pageList', new Adventure.PageList({collection: this.model.get("pages")}));
		this.$el.find(".page-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderPageEdit(viewHandle.model.get("pages").add({id:0}));
			return false;
		});
		this.$el.find(".scene-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderSceneSelection(viewHandle.model.get('scenes'));
			return false;
		});
		this.$el.find(".image-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderImageSelection(viewHandle.model.get('images'));
			return false;
		});
		this.$el.find(".flag-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderFlagSelection(viewHandle.model.get('flags'));
			return false;
		});
		this.$el.find(".effect-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderEffectSelection(viewHandle.model.get('effects'));
			return false;
		});
	}
});

//==========================================================================

Adventure.SceneButton = Marionette.ItemView.extend({
	template: 'SceneButton',
	className: 'selection',
	initialize: function() {
		//this.id = "scene-"+this.model.attributes.id;
		//this.model.on('change', this.render, this);
		//this.model.on('remove', this.remove);
		//console.log(this.model);
	},
	/*
	render: function() {
		console.log(this.model.attributes);
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	*/
	onRender: function() {
		var sceneModel = this.model;
		this.$el.click(function(){
			Adventure.Main.renderSceneEdit(sceneModel);
		});
	}
});
Adventure.SceneList = Marionette.CollectionView.extend({
	childView: Adventure.SceneButton,
	initialize: function() {
		console.log(this);
		//this.render();
		this.collection.on('add', this.append);
	}/*,
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
	}*/
});
Adventure.SceneSelection = Marionette.LayoutView.extend({	
	template: 'SceneSelection',
	className: 'scene-selection',
	regions: {selectionView:'.selections'},
	initialize: function() {	
		//this.render();
	},
	/*
	render: function() {
		this.$el.html(this.template);
		this.buttonSetup();
		return this;
	},
	*/
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.SceneList({collection: this.collection}));
		this.$el.find(".new-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderSceneEdit(viewHandle.collection.add({id:0}));
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});
Adventure.SceneEdit = Marionette.LayoutView.extend({	
	template: 'SceneEdit',
	className: 'scene-edit',
	regions: {selectionView:'.selections'},
	initialize: function() {		
		//this.render();		
		//this.SceneEventList = new Adventure.SceneEventList({collection: this.model.get('sceneEvents'), el: this.$el.selector+" .selections"});		
	},
	/*
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		this.buttonSetup();
		return this;
	},
	*/
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.SceneEventList({collection: this.model.get('sceneEvents')}));
		if (this.model.get("name") == ""){
			this.$el.find(".save-button").hide();				
		}else{
			this.$el.find(".create-button").hide();
			this.$el.find(".close-button").hide();	
		}
		
		this.$el.find(".new-event-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderSceneEventEdit(viewHandle.model.get('sceneEvents').add({id:0}));					
			return false;
		});
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			console.log(viewHandle.$el);
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
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
Adventure.PageOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	onRender: function() {
		this.$el.val(this.model.get("id"));
	}
});
Adventure.PageSelect = Marionette.CollectionView.extend({	
	tagName: 'select',
	childView: Adventure.PageOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('pages');
	},
	onRender: function(){
		var pageSelectView = this;
		this.$el.attr("name","pageID");
		this.$el.prepend("<option value=''>Select Page</option>");
		if(this.getOption("selected") != ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});
Adventure.PageEdit = Marionette.LayoutView.extend({	
	template: 'PageEdit',
	className: 'page-edit',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		if (this.model.get("name") == ""){
			this.$el.find(".save-button").hide();				
		}else{
			this.$el.find(".create-button").hide();
			this.$el.find(".close-button").hide();	
		}
		this.$el.find(".image-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'));
			return false;
		});
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});
Adventure.PageButton = Marionette.ItemView.extend({
	template: 'PageButton',
	className: 'selection',
	onRender: function() {
		var pageModel = this.model;
		this.$el.click(function(){
			Adventure.Main.renderPageEdit(pageModel);
		});
	}
});
Adventure.PageList = Marionette.CollectionView.extend({
	childView: Adventure.PageButton,
});

//=====================================================================

Adventure.ImageModel = Backbone.Model.extend({
	defaults: {
		URL: '',
		width: 0,
		height: 0	
	},
	url: 'services/image.php'
});
Adventure.Images = Backbone.Collection.extend({
	model: Adventure.ImageModel
});
Adventure.ImageButton = Marionette.ItemView.extend({
	template: 'ImageButton',
	className: 'selection',
	onRender: function() {
		var imageModel = this.model;
		this.$el.click(function(){
			Adventure.Main.renderImageEdit(imageModel);
		});
	}
});
Adventure.ImageList = Marionette.CollectionView.extend({
	childView: Adventure.ImageButton,
});
Adventure.ImageSelection = Marionette.LayoutView.extend({	
	template: 'ImageSelection',
	className: 'image-selection',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.ImageList({collection: this.collection}));
		this.$el.find(".new-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderImageEdit(viewHandle.collection.add({id:0}));
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});
Adventure.ImageEdit = Marionette.LayoutView.extend({	
	template: 'ImageEdit',
	className: 'image-edit',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		if (this.model.get("id") == 0){
			this.$el.find(".save-button").hide();				
		}else{
			this.$el.find(".create-button").hide();
			this.$el.find(".close-button").hide();	
		}
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			console.log(viewHandle.$el);
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});

Adventure.EffectModel = Backbone.Model.extend({
	defaults: {
		name: '',
		script: '',	
	},
	url: 'services/effect.php'
});
Adventure.Effects = Backbone.Collection.extend({
	model: Adventure.EffectModel
});
Adventure.EffectOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	onRender: function() {
		this.$el.val(this.model.get("id"));
	}
});
Adventure.EffectSelect = Marionette.CollectionView.extend({	
	tagName: 'select',
	childView: Adventure.EffectOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('effects');
	},
	onRender: function(){
		var effectSelectView = this;
		this.$el.attr("name","effectID");
		this.$el.prepend("<option value=''>Select Effect</option>");
		this.$el.append("<option value='new'>New Effect...</option>");
		this.$el.change(function(){
			if($(this).val() == 'new'){				
				Adventure.Main.renderEffectEdit(effectSelectView.collection.add({id:0}));
			}
		});
		if(this.getOption("selected") != ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});
Adventure.EffectEdit = Marionette.LayoutView.extend({	
	template: 'EffectEdit',
	className: 'effect-edit',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		if (this.model.get("name") == ""){
			this.$el.find(".save-button").hide();				
		}else{
			this.$el.find(".create-button").hide();
			this.$el.find(".close-button").hide();	
		}
		this.$el.find(".image-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'));
			return false;
		});
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});
Adventure.EffectButton = Marionette.ItemView.extend({
	template: 'EffectButton',
	className: 'selection',
	onRender: function() {
		var effectModel = this.model;
		this.$el.click(function(){
			Adventure.Main.renderEffectEdit(effectModel);
		});
	}
});
Adventure.EffectList = Marionette.CollectionView.extend({
	childView: Adventure.EffectButton,
});
Adventure.EffectSelection = Marionette.LayoutView.extend({	
	template: 'EffectSelection',
	className: 'effect-selection',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.EffectList({collection: this.collection}));
		this.$el.find(".new-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderEffectEdit(viewHandle.collection.add({id:0}));
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
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
		counterMaximum: null,
		counterWraps: 0
	},
	url: 'services/flag.php'
});
Adventure.Flags = Backbone.Collection.extend({
	model: Adventure.FlagModel
});
Adventure.FlagOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	onRender: function() {
		this.$el.val(this.model.get("id"));
	}
});
Adventure.FlagSelect = Marionette.CollectionView.extend({	
	tagName: 'select',
	childView: Adventure.FlagOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('flags');
	},
	onRender: function(){
		var flagSelectView = this;
		this.$el.attr("name","flagID");
		this.$el.prepend("<option value=''>Select Flag</option>");
		this.$el.append("<option value='new'>New Flag...</option>");
		this.$el.change(function(){
			if($(this).val() == 'new'){				
				Adventure.Main.renderFlagEdit(flagSelectView.collection.add({id:0}));
			}
		});
		if(this.getOption("selected") != ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});
Adventure.FlagEdit = Marionette.LayoutView.extend({	
	template: 'FlagEdit',
	className: 'flag-edit',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		if (this.model.get("name") == ""){
			this.$el.find(".save-button").hide();				
		}else{
			this.$el.find(".create-button").hide();
			this.$el.find(".close-button").hide();	
		}
		this.$el.find(".image-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'));
			return false;
		});
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});
Adventure.FlagButton = Marionette.ItemView.extend({
	template: 'FlagButton',
	className: 'selection',
	onRender: function() {
		var flagModel = this.model;
		this.$el.click(function(){
			Adventure.Main.renderFlagEdit(flagModel);
		});
	}
});
Adventure.FlagList = Marionette.CollectionView.extend({
	childView: Adventure.FlagButton,
});
Adventure.FlagSelection = Marionette.LayoutView.extend({	
	template: 'FlagSelection',
	className: 'flag-selection',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.FlagList({collection: this.collection}));
		this.$el.find(".new-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderFlagEdit(viewHandle.collection.add({id:0}));
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
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
		pageID: 0,
		counterValue: null,
		counterUpperValue: null,
		conditionID: 0,
		conditionFlagID: 0
	},
	url: 'services/event.php'
});
Adventure.Events = Backbone.Collection.extend({
	model: Adventure.EventModel
});
Adventure.EventSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	initialize: function() {
		//console.log("Cheep");
		//this.render();
	},
	onRender: function() {
		//var sceneModel = this.model;
		//this.$el.html(this.model.get("name"));
		this.$el.val(this.model.get("id"));
		this.$el.find(".selection").click(function(){
			//Adventure.Main.renderSceneEventEdit(sceneModel);
		});
	}
});
Adventure.EventSelect = Marionette.CollectionView.extend({	
	tagName: 'select',	
	childView: Adventure.EventSelection,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('events');
		//this.render();
	},
	onRender: function(){
		var eventSelectView = this;
		this.$el.attr("name","eventID");
		this.$el.prepend("<option value=''>Select Event</option>");
		this.$el.append("<option value='new'>New Event...</option>");
		this.$el.change(function(){
			switch($(this).val()){
				case '': 
					break;
				case 'new': 
					eventSelectView.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: eventSelectView.collection.add({id:0})}));
					break;
				default:
					eventSelectView.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: eventSelectView.collection.get($(this).val())}));
			}
		});
	}
});
Adventure.EventEdit = Marionette.LayoutView.extend({
	template: 'EventEdit',
	regions: {eventTypeSelect:'.eventtype-selectbox',flagSelect:'.flag-selectbox',pageSelect:'.page-selectbox',conditionSelect:'.condition-selectbox',conditionFlagSelect:'.condition-flag-selectbox'},
	onRender: function() {
		console.log(this.model);
		this.showChildView('eventTypeSelect', new Adventure.EventTypeSelect({selected: this.model.get("eventTypeID")}));
		this.showChildView('flagSelect', new Adventure.FlagSelect({selected: this.model.get("flagID")}));
		this.showChildView('pageSelect', new Adventure.PageSelect({selected: this.model.get("pageID")}));
		this.showChildView('conditionSelect', new Adventure.ConditionSelect({selected: this.model.get("conditionID")}));
		this.showChildView('conditionFlagSelect', new Adventure.FlagSelect({selected: this.model.get("conditionFlagID")}));
	}
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
Adventure.SceneEventButton = Marionette.ItemView.extend({
	template: 'EventButton',
	className: 'selection',
	initialize: function() {
		//this.model.on('change', this.render, this);
		//this.model.on('remove', this.remove);
		//console.log(this.model);
		//this.render();
	},
	/*
	render: function() {
		console.log(this.model.attributes);
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	*/
	onRender: function() {
		var sceneModel = this.model;
		this.$el.click(function(){
			Adventure.Main.renderSceneEventEdit(sceneModel);	
		});
	}
});
Adventure.SceneEventList = Marionette.CollectionView.extend({
	childView: Adventure.SceneEventButton,
	initialize: function() {
		//this.render();
		//this.collection.on('add', this.append);
	}
	/*
	render: function() {
		this.$el.html('');
		this.collection.each(this.addScene, this);
		return this;
	},
	append: function() {
		this.collection.each(this.addScene, this);
		return this;
	},
	onRender: function(sceneModel){
		var view = new Adventure.SceneButton({model: sceneModel});
		this.$el.append(view.render().el);
		view.clickSceneEventSetup();
	}
	*/
});
Adventure.SceneEventEdit = Marionette.LayoutView.extend({	
	template: 'EventLink',
	className: 'scene-edit',
	regions: {eventSelect:'.event-selectbox',eventEdit:'.event-form'},
	initialize: function() {		
		//this.render();		
	},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('eventSelect', new Adventure.EventSelect({parentView: this}));
		if(this.model.get("eventID") > 0){
			this.showChildView('eventEdit',new Adventure.EventEdit({model: Adventure.activeAdventure.get('events').get(this.model.get("eventID"))}));
		}
		if (this.model.get("name") == ""){
			this.$el.find(".save-button").hide();				
		}else{
			this.$el.find(".create-button").hide();
			this.$el.find(".close-button").hide();	
		}
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
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

/*
TODO: USE THESE TO IMPORT DATA
*/
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

Adventure.TransitionModel = Backbone.Model.extend({
	defaults:{
		name: ''
	},
	url: 'services/transition.php'
});
Adventure.Transitions = Backbone.Collection.extend({
	model: Adventure.TransitionModel
});

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


//TODO: Replace these with dynamic versions later
Adventure.pageTypes = new Adventure.PageTypes([
	{id: 1, name: 'Normal', style: 'normal'},
	{id: 2, name: 'Checkpoint', style: 'checkpoint'},
	{id: 3, name: 'Death', style: 'death'},
	{id: 4, name: 'Bad Ending', style: 'badEnding'},
	{id: 5, name: 'Good Ending', style: 'goodEnding'}
]);

Adventure.transitions = new Adventure.Transitions([
	{id: 1, name: 'None'},
	{id: 2, name: 'Fade'},
	{id: 3, name: 'Dip to Black'},
	{id: 4, name: 'Dip to White'},
	{id: 5, name: 'Pan Left'},
	{id: 6, name: 'Pan Right'},
	{id: 7, name: 'Pan Up'},
	{id: 8, name: 'Pan Down'}
]);

Adventure.conditions = new Adventure.Conditions([
	{id: 1, name: 'Always Trigger', involvesCounter: 0, involvesRange: 0},
	{id: 2, name: 'Flag Active', involvesCounter: 0, involvesRange: 0},
	{id: 3, name: 'Flag Inactive', involvesCounter: 0, involvesRange: 0},
	{id: 4, name: 'Counter Equals', involvesCounter: 1, involvesRange: 0},
	{id: 5, name: 'Counter Less Than', involvesCounter: 1, involvesRange: 0},
	{id: 6, name: 'Counter Less Than or Equals', involvesCounter: 1, involvesRange: 0},
	{id: 7, name: 'Counter Greater Than', involvesCounter: 1, involvesRange: 0},
	{id: 8, name: 'Counter Greater Than or Equals', involvesCounter: 1, involvesRange: 0},
	{id: 9, name: 'Counter Within Range', involvesCounter: 1, involvesRange: 1},
	{id: 10, name: 'Counter Out of Range', involvesCounter: 1, involvesRange: 1},
	{id: 11, name: 'Random Chance %', involvesCounter: 1, involvesRange: 0}
]);
Adventure.ConditionSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	onRender: function() {
		this.$el.val(this.model.get("id"));
	}
});
Adventure.ConditionSelect = Marionette.CollectionView.extend({	
	tagName: 'select',
	collection: Adventure.conditions,
	childView: Adventure.ConditionSelection,
	onRender: function(){
		console.log(this.getOption("selected"));
		var eventSelectView = this;
		this.$el.attr("name","conditionID");
		if(this.getOption("selected") != ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});

Adventure.eventTypes = new Adventure.EventTypes([
	{id: 1, name: 'Display Text'},
	{id: 2, name: 'Set Flag'},
	{id: 3, name: 'Remove Flag'},
	{id: 4, name: 'Set Counter'},
	{id: 5, name: 'Increment Counter'},
	{id: 6, name: 'Jump to Page'}
]);
Adventure.EventTypeSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	onRender: function() {
		this.$el.val(this.model.get("id"));
	}
});
Adventure.EventTypeSelect = Marionette.CollectionView.extend({	
	tagName: 'select',
	collection: Adventure.eventTypes,
	childView: Adventure.EventTypeSelection,
	onRender: function(){
		console.log(this.getOption("selected"));
		var eventSelectView = this;
		this.$el.attr("name","eventTypeID");
		if(this.getOption("selected") != ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});
