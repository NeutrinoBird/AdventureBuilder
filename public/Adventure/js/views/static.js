Adventure.PageTypeSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	onRender: function() {
		this.$el.val(this.model.get("ID"));
	}
});
Adventure.PageTypeSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.PageTypeSelection,
	initialize: function(){
		this.collection = Adventure.pageTypes;
	},
	onRender: function(){
		this.$el.attr("name","pageTypeID");
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});

Adventure.TransitionSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	onRender: function() {
		this.$el.val(this.model.get("ID"));
	}
});
Adventure.TransitionSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.TransitionSelection,
	initialize: function(){
		this.collection = Adventure.transitions;
	},
	onRender: function(){
		this.$el.attr("name","transitionID");
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});

Adventure.ConditionSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	initialize: function() {
		this.$el.val(this.model.get("ID"));
	}
});
Adventure.ConditionSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.ConditionSelection,
	initialize: function(options){
		this.collection = Adventure.conditions;
		this.$el.attr("name","conditionID");
	},
	onRender: function(){
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
		}
	},
	events: {
		'change': function(event){
			if(this.getOption('onChange')){
				this.getOption('onChange')();
			}
		}
	}
});

Adventure.EventTypeSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	onRender: function() {
		this.$el.val(this.model.get("ID"));
	}
});
Adventure.EventTypeSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.EventTypeSelection,
	initialize: function(options){
		this.collection = Adventure.eventTypes;
		this.$el.attr("name","eventTypeID");
	},
	onRender: function(){
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
		}
	},
	events: {
		'change': function(event){
			if(this.getOption('onChange')){
				this.getOption('onChange')();
			}
		}
	}
});

Adventure.ActionTypeSelection = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	onRender: function() {
		this.$el.val(this.model.get("ID"));
	}
});
Adventure.ActionTypeSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.ActionTypeSelection,
	initialize: function(options){
		this.collection = Adventure.actionTypes;
		this.$el.attr("name","actionTypeID");
	},
	onRender: function(){
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
		}
	},
	events: {
		'change': function(action){
			if(this.getOption('onChange')){
				this.getOption('onChange')();
			}
		}
	}
});