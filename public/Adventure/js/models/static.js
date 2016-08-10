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
		involvesCounter: 0,
		involvesRange: 0
	},
	idAttribute: "ID",
});
Adventure.Conditions = Backbone.Collection.extend({
	model: Adventure.ConditionModel
});

Adventure.EventTypeModel = Backbone.Model.extend({
	defaults:{
		name: ''
	},
	idAttribute: "ID",
});
Adventure.EventTypes = Backbone.Collection.extend({
	model: Adventure.PageTypeModel
});

Adventure.initStatic = function(){
	$.ajax({
		type: "POST",
		url: "services/static.php",
		success: function(response){
			Adventure.pageTypes = new Adventure.PageTypes(response.pageTypes);
			Adventure.transitions = new Adventure.Transitions(response.transitions);
			Adventure.conditions = new Adventure.Conditions(response.conditions);
			Adventure.eventTypes = new Adventure.EventTypes(response.eventTypes);
		},
		dataType: 'json'
	}).fail(function(response){
		alert("An error occurred while retrieving static data.");
	});	
}