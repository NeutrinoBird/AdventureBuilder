Adventure.EffectOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	initialize: function() {
		this.$el.val(this.model.get("ID"));
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.EffectSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.EffectOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('effects');
	},
	onRender: function(){
		this.$el.attr("name","effectID");
		this.$el.prepend("<option value='0'>No Effect</option>");
		this.$el.append("<option value='new'>New Effect...</option>");
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
			if(!this.$el.find(":selected").length){
				this.$el.val(0);
			}
		}
	},
	events: {
		'change': function(event){
			var viewHandle = this;
			if(this.$el.val() == 'new'){
				this.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
					success: function(model){
						Adventure.Main.renderEffectEdit(model);
						viewHandle.$el.val(model.id);
						viewHandle.options.selected = model.id;
					},
					error: function(model, response, options){
						Adventure.handleInvalidInput(response.responseJSON);
					}
				});
			}
		}
	}
});
Adventure.EffectEdit = Marionette.LayoutView.extend({
	template: 'EffectEdit',
	className: 'effect-edit',
	ui: {
		'imageButton': '.test-image-select',
		'testButton': '.test-button',
		'saveButton': '.save-button',
		'deleteButton': '.delete-button'
	},
	onRender: function() {
		this.model.form = this.$el.find("form");
	},
	events: {
		'click @ui.imageButton': function(event){
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'),this);
			return false;
		},
		'click @ui.testButton': function(event){
			event.preventDefault();
			var viewHandle = this;
			this.$el.find(".test-keyframes").html(Adventure.addCSSSupport("@keyframes effect-"+this.model.id+" {"+this.$el.find("[name='keyframes']").val()+'}'));
			this.$el.find(".test-keyframes").append(Adventure.addCSSSupport("@-webkit-keyframes effect-"+this.model.id+" {"+this.$el.find("[name='keyframes']").val()+'}'));
			this.$el.find(".image-container img").css("animation","none");
			this.$el.find(".image-container img").css("-webkit-animation","none");
			setTimeout(function(){
				var animationString = "effect-"+viewHandle.model.id+" "+
												viewHandle.$el.find("[name='timing']").val()+" "+
												viewHandle.$el.find("[name='duration']").val()+"s "+
												viewHandle.$el.find("[name='delay']").val()+"s "+
												(viewHandle.$el.find("[name='loops']").val() == '0' ? 'infinite' : viewHandle.$el.find("[name='loops']").val())+" "+
												viewHandle.$el.find("[name='direction']").val()+" "+
												viewHandle.$el.find("[name='fillMode']").val();
				viewHandle.$el.find(".image-container img").css("animation",animationString);
				viewHandle.$el.find(".image-container img").css("-webkit-animation",animationString);
			}, 20);
			return false;
		},
		'click @ui.saveButton': function(event){
			event.preventDefault();
			this.model.save(Adventure.generateFormMap(this.$el.find("form")),Adventure.saveResponseHandlers(this));
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"effect");
			return false;
		}
	},
	setImage: function(imageID){
		if (imageID == 0 || imageID == '' || imageID == null){
			this.$el.find(".image-container img").attr("src",'img/builder/icons/image.png');
		}else{
			this.$el.find(".image-container img").attr("src",'uploads/'+Adventure.activeAdventure.get('images').get(imageID).get('URL'));
		}
	}
});
Adventure.EffectButton = Marionette.ItemView.extend({
	template: 'EffectButton',
	className: 'selection',
	events: {
		'click': function(event){
			event.preventDefault();
			Adventure.Main.renderEffectEdit(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.EffectList = Marionette.CollectionView.extend({
	childView: Adventure.EffectButton,
});
Adventure.EffectSelection = Marionette.LayoutView.extend({
	template: 'EffectSelection',
	className: 'effect-selection',
	regions: {selectionView:'.selections'},
	ui: {
		'newButton': '.new-button',
		'closeButton': '.close-button'
	},
	onRender: function() {
		this.showChildView('selectionView', new Adventure.EffectList({collection: this.collection}));
	},
	events: {
		'click @ui.newButton': function(event){
			event.preventDefault();
			this.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderEffectEdit(model);
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		},
		'click @ui.closeButton': function(event){
			event.preventDefault();
			Adventure.Main.initiateRemoval(this);
			return false;
		}
	}
});