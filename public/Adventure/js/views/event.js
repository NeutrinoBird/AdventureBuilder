Adventure.EventOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	initialize: function() {
		this.$el.val(this.model.id);
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.EventSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.EventOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('events');
	},
	onRender: function(){
		this.$el.attr("name","eventID");
		this.$el.prepend("<option value='0'>Select Event</option>");
		this.$el.append("<option value='new'>New Event...</option>");
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
			if(!this.$el.find(":selected").length){
				this.$el.val(0);
			}
		}
	},
	events: {
		'change': function(event){
			var viewHandle = this;
			switch(this.$el.val()){
				case '':
					break;
				case 'new':
					this.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
						success:function(model){
							viewHandle.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: model}));
							viewHandle.$el.val(model.id);
							viewHandle.options.selected = model.id;
						},
						error: function(model, response, options){
							Adventure.handleInvalidInput(response.responseJSON);
						}
					});
					break;
				default:
					this.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: this.collection.get(this.$el.val())}));
			}
		}
	}
});
Adventure.EventEdit = Marionette.LayoutView.extend({
	template: 'EventEdit',
	regions: {eventTypeSelect:'.eventtype-selectbox',flagSelect:'.flag-selectbox',pageSelect:'.page-selectbox',conditionSelect:'.condition-selectbox',conditionFlagSelect:'.condition-flag-selectbox'},
	initialize: function(){
		var viewHandle = this;
		this.hideEventTypeFields = function(){
			var eventType = Adventure.eventTypes.get(viewHandle.$el.find("[name='eventTypeID']").val());
			viewHandle.$el.find(".flag-group").toggle(eventType.get("involvesFlag") == 1);
			viewHandle.$el.find(".value-group").toggle(eventType.get("involvesValue") == 1);
			viewHandle.$el.find(".page-group").toggle(eventType.get("involvesPage") == 1);
		}
		this.hideConditionFields = function(){
			var condition = Adventure.conditions.get(viewHandle.$el.find("[name='conditionID']").val());
			viewHandle.$el.find(".condition-group").toggle(condition.ID != 1);
			viewHandle.$el.find(".condition-flag-group").toggle(condition.get("involvesFlag") == 1);
			viewHandle.$el.find(".counterValue-group").toggle(condition.get("involvesCounter") == 1);
			viewHandle.$el.find(".counterUpperValue-group").toggle(condition.get("involvesRange") == 1);
		}
	},
	onRender: function() {
		this.model.form = this.$el;
		this.showChildView('eventTypeSelect', new Adventure.EventTypeSelect({selected: this.model.get("eventTypeID"), onChange: this.hideEventTypeFields}));
		this.showChildView('flagSelect', new Adventure.FlagSelect({selected: this.model.get("flagID")}));
		this.showChildView('pageSelect', new Adventure.PageSelect({selected: this.model.get("pageID")}));
		this.showChildView('conditionSelect', new Adventure.ConditionSelect({selected: this.model.get("conditionID"), onChange: this.hideConditionFields}));
		this.showChildView('conditionFlagSelect', new Adventure.FlagSelect({selected: this.model.get("conditionFlagID"), name: 'conditionFlagID'}));
		this.hideEventTypeFields();
		this.hideConditionFields();
	}
});


Adventure.EventLinkButton = Marionette.ItemView.extend({
	template: 'EventButton',
	className: 'selection',
	initialize: function() {
		this.model.updateName();
	},
	events: {
		'click': function(event){
			event.preventDefault();
			Adventure.Main.renderEventLinkEdit(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.EventLinkList = Marionette.CollectionView.extend({
	childView: Adventure.EventLinkButton,
	viewComparator: function(model){
		return int(model.get('priority'));
	},
	collectionEvents: {
		"sync": "render"
	}
});
Adventure.EventLinkEdit = Marionette.LayoutView.extend({
	template: 'EventLink',
	className: 'event-edit',
	ui: {
		saveButton: '.save-button',
		deleteButton: '.delete-button'
	},
	regions: {eventSelect:'.event-selectbox',eventEdit:'.event-form'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find(".event-link");
		this.showChildView('eventSelect', new Adventure.EventSelect({selected: this.model.get("eventID"),parentView: this}));
		if(this.model.get("eventID") > 0){
			this.showChildView('eventEdit',new Adventure.EventEdit({model: Adventure.activeAdventure.get('events').get(this.model.get("eventID"))}));
		}
	},
	events: {
		'click @ui.saveButton': function(event){
			event.preventDefault();
			var viewHandle = this;
			if (this.$el.find("[name='eventID']").val() == 0){
				Adventure.handleInvalidInput({errorMsg:'Please choose or create an event.', errorFields:['eventID']});
			}else{
				Adventure.activeAdventure.get('events').get(this.$el.find("[name='eventID']").val()).save(Adventure.generateFormMap(this.$el.find(".event-form")),
					Adventure.saveEventResponseHandlers(this,function(){
						viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find(".event-link")),Adventure.saveResponseHandlers(viewHandle));
					})
				);
			}
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"event");
			return false;
		}
	}
});