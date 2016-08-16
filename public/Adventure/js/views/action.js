Adventure.ActionEdit = Marionette.LayoutView.extend({
	template: 'ActionEdit',
	className: 'action-edit',
	regions: {pageSelect:'.page-selectbox',effectSelect:'.effect-selectbox',transitionSelect:'.transition-selectbox',requirementSelection:'.requirement-select .selections',eventSelection:'.event-select .selections'},
	ui: {
		'newRequirementButton': '.new-requirement-button',
		'newEventButton': '.new-event-button',
		'saveButton': '.save-button',
		'deleteButton': '.delete-button'
	},
	onRender: function() {
		this.model.form = this.$el.find("form");
		this.showChildView('pageSelect', new Adventure.PageSelect({name: "nextPageID", selected: this.model.get("nextPageID")}));
		this.showChildView('effectSelect', new Adventure.EffectSelect({selected: this.model.get("effectID")}));
		this.showChildView('transitionSelect', new Adventure.TransitionSelect({selected: this.model.get("transitionID")}));
		this.showChildView('requirementSelection', new Adventure.ActionFlagRequirementList({collection: this.model.get('actionFlagRequirements')}));
		this.showChildView('eventSelection', new Adventure.EventLinkList({collection: this.model.get('actionEvents')}));
	},
	events: {
		'click @ui.newRequirementButton': function(event){
			event.preventDefault();
			this.model.get("actionFlagRequirements").create({actionID:this.model.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderActionFlagRequirementEdit(model);
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		},
		'click @ui.newEventButton': function(event){
			event.preventDefault();
			this.model.get("actionEvents").create({actionID:this.model.id},{wait: true, validate: false,
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
			Adventure.deleteDialog(this,"action");
			return false;
		}
	}
});
Adventure.ActionButton = Marionette.ItemView.extend({
	template: 'ActionButton',
	className: 'selection',
	ui: {
		'pageJump': '.page-jump',
		'actionButton': '.action-button'
	},
	onRender: function(){
		if(this.getOption("pageView") && Adventure.activeAdventure.get("pages").get(this.model.get("nextPageID"))){
			this.getOption("pageView").$el.find(".header-key").show();
		}else{
			this.$el.find('.page-jump').hide();
		}
	},
	events: {
		'click @ui.pageJump': function(event){
			event.preventDefault();
			if(this.getOption("pageView") && Adventure.activeAdventure.get("pages").get(this.model.get("nextPageID"))){
				this.getOption("pageView").jumpToPage(this.model.get("nextPageID"));
			}
			return false;
		},
		'click @ui.actionButton': function(event){
			event.preventDefault();
			Adventure.Main.renderActionEdit(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.ActionList = Marionette.CollectionView.extend({
	childView: Adventure.ActionButton,
	initialize: function(options){
		this.childViewOptions = {
			pageView: options.pageView
		};
	}
});