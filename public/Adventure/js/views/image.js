Adventure.ImageButton = Marionette.ItemView.extend({
	template: 'ImageButton',
	className: 'selection',
	initialize: function(options){
		var imageModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		if(options.selectionView.options.parentView == undefined){
			this.$el.click(function(event){
				event.preventDefault();
				Adventure.Main.renderImageEdit(imageModel);
				return false;
			});
		}else{
			this.$el.click(function(event){
				event.preventDefault();
				options.selectionView.options.parentView.setImage(imageModel.get("ID"));
				Adventure.Main.initiateRemoval(options.selectionView);
				return false;
			});			
		}		
	}
});
Adventure.ImageList = Marionette.CollectionView.extend({
	childView: Adventure.ImageButton,
	initialize: function(options){
		this.childViewOptions = {
			selectionView: options.selectionView
		};
	}
});
Adventure.ImageSelection = Marionette.LayoutView.extend({	
	template: 'ImageSelection',
	className: 'image-selection',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.ImageList({collection: this.collection, selectionView: this}));
		this.$el.find(".new-button").click(function(event){			
			event.preventDefault();
			viewHandle.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
				success:function(model){
					Adventure.Main.renderImageUpload(model);
				}
			});
			return false;
		});
		this.$el.find(".close-button").click(function(event){			
			event.preventDefault();
			Adventure.Main.initiateRemoval(viewHandle);
			return false;
		});
	}
});
Adventure.ImageUpload = Marionette.LayoutView.extend({	
	template: 'ImageUpload',
	className: 'image-edit',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.$el.find(".save-button").click(function(event){			
			event.preventDefault();
			var formMap = Adventure.generateFormMap(viewHandle.$el.find("form"));
			viewHandle.model.save(formMap,Adventure.saveImageUploadResponseHandlers(viewHandle,formMap));				
			return false;
		});
		this.$el.find(".delete-button").click(function(event){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"image");
			return false;
		});
	}
});
Adventure.ImageEdit = Marionette.LayoutView.extend({	
	template: 'ImageEdit',
	className: 'image-edit',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.testImage();
		this.$el.find(".test-button").click(function(event){			
			event.preventDefault();
			viewHandle.testImage();
			return false;
		});			
		this.$el.find(".upload-button").click(function(event){			
			event.preventDefault();
			Adventure.Main.initiateRemoval(viewHandle, function(){Adventure.Main.renderImageUpload(viewHandle.model)});
			return false;
		});
		this.$el.find(".save-button").click(function(event){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));
			return false;
		});
		this.$el.find(".delete-button").click(function(event){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"image");
			return false;
		});
	},
	testImage: function(){
		this.$el.find(".image-container img").css("transform","translateX(-"+this.$el.find("[name='centerX']").val()+") translateY(-"+this.$el.find("[name='centerY']").val()+") scale("+this.$el.find("[name='scale']").val()+")");
		this.$el.find(".image-container img").css("-webkit-transform","translateX(-"+this.$el.find("[name='centerX']").val()+") translateY(-"+this.$el.find("[name='centerY']").val()+") scale("+this.$el.find("[name='scale']").val()+")");
		this.$el.find(".image-container img").css("-ms-transform","translateX(-"+this.$el.find("[name='centerX']").val()+") translateY(-"+this.$el.find("[name='centerY']").val()+") scale("+this.$el.find("[name='scale']").val()+")");	
	}

});
