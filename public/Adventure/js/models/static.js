Adventure.PageTypeModel = Backbone.Model.extend({
	defaults:{
		name: '',
		style: ''
	},
	idAttribute: "ID",
});
Adventure.PageTypes = Backbone.Collection.extend({
	model: Adventure.PageTypeModel
});

Adventure.TransitionModel = Backbone.Model.extend({
	defaults:{
		name: ''
	},
	idAttribute: "ID",
});
Adventure.Transitions = Backbone.Collection.extend({
	model: Adventure.TransitionModel
});

Adventure.ConditionModel = Backbone.Model.extend({
	defaults:{
		name: '',
		involvesFlag: 0,
		involvesCounter: 0,
		involvesRange: 0,
		involvesPage: 0
	},
	idAttribute: "ID",
	evaluateCondition: function(flagValue,value,upperValue,randomRoll,currentPageID,pageID,otherFlagValue){
		value = int(value);
		upperValue = int(upperValue);
		randomRoll = randomRoll || 0;
		currentPageID = int(currentPageID) || 0;
		pageID = int(pageID) || 0;
		switch(int(this.id)){
			case 2:
				return flagValue == true;
				break;
			case 3:
				return flagValue == false;
				break;
			case 4:
				return flagValue == (otherFlagValue !== undefined ? otherFlagValue : value);
				break;
			case 5:
				return flagValue != (otherFlagValue !== undefined ? otherFlagValue : value);
				break;
			case 6:
				return flagValue < (otherFlagValue !== undefined ? otherFlagValue : value);
				break;
			case 7:
				return flagValue <= (otherFlagValue !== undefined ? otherFlagValue : value);
				break;
			case 8:
				return flagValue > (otherFlagValue !== undefined ? otherFlagValue : value);
				break;
			case 9:
				return flagValue >= (otherFlagValue !== undefined ? otherFlagValue : value);
				break;
			case 10:
				return flagValue >= value && flagValue <= upperValue;
				break;
			case 11:
				return !(flagValue >= value && flagValue <= upperValue);
				break;
			case 12:
				return randomRoll >= value && randomRoll <= upperValue;
				break;
			case 13:
				return pageID == currentPageID;
				break;
			case 14:
				return pageID != currentPageID;
				break;
			default: return true;
		}
	}
});
Adventure.Conditions = Backbone.Collection.extend({
	model: Adventure.ConditionModel
});

Adventure.EventTypeModel = Backbone.Model.extend({
	defaults:{
		name: '',
		involvesFlag: 0,
		involvesValue: 0,
		involvesPage: 0
	},
	idAttribute: "ID",
});
Adventure.EventTypes = Backbone.Collection.extend({
	model: Adventure.EventTypeModel
});

Adventure.ActionTypeModel = Backbone.Model.extend({
	defaults:{
		name: '',
		requiresText: 0
	},
	idAttribute: "ID",
});
Adventure.ActionTypes = Backbone.Collection.extend({
	model: Adventure.ActionTypeModel
});

Adventure.initStatic = function(callback){
	$.ajax({
		type: "POST",
		url: "services/static.php",
		success: function(response){
			Adventure.pageTypes = new Adventure.PageTypes(response.pageTypes);
			Adventure.transitions = new Adventure.Transitions(response.transitions);
			Adventure.conditions = new Adventure.Conditions(response.conditions);
			Adventure.eventTypes = new Adventure.EventTypes(response.eventTypes);
			Adventure.actionTypes = new Adventure.ActionTypes(response.actionTypes);
			callback();
		},
		dataType: 'json'
	}).fail(function(response){
		alert("An error occurred while retrieving static data.");
	});
}