Adventure.ActionFlagRequirementModel = Backbone.Model.extend({
	defaults:{
		name: '',
		conditionID: 1,
		flagID: 0,
		counterValue: null,
		counterUpperValue: null,
		pageID: 0,
		otherFlagID: 0
	},
	idAttribute: "ID",
	initialize: function(){
		this.on('sync', this.updateName);
		this.form = this.attributes;
	},
	updateName: function(){
		var flagName = (!int(this.get("flagID"))) ? "New Requirement" : Adventure.activeAdventure.get('flags').get(this.get("flagID")).get("name");
		var otherFlagName = (!int(this.get("otherFlagID"))) ? "" : Adventure.activeAdventure.get('flags').get(this.get("otherFlagID")).get("name");
		var newName = flagName;
		switch(int(this.get("conditionID"))){
			case 1: newName = 'Always Trigger';	break;
			case 2: newName = flagName+' Active';	break;
			case 3: newName = flagName+' Inactive'; break;
			case 4: newName = flagName+' = '+(otherFlagName ? otherFlagName : this.get("counterValue")); break;
			case 5: newName = flagName+' != '+(otherFlagName ? otherFlagName : this.get("counterValue")); break;
			case 6: newName = flagName+' < '+(otherFlagName ? otherFlagName : this.get("counterValue")); break;
			case 7: newName = flagName+' <= '+(otherFlagName ? otherFlagName : this.get("counterValue")); break;
			case 8: newName = flagName+' > '+(otherFlagName ? otherFlagName : this.get("counterValue")); break;
			case 9: newName = flagName+' >= '+(otherFlagName ? otherFlagName : this.get("counterValue")); break;
			case 10: newName = flagName+' between '+this.get("counterValue")+' and '+this.get("counterUpperValue"); break;
			case 11: newName = flagName+' not between '+this.get("counterValue")+' and '+this.get("counterUpperValue"); break;
			case 12: newName = this.get("counterValue")+'% chance'; break;
			case 13: newName = 'Page = '+Adventure.activeAdventure.get('pages').get(this.get("pageID")).get("name"); break;
			case 14: newName = 'Page != '+Adventure.activeAdventure.get('pages').get(this.get("pageID")).get("name"); break;
		}
		this.set("name",newName);
	},
	urlRoot: 'services/actionFlagRequirement.php',
	validate: function(){
		var flagRequired = (int(this.form.find("[name='conditionID']").val()) > 1 && int(this.form.find("[name='conditionID']").val()) < 11);
		var counterRequired = int(Adventure.conditions.get(this.form.find("[name='conditionID']").val()).get("involvesCounter"));
		var rangeRequired = int(Adventure.conditions.get(this.form.find("[name='conditionID']").val()).get("involvesRange"));
		var pageRequired = int(Adventure.conditions.get(this.form.find("[name='conditionID']").val()).get("involvesPage"));
		var validation = validate(this.form,[
			{name:"conditionID",required:true,type:"tinyint"},
			{name:"flagID",required:flagRequired,type:"uint"},
			{name:"counterValue",required:counterRequired,type:"int"},
			{name:"counterUpperValue",required:rangeRequired,type:"int"},
			{name:"pageID",required:pageRequired,type:"uint"},
			{name:"otherFlagID",required:(counterRequired && !rangeRequired),type:"uint"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.ActionFlagRequirements = Backbone.Collection.extend({
	model: Adventure.ActionFlagRequirementModel
});