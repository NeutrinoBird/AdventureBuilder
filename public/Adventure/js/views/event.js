Adventure.EventOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.$el.val(this.model.get("ID"));
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
		var eventSelectView = this;
		this.$el.attr("name","eventID");
		this.$el.prepend("<option value='0'>Select Event</option>");
		this.$el.append("<option value='new'>New Event...</option>");
		this.$el.change(function(){
			var selectHandle = this;
			switch($(this).val()){
				case '': 
					break;
				case 'new': 
					eventSelectView.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
						success:function(model){
							eventSelectView.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: model}));
							$(selectHandle).val(model.id);
						}
					});	
					break;
				default:
					eventSelectView.getOption("parentView").showChildView('eventEdit',new Adventure.EventEdit({model: eventSelectView.collection.get($(this).val())}));
			}
		});
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
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


Adventure.PageEventButton = Marionette.ItemView.extend({
	template: 'EventButton',
	className: 'selection',
	initialize: function() {
		var pageModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		this.$el.click(function(){
			Adventure.Main.renderPageEventEdit(pageModel);	
		});
		this.model.updateName();
	}
});
Adventure.PageEventList = Marionette.CollectionView.extend({
	childView: Adventure.PageEventButton,
});
Adventure.PageEventEdit = Marionette.LayoutView.extend({	
	template: 'EventLink',
	className: 'event-edit',
	regions: {eventSelect:'.event-selectbox',eventEdit:'.event-form'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find(".event-link");
		this.showChildView('eventSelect', new Adventure.EventSelect({selected: this.model.get("eventID"),parentView: this}));
		if(this.model.get("eventID") > 0){
			this.showChildView('eventEdit',new Adventure.EventEdit({model: Adventure.activeAdventure.get('events').get(this.model.get("eventID"))}));			
		}
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			if (viewHandle.$el.find("[name='eventID']").val() == 0){
				Adventure.handleInvalidInput({errorMsg:'Please choose or create an event.', errorFields:['eventID']});
			}else{
				Adventure.activeAdventure.get('events').get(viewHandle.$el.find("[name='eventID']").val()).save(Adventure.generateFormMap(viewHandle.$el.find(".event-form")),
					Adventure.saveEventResponseHandlers(viewHandle,function(){
						viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find(".event-link")),Adventure.saveResponseHandlers(viewHandle));
					})
				);
			}				
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"event");
			return false;
		});
	}
});


Adventure.ActionEventButton = Marionette.ItemView.extend({
	template: 'EventButton',
	className: 'selection',
	initialize: function() {
		var actionModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		this.$el.click(function(){
			Adventure.Main.renderActionEventEdit(actionModel);	
		});
		this.model.updateName();
	}
});
Adventure.ActionEventList = Marionette.CollectionView.extend({
	childView: Adventure.ActionEventButton,
});
Adventure.ActionEventEdit = Marionette.LayoutView.extend({	
	template: 'EventLink',
	className: 'event-edit',
	regions: {eventSelect:'.event-selectbox',eventEdit:'.event-form'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find(".event-link");
		this.showChildView('eventSelect', new Adventure.EventSelect({selected: this.model.get("eventID"),parentView: this}));
		if(this.model.get("eventID") > 0){
			this.showChildView('eventEdit',new Adventure.EventEdit({model: Adventure.activeAdventure.get('events').get(this.model.get("eventID"))}));		
		}
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			if (viewHandle.$el.find("[name='eventID']").val() == 0){
				Adventure.handleInvalidInput({errorMsg:'Please choose or create an event.', errorFields:['eventID']});
			}else{
				Adventure.activeAdventure.get('events').get(viewHandle.$el.find("[name='eventID']").val()).save(Adventure.generateFormMap(viewHandle.$el.find(".event-form")),
					Adventure.saveEventResponseHandlers(viewHandle,function(){
						viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find(".event-link")),Adventure.saveResponseHandlers(viewHandle));
					})
				);		
			}	
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"event");
			return false;
		});
	}
});


Adventure.SceneEventButton = Marionette.ItemView.extend({
	template: 'EventButton',
	className: 'selection',
	initialize: function() {
		var sceneModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		this.$el.click(function(){
			Adventure.Main.renderSceneEventEdit(sceneModel);	
		});
		this.model.updateName();
	}
});
Adventure.SceneEventList = Marionette.CollectionView.extend({
	childView: Adventure.SceneEventButton,
});
Adventure.SceneEventEdit = Marionette.LayoutView.extend({	
	template: 'EventLink',
	className: 'event-edit',
	regions: {eventSelect:'.event-selectbox',eventEdit:'.event-form'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find(".event-link");
		this.showChildView('eventSelect', new Adventure.EventSelect({selected: this.model.get("eventID"),parentView: this}));
		if(this.model.get("eventID") > 0){
			this.showChildView('eventEdit',new Adventure.EventEdit({model: Adventure.activeAdventure.get('events').get(this.model.get("eventID"))}));		
		}
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			if (viewHandle.$el.find("[name='eventID']").val() == 0){
				Adventure.handleInvalidInput({errorMsg:'Please choose or create an event.', errorFields:['eventID']});
			}else{
				Adventure.activeAdventure.get('events').get(viewHandle.$el.find("[name='eventID']").val()).save(Adventure.generateFormMap(viewHandle.$el.find(".event-form")),
					Adventure.saveEventResponseHandlers(viewHandle,function(){
						viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find(".event-link")),Adventure.saveResponseHandlers(viewHandle));
					})
				);	
			}	
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"event");
			return false;
		});
	}
});