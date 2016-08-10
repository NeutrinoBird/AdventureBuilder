Adventure.ActionFlagRequirementModel = Backbone.Model.extend({
	defaults:{
		name: '',
		flagID: 0,
		counterValue: null,
		counterUpperValue: null,
		conditionID: 1
	},
	idAttribute: "ID",
	initialize: function(){
		//this.updateName();
		this.on('sync', this.updateName);
		this.form = this.attributes;
	},
	updateName: function(){
		var flagName = (!parseInt(this.get("flagID"))) ? "New Requirement" : Adventure.activeAdventure.get('flags').get(this.get("flagID")).get("name");
		var newName = flagName;
		switch(parseInt(this.get("conditionID"))){
			case 1: newName = 'Always Trigger';	break;
			case 2: newName = flagName+' Active';	break;
			case 3: newName = flagName+' Inactive'; break;
			case 4: newName = flagName+' = '+this.get("counterValue"); break;
			case 5: newName = flagName+' < '+this.get("counterValue"); break;
			case 6: newName = flagName+' <= '+this.get("counterValue"); break;
			case 7: newName = flagName+' > '+this.get("counterValue"); break;
			case 8: newName = flagName+' >= '+this.get("counterValue"); break;
			case 9: newName = flagName+' between '+this.get("counterValue")+' and '+this.get("counterUpperValue"); break;
			case 10: newName = flagName+' not between '+this.get("counterValue")+' and '+this.get("counterUpperValue"); break;
			case 11: newName = this.get("counterValue")+'% chance'; break;
		}
		this.set("name",newName);
	},
	urlRoot: 'services/actionFlagRequirement.php',
	validate: function(){
		var flagRequired = (parseInt(this.form.find("[name='conditionID']").val()) > 1 && parseInt(this.form.find("[name='conditionID']").val()) < 11);
		var counterRequired = parseInt(Adventure.conditions.get(this.form.find("[name='conditionID']").val()).get("involvesCounter"));
		var rangeRequired = parseInt(Adventure.conditions.get(this.form.find("[name='conditionID']").val()).get("involvesRange"));
		var validation = validate(this.form,[
			{name:"flagID",required:flagRequired,type:"uint"},
			{name:"counterValue",required:counterRequired,type:"int"},
			{name:"counterUpperValue",required:rangeRequired,type:"int"},
			{name:"conditionID",required:true,type:"tinyint"}
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