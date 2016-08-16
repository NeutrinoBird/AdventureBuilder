Adventure.ImageUpload = Marionette.LayoutView.extend({
	template: 'ImageUpload',
	className: 'image-edit',
	regions: {selectionView:'.selections'},
	ui: {
		'saveButton': '.save-button',
		'deleteButton': '.delete-button'
	},
	events: {
		'click @ui.saveButton': function(event){
			event.preventDefault();
			var formMap = Adventure.generateFormMap(this.$el.find("form"));
			this.model.save(formMap,Adventure.saveImageUploadResponseHandlers(this,formMap));
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"image");
			return false;
		}
	}
});
Adventure.ImageEdit = Marionette.LayoutView.extend({
	template: 'ImageEdit',
	className: 'image-edit',
	regions: {selectionView:'.selections'},
	ui: {
		'testButton': '.test-button',
		'uploadButton': '.upload-button',
		'saveButton': '.save-button',
		'deleteButton': '.delete-button'
	},
	onRender: function() {
		this.model.form = this.$el.find("form");
		this.testImage();
	},
	events: {
		'click @ui.testButton': function(event){
			event.preventDefault();
			this.testImage();
			return false;
		},
		'click @ui.uploadButton': function(event){
			event.preventDefault();
			var viewHandle = this;
			Adventure.Main.initiateRemoval(this, function(){Adventure.Main.renderImageUpload(viewHandle.model)});
			return false;
		},
		'click @ui.saveButton': function(event){
			event.preventDefault();
			this.model.save(Adventure.generateFormMap(this.$el.find("form")),Adventure.saveResponseHandlers(this));
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"image");
			return false;
		}
	},
	testImage: function(){
		this.$el.find(".image-container img").css("transform","translateX(-"+this.$el.find("[name='centerX']").val()+") translateY(-"+this.$el.find("[name='centerY']").val()+") scale("+this.$el.find("[name='scale']").val()+")");
		this.$el.find(".image-container img").css("-webkit-transform","translateX(-"+this.$el.find("[name='centerX']").val()+") translateY(-"+this.$el.find("[name='centerY']").val()+") scale("+this.$el.find("[name='scale']").val()+")");
		this.$el.find(".image-container img").css("-ms-transform","translateX(-"+this.$el.find("[name='centerX']").val()+") translateY(-"+this.$el.find("[name='centerY']").val()+") scale("+this.$el.find("[name='scale']").val()+")");
	}

});
Adventure.ImageButton = Marionette.ItemView.extend({
	template: 'ImageButton',
	className: 'selection',
	events: {
		'click': function(event){
			event.preventDefault();
			if(this.getOption('selectionView').getOption('parentView') == undefined){
				Adventure.Main.renderImageEdit(this.model);
			}else{
				this.getOption('selectionView').getOption('parentView').setImage(this.model.get("ID"));
				Adventure.Main.initiateRemoval(this.getOption('selectionView'));
			}
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.ImageList = Marionette.CollectionView.extend({
	childView: Adventure.ImageButton,
	initialize: function(options){
		this.childViewOptions = {selectionView: options.selectionView};
	}
});
Adventure.ImageSelection = Marionette.LayoutView.extend({
	template: 'ImageSelection',
	className: 'image-selection',
	regions: {selectionView:'.selections'},
	ui: {
		'newButton': '.new-button',
		'closeButton': '.close-button'
	},
	onRender: function() {
		this.showChildView('selectionView', new Adventure.ImageList({collection: this.collection, selectionView: this}));
	},
	events: {
		'click @ui.newButton': function(event){
			event.preventDefault();
			this.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderImageUpload(model);
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