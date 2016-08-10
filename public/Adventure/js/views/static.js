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
		var pageSelectView = this;
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
		var pageSelectView = this;
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
		var eventSelectView = this;
		this.collection = Adventure.conditions;
		this.$el.attr("name","conditionID");
		if(options.onChange != undefined){
			this.$el.change(options.onChange);	
		}
	},
	onRender: function(){
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
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
		var eventSelectView = this;
		this.collection = Adventure.eventTypes;
		this.$el.attr("name","eventTypeID");
		if(options.onChange != undefined){
			this.$el.change(options.onChange);	
		}
	},
	onRender: function(){
		var eventSelectView = this;		
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});