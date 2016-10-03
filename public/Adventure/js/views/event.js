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
	filter: function (child, index, collection) {
		return child.get("isActive") == 1;
	},
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('events');
	},
	onRender: function(){
		this.$el.attr("name","eventID");
		this.$el.prepend("<option value='0'>Select Event</option>");
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
			if(!this.$el.find(":selected").length){
				this.$el.val(0);
			}else if(this.getOption("selected") != 0){
				this.$el.find('[value="0"]').remove();
			}
		}
	},
	events: {
		'change': function(event){
			var viewHandle = this;
			if(this.$el.val() != ''){
				this.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: this.collection.get(this.$el.val())}));
			}
		}
	}
});
Adventure.EventSelectPlus = Marionette.LayoutView.extend({
	template: 'SelectWithNewButton',
	className: 'select-plus',
	regions: {
		selectContainer:'.select-container'
	},
	ui: {
		newButton: 'button'
	},
	initialize: function(options){
		this.selectBox = new Adventure.EventSelect(this.options);
		this.selectBox.$el.removeClass("form-control");
	},
	onRender: function(){
		this.showChildView('selectContainer', this.selectBox);
	},
	events: {
		'click @ui.newButton': function(event){
			event.preventDefault();
			var eventSelectView = this;
			Adventure.activeAdventure.get('events').create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
				success:function(model){
					eventSelectView.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: model}));
					eventSelectView.selectBox.$el.val(model.id);
					eventSelectView.options.selected = model.id;
					eventSelectView.selectBox.options.selected = model.id;
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		}
	}
});
Adventure.EventEdit = Marionette.LayoutView.extend({
	template: 'EventEdit',
	regions: {
		eventTypeSelect:'.eventtype-selectbox',
		flagSelect:'.flag-selectbox',
		pageSelect:'.page-selectbox',
		requirementSelection:'.requirement-select .selections'
	},
	ui: {
		newRequirementButton: '.new-requirement-button'
	},
	initialize: function(){
		var viewHandle = this;
		this.hideEventTypeFields = function(){
			var eventType = Adventure.eventTypes.get(viewHandle.$el.find("[name='eventTypeID']").val());
			viewHandle.$el.find(".flag-group").toggle(eventType.get("involvesFlag") == 1);
			viewHandle.$el.find(".value-group").toggle(eventType.get("involvesValue") == 1);
			viewHandle.$el.find(".page-group").toggle(eventType.get("involvesPage") == 1);
		}
	},
	onRender: function() {
		Adventure.setupTooltips(this);
		this.model.form = this.$el;
		this.showChildView('eventTypeSelect', new Adventure.EventTypeSelect({selected: this.model.get("eventTypeID"), onChange: this.hideEventTypeFields}));
		this.showChildView('flagSelect', new Adventure.FlagSelectPlus({selected: this.model.get("flagID")}));
		this.showChildView('pageSelect', new Adventure.PageSelectPlus({selected: this.model.get("pageID")}));
		this.showChildView('requirementSelection', new Adventure.EventFlagRequirementList({collection: this.model.get('eventFlagRequirements')}));
		this.hideEventTypeFields();
	},
	events: {
		'click @ui.newRequirementButton': function(event){
			event.preventDefault();
			this.model.get("eventFlagRequirements").create({eventID:this.model.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderEventFlagRequirementEdit(model);
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		}
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
		"sync": "render",
		"change destroy": function(){
			Adventure.activeAdventure.get("events").cleanup();
		}
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
		Adventure.setupTooltips(this);
		this.model.form = this.$el.find(".event-link");
		this.showChildView('eventSelect', new Adventure.EventSelectPlus({selected: this.model.get("eventID"),parentView: this}));
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