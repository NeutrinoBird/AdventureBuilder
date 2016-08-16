Adventure.FlagModel = Backbone.Model.extend({
	defaults: {
		name: '',
		isItem: 0,
		description: '',
		imageID: null,
		isCounter: 0,
		counterDefault: null,
		counterMinimum: null,
		counterMaximum: null,
		counterWraps: 0
	},
	idAttribute: "ID",
	urlRoot: 'services/flag.php',
	initialize: function() {
		this.handleBlankName();
		this.on('sync', this.handleBlankName);
	},
	handleBlankName: function(){
		if(!this.get('name')){
			this.set('name','(New flag #'+this.id+')');
		}
	},
	validate: function(){
		var validation = validate(this.form,[
			{name:"name",required:true,type:"string",maxLength:50},
			{name:"isItem",required:true,type:"bit"},
			{name:"description",required:false,type:"string",maxLength:200},
			{name:"imageID",required:false,type:"uint"},
			{name:"isCounter",required:true,type:"bit"},
			{name:"counterDefault",required:false,type:"int"},
			{name:"counterMinimum",required:false,type:"int"},
			{name:"counterMaximum",required:false,type:"int"},
			{name:"counterWraps",required:true,type:"bit"}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.Flags = Backbone.Collection.extend({
	model: Adventure.FlagModel
});