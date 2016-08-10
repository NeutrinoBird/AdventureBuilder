Adventure.ImageModel = Backbone.Model.extend({
	defaults: {
		URL: '',
		width: 0,
		height: 0,
		centerX: '50%',
		centerY: '50%',
		scale: '1'
	},
	idAttribute: "ID",
	urlRoot: 'services/image.php',
	validate: function(){
		var validation = validate(this.form,[
			{name:"centerX",required:true,type:"percent",maxLength:10},
			{name:"centerY",required:true,type:"percent",maxLength:10},
			{name:"scale",required:true,type:"decimal",maxLength:10}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	}
});
Adventure.Images = Backbone.Collection.extend({
	model: Adventure.ImageModel
});