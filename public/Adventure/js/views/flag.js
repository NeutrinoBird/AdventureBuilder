Adventure.FlagOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	initialize: function() {
		this.$el.val(this.model.get("ID"));
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.FlagSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className:  'form-control',
	childView: Adventure.FlagOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('flags');
	},
	onRender: function(){
		this.$el.attr("name",this.getOption("name") == undefined ? "flagID" : this.getOption("name"));
		this.$el.prepend("<option value='0'>" + (this.getOption("isOtherFlag") ? "Use Above Value" : "Select Flag") + "</option>");
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
			if(this.$el.val() != '0' && this.getOption("isOtherFlag") && this.getOption("valueField")){
				this.getOption("valueField").val(0);
			}
		}
	}
});
Adventure.FlagSelectPlus = Marionette.LayoutView.extend({
	template: 'SelectWithNewButton',
	className: 'select-plus',
	regions: {
		selectContainer:'.select-container'
	},
	ui: {
		newButton: 'button'
	},
	initialize: function(options){
		this.selectBox = new Adventure.FlagSelect(this.options);
		this.selectBox.$el.removeClass("form-control");
	},
	onRender: function(){
		this.showChildView('selectContainer', this.selectBox);
	},
	events: {
		'click @ui.newButton': function(event){
			event.preventDefault();
			var flagSelectView = this;
			Adventure.activeAdventure.get('flags').create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderFlagEdit(model);
					flagSelectView.selectBox.$el.val(model.id);
					flagSelectView.options.selected = model.id;
					flagSelectView.selectBox.options.selected = model.id;
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		}
	}
});
Adventure.FlagEdit = Marionette.LayoutView.extend({
	template: 'FlagEdit',
	className: 'flag-edit',
	ui: {
		isCounterBox: '[name="isCounter"]',
		imageButton: '.image-button',
		saveButton: '.save-button',
		deleteButton: '.delete-button'
	},
	onRender: function() {
		var viewHandle = this;
		Adventure.setupTooltips(this);
		this.model.form = this.$el.find("form");
		this.setImage(this.model.get("imageID"));
		this.$el.find("[name='isCounter']").change();
		this.listenTo(Adventure.activeAdventure.get('images'), 'change destroy', function(model){
			if(model.id == viewHandle.model.get("imageID")){
				viewHandle.setImage(model.id);
			}
		});
	},
	events: {
		'change @ui.isCounterBox': function(event){
			this.$el.find(".counter-group").toggle(this.$el.find("[name='isCounter']:checked").length == 1);
		},
		'click @ui.imageButton': function(event){
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'),this);
			return false;
		},
		'click @ui.saveButton': function(event){
			event.preventDefault();
			this.model.save(Adventure.generateFormMap(this.$el.find("form")),Adventure.saveResponseHandlers(this));
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"flag");
			return false;
		}
	},
	setImage: function(imageID){
		if (imageID == 0 || imageID == '' || imageID == null || !Adventure.activeAdventure.get('images').get(imageID)){
			this.$el.find(".image-button > .image-container > img").attr("src",'img/builder/icons/image.png').removeAttr('style');
		}else if(!Adventure.activeAdventure.get('images').get(imageID).get('URL')){
			this.$el.find(".image-button > .image-container > img").attr("src",'img/builder/icons/image.png').removeAttr('style');
		}else{
			this.model.set("imageID",imageID);
			this.$el.find("[name=imageID]").val(imageID);
			this.$el.find(".image-button > .image-container > img").attr("src",'uploads/'+Adventure.activeAdventure.get('images').get(imageID).get('URL'));
			Adventure.activeAdventure.get('images').get(imageID).applyAdjustment(this.$el.find(".image-button > .image-container > img"));
		}
	}
});
Adventure.FlagButton = Marionette.ItemView.extend({
	template: 'FlagButton',
	className: 'selection',
	onRender: function(){
		this.$el.find(".image-thumbnail").hide();
		if(int(this.model.get("imageID")) > 0){
			if (Adventure.activeAdventure.get("images").get(this.model.get("imageID"))){
				this.$el.find(".no-thumbnail").hide();
				this.$el.find(".image-thumbnail").show();
				this.$el.find(".image-thumbnail img").attr("src","uploads/"+Adventure.activeAdventure.get("images").get(this.model.get("imageID")).get("URL"));
				Adventure.activeAdventure.get('images').get(this.model.get("imageID")).applyAdjustment(this.$el.find(".image-thumbnail img"));
			}
		}
	},
	events: {
		'click': function(event){
			event.preventDefault();
			Adventure.Main.renderFlagEdit(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.FlagList = Marionette.CollectionView.extend({
	childView: Adventure.FlagButton,
});
Adventure.FlagSelection = Marionette.LayoutView.extend({
	template: 'FlagSelection',
	className: 'flag-selection',
	regions: {selectionView:'.selections'},
	ui: {
		newButton: '.new-button',
		closeButton: '.close-button'
	},
	onRender: function() {
		this.showChildView('selectionView', new Adventure.FlagList({collection: this.collection}));
	},
	events: {
		'click @ui.newButton': function(event){
			event.preventDefault();
			this.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
				success:function(model){
					Adventure.Main.renderFlagEdit(model);
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