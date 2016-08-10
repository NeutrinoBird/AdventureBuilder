Adventure.EffectOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.$el.val(this.model.get("ID"));
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
		var effectSelectView = this;
		this.$el.attr("name","effectID");
		this.$el.prepend("<option value='0'>No Effect</option>");
		this.$el.append("<option value='new'>New Effect...</option>");
		this.$el.change(function(){
			var selectHandle = this;
			if($(this).val() == 'new'){																				
				effectSelectView.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
					success:function(model){
						Adventure.Main.renderEffectEdit(model);
						$(selectHandle).val(model.id);
					}
				});	
			}
		});
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
		}
	}
});
Adventure.EffectEdit = Marionette.LayoutView.extend({	
	template: 'EffectEdit',
	className: 'effect-edit',
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.$el.find(".test-image-select").click(function(){			
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'),viewHandle);
			return false;
		});
		this.$el.find(".test-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.find(".test-keyframes").html(Adventure.addCSSSupport("@keyframes effect-"+viewHandle.model.id+" {"+viewHandle.$el.find("[name='keyframes']").val()+'}'));
			viewHandle.$el.find(".test-keyframes").append(Adventure.addCSSSupport("@-webkit-keyframes effect-"+viewHandle.model.id+" {"+viewHandle.$el.find("[name='keyframes']").val()+'}'));
			viewHandle.$el.find(".image-container img").css("animation","none");
			viewHandle.$el.find(".image-container img").css("-webkit-animation","none");
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
		});			
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));				
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"effect");
			return false;
		});
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
	initialize: function() {
		var effectModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		this.$el.click(function(){
			Adventure.Main.renderEffectEdit(effectModel);
		});
	}
});
Adventure.EffectList = Marionette.CollectionView.extend({
	childView: Adventure.EffectButton,
});
Adventure.EffectSelection = Marionette.LayoutView.extend({	
	template: 'EffectSelection',
	className: 'effect-selection',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.EffectList({collection: this.collection}));
		this.$el.find(".new-button").click(function(){			
			event.preventDefault();
			viewHandle.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
				success:function(model){
					Adventure.Main.renderEffectEdit(model);
				}
			});	
			return false;
		});
		this.$el.find(".close-button").click(function(){			
			event.preventDefault();
			viewHandle.$el.addClass("removing");
			setTimeout(function(){
				Adventure.Main.removeLayer();			
				viewHandle.remove();
			}, 495);
			return false;
		});
	}
});