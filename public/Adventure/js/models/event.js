Adventure.EventModel = Backbone.Model.extend({
	defaults: {
		name: '(New Event)',
		eventTypeID: 1,
		flagID: 0,
		value: null,
		textBefore: '',
		textAfter: '',
		pageID: 0,
		counterValue: null,
		counterUpperValue: null,
		conditionID: 1,
		conditionFlagID: 0
	},
	idAttribute: "ID",
	initialize: function(){
		this.updateName();
		this.on('sync', this.updateName);
	},
	updateName: function(){
		var flagName = (this.get("flagID") == 0) ? "(Undefined)" : Adventure.activeAdventure.get('flags').get(this.get("flagID")).get("name");
		var pageName = (this.get("pageID") == 0) ? "(Undefined)" : Adventure.activeAdventure.get('pages').get(this.get("pageID")).get("name");
		var newName = '(New Event)';
		switch(parseInt(this.get("eventTypeID"))){
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
				newName ='Jump to Stored Page'; 
				break;
		}
		if (parseInt(this.get("conditionID")) > 1){
			flagName = (this.get("conditionFlagID") == 0) ? "(Undefined)" : Adventure.activeAdventure.get('flags').get(this.get("conditionFlagID")).get("name");
			newName += " if ";
			switch(parseInt(this.get("conditionID"))){
				case 2: newName += flagName+' Active';	break;
				case 3: newName += flagName+' Inactive'; break;
				case 4: newName += flagName+' = '+this.get("counterValue"); break;
				case 5: newName += flagName+' < '+this.get("counterValue"); break;
				case 6: newName += flagName+' <= '+this.get("counterValue"); break;
				case 7: newName += flagName+' > '+this.get("counterValue"); break;
				case 8: newName += flagName+' >= '+this.get("counterValue"); break;
				case 9: newName += flagName+' between '+this.get("counterValue")+' and '+this.get("counterUpperValue"); break;
				case 10: newName += flagName+' not between '+this.get("counterValue")+' and '+this.get("counterUpperValue"); break;
				case 11: newName += this.get("counterValue")+'% chance'; break;
			}
		}
		this.set("name",newName);
	},
	urlRoot: 'services/event.php',
	validate: function(){
		var FlagRequired = parseInt(Adventure.eventTypes.get(this.form.find("[name='eventTypeID']").val()).get("involvesFlag"));
		var ValueRequired = parseInt(Adventure.eventTypes.get(this.form.find("[name='eventTypeID']").val()).get("involvesValue"));
		var PageRequired = parseInt(Adventure.eventTypes.get(this.form.find("[name='eventTypeID']").val()).get("involvesPage"));
		var conditionFlagRequired = (parseInt(this.form.find("[name='conditionID']").val()) > 1 && parseInt(this.form.find("[name='conditionID']").val()) < 11);
		var counterRequired = parseInt(Adventure.conditions.get(this.form.find("[name='conditionID']").val()).get("involvesCounter"));
		var rangeRequired = parseInt(Adventure.conditions.get(this.form.find("[name='conditionID']").val()).get("involvesRange"));
		var validation = validate(this.form,[
			{name:"eventTypeID",required:true,type:"tinyint"},
			{name:"flagID",required:FlagRequired,type:"uint"},
			{name:"value",required:ValueRequired,type:"int"},
			{name:"textBefore",required:false,type:"string",maxLength:200},
			{name:"textAfter",required:false,type:"string",maxLength:200},
			{name:"pageID",required:PageRequired,type:"uint"},
			{name:"conditionID",required:true,type:"tinyint"},
			{name:"conditionFlagID",required:conditionFlagRequired,type:"uint"},
			{name:"counterValue",required:counterRequired,type:"int"},
			{name:"counterUpperValue",required:rangeRequired,type:"int"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.Events = Backbone.Collection.extend({
	model: Adventure.EventModel
});

Adventure.SceneEventModel = Backbone.Model.extend({
	defaults:{
		name: '',
		eventID: 0,
		priority: 0
	},
	idAttribute: "ID",
	initialize: function(){
		//this.updateName();
		this.on('sync', this.updateName);
	},
	updateName: function(){
		if(parseInt(this.get('eventID')) > 0){
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
	model: Adventure.SceneEventModel
});

Adventure.PageEventModel = Backbone.Model.extend({
	defaults:{
		name: '',
		eventID: 0,
		priority: 0
	},
	idAttribute: "ID",
	initialize: function(){
		//this.updateName();
		this.on('sync', this.updateName);
	},
	updateName: function(){
		if(parseInt(this.get('eventID')) > 0){
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
	model: Adventure.PageEventModel
});

Adventure.ActionEventModel = Backbone.Model.extend({
	defaults:{
		name: '',
		eventID: 0,
		priority: 0
	},
	idAttribute: "ID",
	initialize: function(){
		//this.updateName();
		this.on('sync', this.updateName);
	},
	updateName: function(){
		if(parseInt(this.get('eventID')) > 0){
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
	model: Adventure.ActionEventModel
});