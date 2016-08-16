Adventure.ActionFlagRequirementEdit = Marionette.LayoutView.extend({
	template: 'ActionFlagRequirementEdit',
	className: 'requirement-edit',
	regions: {flagSelect:'.flag-selectbox',conditionSelect:'.condition-selectbox'},
	ui: {
		'saveButton': '.save-button',
		'deleteButton': '.delete-button'
	},
	initialize: function(){
		viewHandle = this;
		this.hideFields = function(){
			var condition = Adventure.conditions.get(viewHandle.$el.find("[name='conditionID']").val());
			viewHandle.$el.find(".flagID-group").toggle(condition.get("involvesFlag") == 1);
			viewHandle.$el.find(".counterValue-group").toggle(condition.get("involvesCounter") == 1);
			viewHandle.$el.find(".counterUpperValue-group").toggle(condition.get("involvesRange") == 1);
		};
	},
	onRender: function() {
		this.model.form = this.$el.find("form");
		this.showChildView('flagSelect', new Adventure.FlagSelect({selected: this.model.get("flagID")}));
		this.showChildView('conditionSelect', new Adventure.ConditionSelect({selected: this.model.get("conditionID"), onChange: this.hideFields}));
		this.hideFields();
	},
	events: {
		'click @ui.saveButton': function(event){
			event.preventDefault();
			this.model.save(Adventure.generateFormMap(this.$el.find("form")),Adventure.saveResponseHandlers(this));
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"requirement");
			return false;
		}
	}
});
Adventure.ActionFlagRequirementButton = Marionette.ItemView.extend({
	template: 'ActionFlagRequirementButton',
	className: 'selection',
	initialize: function() {
		this.model.updateName();
	},
	events: {
		'click': function(event){
			event.preventDefault();
			Adventure.Main.renderActionFlagRequirementEdit(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.ActionFlagRequirementList = Marionette.CollectionView.extend({
	childView: Adventure.ActionFlagRequirementButton,
});