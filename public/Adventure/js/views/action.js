Adventure.ActionEdit = Marionette.LayoutView.extend({	
	template: 'ActionEdit',
	className: 'action-edit',
	regions: {pageSelect:'.page-selectbox',effectSelect:'.effect-selectbox',transitionSelect:'.transition-selectbox',requirementSelection:'.requirement-select .selections',eventSelection:'.event-select .selections'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.showChildView('pageSelect', new Adventure.PageSelect({name: "nextPageID", selected: this.model.get("nextPageID")}));
		this.showChildView('effectSelect', new Adventure.EffectSelect({selected: this.model.get("effectID")}));
		this.showChildView('transitionSelect', new Adventure.TransitionSelect({selected: this.model.get("transitionID")}));
		this.showChildView('requirementSelection', new Adventure.ActionFlagRequirementList({collection: this.model.get('actionFlagRequirements')}));
		this.showChildView('eventSelection', new Adventure.ActionEventList({collection: this.model.get('actionEvents')}));
		this.$el.find(".new-requirement-button").click(function(){			
			event.preventDefault();
			viewHandle.model.get("actionFlagRequirements").create({actionID:viewHandle.model.id},{wait: true, validate: false, 
				success:function(model){
					Adventure.Main.renderActionFlagRequirementEdit(model);
				}
			});						
			return false;
		});
		this.$el.find(".new-event-button").click(function(){			
			event.preventDefault();
			viewHandle.model.get("actionEvents").create({actionID:viewHandle.model.id},{wait: true, validate: false, 
				success:function(model){
					Adventure.Main.renderActionEventEdit(model);
				}
			});				
			return false;
		});
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));	
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"action");
			return false;
		});
	}
});
Adventure.ActionButton = Marionette.ItemView.extend({
	template: 'ActionButton',
	className: 'selection',
	initialize: function() {
		var actionModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		this.$el.click(function(){			
			Adventure.Main.renderActionEdit(actionModel);
		});
	}
});
Adventure.ActionList = Marionette.CollectionView.extend({
	childView: Adventure.ActionButton
});