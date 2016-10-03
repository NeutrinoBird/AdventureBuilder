Adventure.ActionEdit = Marionette.LayoutView.extend({
	template: 'ActionEdit',
	className: 'action-edit',
	regions: {
		actionTypeSelect:'.actionType-selectbox',
		pageSelect:'.page-selectbox',
		effectSelect:'.effect-selectbox',
		transitionSelect:'.transition-selectbox',
		requirementSelection:'.requirement-select .selections',
		eventSelection:'.event-select .selections'},
	ui: {
		newRequirementButton: '.new-requirement-button',
		newEventButton: '.new-event-button',
		saveButton: '.save-button',
		deleteButton: '.delete-button'
	},
	initialize: function(){
		var viewHandle = this;
		this.hideTextField = function(){
			var actionType = Adventure.actionTypes.get(viewHandle.$el.find("[name='actionTypeID']").val());
			viewHandle.$el.find(".text-group").toggle(actionType.get("requiresText") == 1);
			if (actionType.get("requiresText") == 1 && viewHandle.$el.find("[name='text']").val() =='(arrow)'){
				viewHandle.$el.find("[name='text']").val('');
			}else if(actionType.get("requiresText") == 0){
				viewHandle.$el.find("[name='text']").val('(arrow)');
			}
		}
	},
	onRender: function() {
		Adventure.setupTooltips(this);
		this.model.form = this.$el.find("form");
		this.showChildView('actionTypeSelect', new Adventure.ActionTypeSelect({selected: this.model.get("actionTypeID"), onChange: this.hideTextField}));
		this.showChildView('pageSelect', new Adventure.PageSelectPlus({name: "nextPageID", selected: this.model.get("nextPageID")}));
		this.showChildView('effectSelect', new Adventure.EffectSelectPlus({selected: this.model.get("effectID")}));
		this.showChildView('transitionSelect', new Adventure.TransitionSelect({selected: this.model.get("transitionID")}));
		this.showChildView('requirementSelection', new Adventure.ActionFlagRequirementList({collection: this.model.get('actionFlagRequirements')}));
		this.showChildView('eventSelection', new Adventure.EventLinkList({collection: this.model.get('actionEvents')}));
		this.hideTextField();
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
		pageJump: '.page-jump',
		actionButton: '.action-button'
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
	viewComparator: function(model){
		return int(model.get('priority'));
	},
	initialize: function(options){
		this.childViewOptions = {
			pageView: options.pageView
		};
	},
	collectionEvents: {
		"sync": "render"
	}
});