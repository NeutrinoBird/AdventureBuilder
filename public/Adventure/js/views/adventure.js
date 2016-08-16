Adventure.CreateAdventureView = Marionette.ItemView.extend({
	template: 'AdventureCreate',
	className: 'adventure-edit',
	ui: {
		'createAdventureStart': '.create-adventure-start',
		'createAdventureButton': '.create-adventure button.create'
	},
	onRender: function() {
		this.$el.find(".create-adventure").hide();
	},
	events: {
		'change @ui.createAdventureStart': function(event){
			event.preventDefault();
			this.$el.find(".create-adventure-start").hide();
			this.$el.find(".create-adventure").slideDown();
			return false;
		},
		'change @ui.createAdventureButton': function(event){
			event.preventDefault();
			var viewHandle = this;
			var validation = validate(this.$el.find("form"),[
				{name:"title",required:true,type:"string",maxLength:100},
				{name:"description",required:true,type:"string",maxLength:500}
			]);
			if (validation.error){
				this.$el.find(".create-adventure .errorRow").html("<ul>"+validation.errorMsg+"</ul>");
			}else{
				Adventure.Menu.create({title: validation.form.title, description: validation.form.description},{wait: true, validate: false,
					success:function(model){
						viewHandle.render();
					},
					error: function(model, response, options){
						Adventure.handleInvalidInput(response.responseJSON);
					}
				});
			}
			return false;
		}
	}
});
Adventure.AdventureView = Marionette.ItemView.extend({
	template: 'Adventure',
	className: 'adventure-select clickable',
	onRender: function(){
		if(this.model.get("imageURL")){
			this.$el.find("img").css("transform","translateX(-"+this.model.get("imageX")+") translateY(-"+this.model.get("imageY")+") scale("+this.model.get("imageScale")+")");
			this.$el.find("img").css("-webkit-transform","translateX(-"+this.model.get("imageX")+") translateY(-"+this.model.get("imageY")+") scale("+this.model.get("imageScale")+")");
			this.$el.find("img").css("-ms-transform","translateX(-"+this.model.get("imageX")+") translateY(-"+this.model.get("imageY")+") scale("+this.model.get("imageScale")+")");
		}
	},
	events: {
		'click': function(event){
			event.preventDefault();
			Adventure.activeAdventure = this.model;
			this.model.fetch({
				data:{
					ID:this.model.get("ID")
				},
				success: function(model){
					Adventure.Main.renderAdventureEdit(model);
				},
				error: function(model, response, options){
					if (response.responseJSON.sessionExpired != undefined){
						Adventure.Main.renderSessionLogin();
					}else{
						alert("An error occurred while trying to load the adventure.");
					}
				}
			});
			return false
		}
	},
	modelEvents: {
		'sync': 'render'
	}
});
Adventure.AdventureList = Marionette.CollectionView.extend({
	childView: Adventure.AdventureView,
	className: 'adventure-list',
	onRender: function(){
		this.$el.append();
	}
});

Adventure.AdventureListFramework = Marionette.LayoutView.extend({
	template: 'AdventureListFramework',
	regions: {adventureList:'.adventure-list', newAdventure:'.new-adventure'},
	onRender: function() {
		this.showChildView('adventureList', new Adventure.AdventureList({collection: this.collection}));
		this.showChildView('newAdventure', new Adventure.CreateAdventureView());
	}
});

Adventure.AdventureEdit = Marionette.LayoutView.extend({
	template: 'AdventureEdit',
	className: 'adventure-edit',
	regions: {pageList:'.page-select .selections', sceneFilter:'.page-select .scene-selectbox'},
	ui: {
		'saveButton': '.saveClose',
		'imageButton': '.image-button',
		'newPageButton': '.page-select button',
		'newSceneButton': '.scene-select button',
		'newImageButton': '.image-select button',
		'newFlagButton': '.flag-select button',
		'newEffectButton': '.effect-select button'
	},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.setImage(this.model.get("imageID"));
		this.listenTo(Adventure.activeAdventure.get('images'), 'change destroy', function(model){
			viewHandle.setImage(model.id);
		});
		this.showChildView('pageList', new Adventure.PageList({collection: this.model.get("pages")}));
		this.showChildView('sceneFilter', new Adventure.SceneSelect({filterBase: this.$el, filterElement: ".page-select .selection"}));
	},
	events: {
		'click @ui.saveButton': function(event){
			event.preventDefault();
			this.model.save(Adventure.generateFormMap(this.$el.find("form")),Adventure.saveResponseHandlers(this));
			return false;
		},
		'click @ui.imageButton': function(event){
			event.preventDefault();
			Adventure.Main.renderImageSelection(this.model.get('images'),this);
			return false;
		},
		'click @ui.newPageButton': function(event){
			event.preventDefault();
			this.model.get("pages").create({adventureID:this.model.id},{wait: true, validate: false,
				success:function(model){
					model.initSubItems();
					Adventure.Main.renderPageEdit(model);
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			return false;
		},
		'click @ui.newSceneButton': function(event){
			event.preventDefault();
			Adventure.Main.renderSceneSelection(this.model.get('scenes'));
			return false;
		},
		'click @ui.newImageButton': function(event){
			event.preventDefault();
			Adventure.Main.renderImageSelection(this.model.get('images'));
			return false;
		},
		'click @ui.newFlagButton': function(event){
			event.preventDefault();
			Adventure.Main.renderFlagSelection(this.model.get('flags'));
			return false;
		},
		'click @ui.newEffectButton': function(event){
			event.preventDefault();
			Adventure.Main.renderEffectSelection(this.model.get('effects'));
			return false;
		}
	},
	setImage: function(imageID){
		if (imageID == 0 || imageID == '' || imageID == null || !this.model.get('images').get(imageID)){
			this.$el.find(".image-button > .image-container > img").attr("src",'img/builder/icons/image.png').removeAttr('style');
			this.model.set("imageID","");
			this.model.set("imageURL","");
		}else if(!this.model.get('images').get(imageID).get('URL')){
			this.$el.find(".image-button > .image-container > img").attr("src",'img/builder/icons/image.png').removeAttr('style');
			this.model.set("imageID","");
			this.model.set("imageURL","");
		}else{
			this.model.set("imageID",imageID);
			this.model.set("imageURL",this.model.get('images').get(imageID).get('URL'));
			this.model.set("imageX",this.model.get('images').get(imageID).get('centerX'));
			this.model.set("imageY",this.model.get('images').get(imageID).get('centerY'));
			this.model.set("imageScale",this.model.get('images').get(imageID).get('scale'));
			this.$el.find(".image-button > .image-container > img").attr("src",'uploads/'+this.model.get("imageURL"));
			this.model.get('images').get(imageID).applyAdjustment(this.$el.find(".image-button > .image-container > img"));
		}
	}
});