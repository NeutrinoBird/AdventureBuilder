Adventure.SceneOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	initialize: function() {
		this.$el.val(this.model.get("ID"));
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.SceneSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.SceneOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('scenes');
		//this.listenTo(Adventure.activeAdventure.get("pages"), 'change', this.render);
		this.filterSelection = '';
		if(this.getOption("filterBase") != undefined && this.getOption("filterElement") != undefined){
			this.$el.addClass("scene-filter");
			this.$el.prepend("<option value=''>Show All</option><option value='0'>Unassigned</option>");
		}else{
			this.$el.attr("name","sceneID");
		}
	},
	onRender: function(){
		if(this.getOption("filterBase") != undefined && this.getOption("filterElement") != undefined){
			this.$el.val(this.filterSelection);
			this.$el.change();
		}else{
			this.$el.find("[value='0']").remove();
			this.$el.prepend("<option value='0'>Select Scene</option>");
			if(this.getOption("selected") !== ""){
				this.$el.val(this.getOption("selected"));
				if(!this.$el.find(":selected").length){
					this.$el.val(0);
				}
			}
		}
	},
	events: {
		'change': function(event){
			var viewHandle = this;
			if(this.getOption("filterBase") != undefined && this.getOption("filterElement") != undefined){
				var filterElements = this.getOption("filterBase").find(this.getOption("filterElement"));
				this.filterSelection = this.$el.val();
				if(this.$el.val() === ''){
					filterElements.show();
					filterElements.filter("[data-length='0']").hide();
				}else{
					filterElements.hide();
					filterElements.filter("[data-scene='"+this.$el.val()+"']").show();
				}
			}
		}
	},
	collectionEvents: {
		'change': 'render'
	}
});
Adventure.SceneSelectPlus = Marionette.LayoutView.extend({
	template: 'SelectWithNewButton',
	className: 'select-plus',
	regions: {
		selectContainer:'.select-container'
	},
	ui: {
		newButton: 'button'
	},
	initialize: function(options){
		this.selectBox = new Adventure.SceneSelect(this.options);
		this.selectBox.$el.removeClass("form-control");
	},
	onRender: function(){
		this.showChildView('selectContainer', this.selectBox);
	},
	events: {
		'click @ui.newButton': function(event){
			event.preventDefault();
			var sceneSelectView = this;
			Adventure.activeAdventure.get('scenes').create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
				success:function(model){
					model.buildPageCollection();
					Adventure.Main.renderSceneEdit(model);
					sceneSelectView.selectBox.$el.val(model.id);
					sceneSelectView.options.selected = model.id;
					sceneSelectView.selectBox.options.selected = model.id;
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		}
	}
});
Adventure.SceneButton = Marionette.ItemView.extend({
	template: 'SceneButton',
	className: 'selection',
	events: {
		'click': function(event){
			event.preventDefault();
			Adventure.Main.renderSceneEdit(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.SceneList = Marionette.CollectionView.extend({
	childView: Adventure.SceneButton
});
Adventure.SceneSelection = Marionette.LayoutView.extend({
	template: 'SceneSelection',
	className: 'scene-selection',
	regions: {selectionView:'.selections'},
	ui: {
		newButton: '.new-button',
		closeButton: '.close-button'
	},
	onRender: function() {
		this.showChildView('selectionView', new Adventure.SceneList({collection: this.collection}));
	},
	events: {
		'click @ui.newButton': function(event){
			event.preventDefault();
			this.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
				success:function(model){
					model.buildPageCollection();
					Adventure.Main.renderSceneEdit(model);
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		},
		'click @ui.closeButton': function(event){
			event.preventDefault();
			Adventure.Main.initiateRemoval(this);
			return false;
		}
	}
});
Adventure.SceneEdit = Marionette.LayoutView.extend({
	template: 'SceneEdit',
	className: 'scene-edit',
	regions: {actionSelection:'.action-select .selections',eventSelection:'.event-select .selections'},
	ui: {
		nameField: '[name="name"]',
		newActionButton: '.new-action-button',
		newEventButton: '.new-event-button',
		saveButton: '.save-button',
		deleteButton: '.delete-button'
	},
	onRender: function() {
		Adventure.setupTooltips(this);
		this.model.form = this.$el.find("form");
		this.showChildView('actionSelection', new Adventure.ActionList({collection: this.model.get('actions')}));
		this.showChildView('eventSelection', new Adventure.EventLinkList({collection: this.model.get('sceneEvents')}));
	},
	events: {
		'change @ui.nameField': function(event){
			this.model.set("name", event.target.value);
			this.model.handleBlankName();
		},
		'click @ui.newActionButton': function(event){
			event.preventDefault();
			this.model.get("actions").create({sceneID:this.model.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderActionEdit(model);
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		},
		'click @ui.newEventButton': function(event){
			event.preventDefault();
			this.model.get('sceneEvents').create({sceneID:this.model.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderEventLinkEdit(model);
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		},
		'click @ui.saveButton': function(event){
			event.preventDefault();
			this.model.save(Adventure.generateFormMap(this.$el.find("form")),Adventure.saveResponseHandlers(this));
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"scene");
			return false;
		}
	}
});
Adventure.ScenePages = Marionette.LayoutView.extend({
	template: 'ScenePages',
	className: 'scene-pages',
	regions: {selections:'.selections'},
	initialize: function(){
		this.$el.attr("data-scene",this.model.id);
		this.listenTo(this.model.get('pages'),'add change',this.render);
	},
	onRender: function(){
		this.$el.attr("data-length",this.model.get('pages').length);
		this.showChildView('selections', new Adventure.PageList({collection: this.model.get('pages')}));
		this.$el.find(".emptySet").toggle(this.model.get('pages').length == 0);
		Adventure.activeAdventure.trigger('filterRequest');
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.ScenePageSet = Marionette.CollectionView.extend({
	childView: Adventure.ScenePages
});