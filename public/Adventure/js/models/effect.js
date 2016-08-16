Adventure.EffectModel = Backbone.Model.extend({
	defaults: {
		name: '',
		keyframes: '',
		timing: 'linear',
		duration: 1,
		delay: 0,
		loops: 0,
		direction: 'normal',
		fillMode: 'none'
	},
	idAttribute: "ID",
	urlRoot: 'services/effect.php',
	initialize: function() {
		this.handleBlankName();
		this.on('sync', this.handleBlankName);
	},
	handleBlankName: function(){
		if(!this.get('name')){
			this.set('name','(New effect #'+this.id+')');
		}
	},
	validate: function(){
		var validation = validate(this.form,[
			{name:"name",required:true,type:"string",maxLength:50},
			{name:"keyframes",required:true,type:"string",maxLength:1000},
			{name:"timing",required:true,type:"string",maxLength:40},
			{name:"duration",required:true,type:"tinyint"},
			{name:"delay",required:true,type:"tinyint"},
			{name:"loops",required:true,type:"tinyint"},
			{name:"direction",required:true,type:"string",maxLength:20},
			{name:"fillMode",required:true,type:"string",maxLength:20}
		]);
		if (validation.error){
			Adventure.handleInvalidInput(validation);
			return validation;
		}
	},
	applyEffect: function(element){
		var animationString = "effect-"+this.id+" "+
										this.get('timing')+" "+
										this.get('duration')+"s "+
										this.get('delay')+"s "+
										(this.get('loops') == '0' ? 'infinite' : this.get('loops'))+" "+
										this.get('direction')+" "+
										this.get('fillMode');
		element.css("animation","none");
		element.css("-webkit-animation","none");
		setTimeout(function(){
			element.css("animation",animationString);
			element.css("-webkit-animation",animationString);
		}, 20);
	}
});
Adventure.Effects = Backbone.Collection.extend({
	model: Adventure.EffectModel,
	assembleKeyframes: function(){
		var scriptBlock = '<style type="text/css">\n';
		var keyframes = '';
		for(var i in this.models){
			keyframes = Adventure.addCSSSupport(this.models[i].get('keyframes'));
			scriptBlock += '@keyframes effect-'+this.models[i].id+'{\n'+keyframes+'\n}\n ';
			scriptBlock += '@-webkit-keyframes effect-'+this.models[i].id+'{\n'+keyframes+'\n}\n';
		}
		scriptBlock += '</style>';
		return scriptBlock;
	}
});