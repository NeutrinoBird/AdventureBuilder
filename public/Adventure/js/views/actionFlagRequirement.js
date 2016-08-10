Adventure.ActionFlagRequirementEdit = Marionette.LayoutView.extend({	
	template: 'ActionFlagRequirementEdit',
	className: 'requirement-edit',
	regions: {flagSelect:'.flag-selectbox',conditionSelect:'.condition-selectbox'},
	initialize: function(){
		var viewHandle = this;
		this.hideFields = function(){
			var condition = Adventure.conditions.get(viewHandle.$el.find("[name='conditionID']").val());
			viewHandle.$el.find(".flagID-group").toggle(condition.get("involvesFlag") == 1);
			viewHandle.$el.find(".counterValue-group").toggle(condition.get("involvesCounter") == 1);
			viewHandle.$el.find(".counterUpperValue-group").toggle(condition.get("involvesRange") == 1);
		}
	},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.showChildView('flagSelect', new Adventure.FlagSelect({selected: this.model.get("flagID")}));
		this.showChildView('conditionSelect', new Adventure.ConditionSelect({selected: this.model.get("conditionID"), onChange: this.hideFields}));
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));				
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"requirement");
			return false;
		});
		this.hideFields();
	}
});
Adventure.ActionFlagRequirementButton = Marionette.ItemView.extend({
	template: 'ActionFlagRequirementButton',
	className: 'selection',
	initialize: function() {
		var actionFlagRequirementModel = this.model;
		this.$el.click(function(){
			Adventure.Main.renderActionFlagRequirementEdit(actionFlagRequirementModel);
		});
		this.listenTo(this.model, 'change:name', this.render);
		this.model.updateName();
	}
});
Adventure.ActionFlagRequirementList = Marionette.CollectionView.extend({
	childView: Adventure.ActionFlagRequirementButton,
});