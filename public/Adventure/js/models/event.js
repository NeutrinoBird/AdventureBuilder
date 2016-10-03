Adventure.EventModel = Backbone.Model.extend({
	defaults: {
		name: '(New Event)',
		eventTypeID: 1,
		flagID: 0,
		value: null,
		textBefore: '',
		textAfter: '',
		pageID: 0,
		isActive: 1,
		eventFlagRequirements: []
	},
	idAttribute: "ID",
	initialize: function(){
		this.set('eventFlagRequirements', new Adventure.EventFlagRequirements(this.get('eventFlagRequirements')));
		this.updateName();
		this.on('sync', this.updateName);
	},
	parse: function(response) {
		var collections = ['eventFlagRequirements'];
		for(i=0;i<collections.length;i++){
			if (response[collections[i]] != undefined){
				this.get(collections[i]).add(response[collections[i]]);
				delete response[collections[i]];
			}
		}
		return response;
	},
	updateName: function(){
		var flagName = (this.get("flagID") == 0) ? "(Undefined)" : Adventure.activeAdventure.get('flags').get(this.get("flagID")).get("name");
		var pageName = (this.get("pageID") == 0) ? "(Undefined)" : Adventure.activeAdventure.get('pages').get(this.get("pageID")).get("name");
		var newName = '(New Event)';
		switch(int(this.get("eventTypeID"))){
			case 1:
				newName = 'Display Text: ';
				if (this.get("textBefore") && this.get("textAfter")){
					newName += '"'+this.get("textBefore").substring(0,15)+(this.get("textBefore").length > 15 ? '...' : '')+'" / "'+this.get("textAfter").substring(0,15)+(this.get("textAfter").length > 15 ? '...' : '')+'"';
				}else if (this.get("textBefore")){
					newName += '"'+this.get("textBefore").substring(0,15)+(this.get("textBefore").length > 15 ? '...' : '')+'"';
				}else if (this.get("textAfter")){
					newName += '"'+this.get("textAfter").substring(0,15)+(this.get("textAfter").length > 15 ? '...' : '')+'"';
				}else{
					newName = '(Undefined Event)';
				}
				break;
			case 2:
				newName = 'Set Flag: '+flagName;
				break;
			case 3:
				newName = 'Remove Flag: '+flagName;
				break;
			case 4:
				newName = 'Set '+flagName+' to '+this.get("value");
				break;
			case 5:
				newName = 'Increase '+flagName+' by '+this.get("value");
				break;
			case 6:
				newName = 'Jump to Page: '+pageName;
				break;
			case 7:
				newName = 'Store Current Page';
				break;
			case 8:
				newName = 'Jump to Stored Page';
				break;
			case 9:
				newName = 'Stop Executing Events';
				break;
			case 10:
				newName = 'Create Checkpoint';
		}
		var firstRequirement = true;
		this.get("eventFlagRequirements").each(function(requirement){
			if (int(requirement.get("conditionID")) > 1){
				flagName = (requirement.get("flagID") == 0) ? "(Undefined)" : Adventure.activeAdventure.get('flags').get(requirement.get("flagID")).get("name");
				var otherFlagName = (!int(requirement.get("otherFlagID"))) ? "" : Adventure.activeAdventure.get('flags').get(requirement.get("otherFlagID")).get("name");
				newName += firstRequirement ? " if " : " and ";
				firstRequirement = false;
				switch(int(requirement.get("conditionID"))){
					case 2: newName += flagName+' Active';	break;
					case 3: newName += flagName+' Inactive'; break;
					case 4: newName += flagName+' = '+(otherFlagName ? otherFlagName : requirement.get("counterValue")); break;
					case 5: newName += flagName+' != '+(otherFlagName ? otherFlagName : requirement.get("counterValue")); break;
					case 6: newName += flagName+' < '+(otherFlagName ? otherFlagName : requirement.get("counterValue")); break;
					case 7: newName += flagName+' <= '+(otherFlagName ? otherFlagName : requirement.get("counterValue")); break;
					case 8: newName += flagName+' > '+(otherFlagName ? otherFlagName : requirement.get("counterValue")); break;
					case 9: newName += flagName+' >= '+(otherFlagName ? otherFlagName : requirement.get("counterValue")); break;
					case 10: newName += flagName+' between '+requirement.get("counterValue")+' and '+requirement.get("counterUpperValue"); break;
					case 11: newName += flagName+' not between '+requirement.get("counterValue")+' and '+requirement.get("counterUpperValue"); break;
					case 12: newName += 'Random number between '+requirement.get("counterValue")+' and '+requirement.get("counterUpperValue"); break;
					case 13: newName += 'Page = '+Adventure.activeAdventure.get('pages').get(requirement.get("pageID")).get("name"); break;
					case 14: newName += 'Page != '+Adventure.activeAdventure.get('pages').get(requirement.get("pageID")).get("name"); break;
				}
			}
		});
		this.set("name",newName);
	},
	urlRoot: 'services/event.php',
	validate: function(){
		var FlagRequired = int(Adventure.eventTypes.get(this.form.find("[name='eventTypeID']").val()).get("involvesFlag"));
		var ValueRequired = int(Adventure.eventTypes.get(this.form.find("[name='eventTypeID']").val()).get("involvesValue"));
		var PageRequired = int(Adventure.eventTypes.get(this.form.find("[name='eventTypeID']").val()).get("involvesPage"));
		var validation = validate(this.form,[
			{name:"eventTypeID",required:true,type:"tinyint"},
			{name:"flagID",required:FlagRequired,type:"uint"},
			{name:"value",required:ValueRequired,type:"int"},
			{name:"textBefore",required:false,type:"string",maxLength:200},
			{name:"textAfter",required:false,type:"string",maxLength:200},
			{name:"pageID",required:PageRequired,type:"uint"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.Events = Backbone.Collection.extend({
	model: Adventure.EventModel,
	cleanup: function(){
		var unusedEvents = [];
		this.each(function(Event){
			unusedEvents.push(Event.id);
		});
		Adventure.activeAdventure.get("scenes").each(function(Scene){
			Scene.get("sceneEvents").each(function(SceneEvent){
				if(unusedEvents.indexOf(SceneEvent.get('eventID'),0) >= 0){
					unusedEvents.splice(unusedEvents.indexOf(SceneEvent.get('eventID'),0),1);
				}
			});
		});
		Adventure.activeAdventure.get("pages").each(function(Page){
			Page.get("pageEvents").each(function(PageEvent){
				if(unusedEvents.indexOf(PageEvent.get('eventID'),0) >= 0){
					unusedEvents.splice(unusedEvents.indexOf(PageEvent.get('eventID'),0),1);
				}
			});
			Page.get("actions").each(function(Action){
				Action.get("actionEvents").each(function(ActionEvent){
					if(unusedEvents.indexOf(ActionEvent.get('eventID'),0) >= 0){
						unusedEvents.splice(unusedEvents.indexOf(ActionEvent.get('eventID'),0),1);
					}
				});
			});
		});
		_.each(unusedEvents,function(eventID,index,list){
			this.get(eventID).set("isActive",0);
		}, this);
	}
});

Adventure.SceneEventModel = Backbone.Model.extend({
	defaults:{
		name: '',
		eventID: 0,
		priority: 0
	},
	idAttribute: "ID",
	initialize: function(){
		this.on('sync', this.updateName);
	},
	updateName: function(){
		if(int(this.get('eventID')) > 0){
			this.set("name", this.get('priority')+': '+Adventure.activeAdventure.get("events").get(this.get('eventID')).get("name"));
		}else{
			this.set("name","(Undefined event)");
		};
	},
	urlRoot: 'services/sceneEvent.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"eventID",required:true,type:"uint"},
			{name:"priority",required:true,type:"tinyint"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.SceneEvents = Backbone.Collection.extend({
	model: Adventure.SceneEventModel,
	comparator: function(model){
		return int(model.get('priority'));
	}
});

Adventure.PageEventModel = Backbone.Model.extend({
	defaults:{
		name: '',
		eventID: 0,
		priority: 0
	},
	idAttribute: "ID",
	initialize: function(){
		this.on('sync', this.updateName);
	},
	updateName: function(){
		if(int(this.get('eventID')) > 0){
			this.set("name", this.get('priority')+': '+Adventure.activeAdventure.get("events").get(this.get('eventID')).get("name"));
		}else{
			this.set("name","(Undefined event)");
		};
	},
	urlRoot: 'services/pageEvent.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"eventID",required:true,type:"uint"},
			{name:"priority",required:true,type:"tinyint"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.PageEvents = Backbone.Collection.extend({
	model: Adventure.PageEventModel,
	comparator: function(model){
		return int(model.get('priority'));
	}
});

Adventure.ActionEventModel = Backbone.Model.extend({
	defaults:{
		name: '',
		eventID: 0,
		priority: 0
	},
	idAttribute: "ID",
	initialize: function(){
		this.on('sync', this.updateName);
	},
	updateName: function(){
		if(int(this.get('eventID')) > 0){
			this.set("name", this.get('priority')+': '+Adventure.activeAdventure.get("events").get(this.get('eventID')).get("name"));
		}else{
			this.set("name","(Undefined event)");
		};
	},
	urlRoot: 'services/actionEvent.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"eventID",required:true,type:"uint"},
			{name:"priority",required:true,type:"tinyint"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.ActionEvents = Backbone.Collection.extend({
	model: Adventure.ActionEventModel,
	comparator: function(model){
		return int(model.get('priority'));
	}
});