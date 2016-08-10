Adventure.AdventureView = Marionette.ItemView.extend({
	initialize: function() {
		this.template = (this.model.id == 'x') ? 'AdventureCreate' : 'Adventure';		
		this.setupComplete = false;		
	},
	onRender: function(){
		this.setImage(this.model.get("imageID"));
		if(!this.setupComplete){
			if(this.model.id == 'x'){
				this.createAdventureSetup();
			}else{
				this.clickAdventureSetup();
			}
			this.setupComplete = true;
		}
	},
	createAdventureSetup: function() {
		var el = this.$el;
		el.addClass('adventure-edit');
		el.find(".create-adventure").hide();
		el.find(".create-adventure-start").click(function(){
			el.find(".create-adventure-start").hide();
			el.find(".create-adventure").slideDown();
			return false;
		});
		el.find(".create-adventure button.create").click(function(){
			event.preventDefault();
			var validation = validate(el.find("form"),[
				{name:"title",required:true,type:"string",maxLength:100},
				{name:"description",required:true,type:"string",maxLength:500}
			]);
			if (validation.error){
				el.find(".create-adventure .errorRow").html("<ul>"+validation.errorMsg+"</ul>");
			}else{
				var NewAdventure = new Adventure.AdventureModel({
					hashKey: Math.floor((Math.random() * 10000) + 10), title: validation.form.title, description: validation.form.description
					//TODO: Remove the hashKey when using AJAX
				});
				Adventure.Menu.create(NewAdventure);
				Adventure.Menu.remove('x');
				Adventure.Menu.addNewOption();
			}
			return false;
		});
	},
	clickAdventureSetup: function() {
		var adventureModel = this.model;
		this.$el.addClass('adventure-select clickable');
		this.$el.click(function(){
			Adventure.activeAdventure = adventureModel;
			adventureModel.fetch({
				data:{
					ID:adventureModel.get("ID")
				},
				success: function(){
					Adventure.Main.renderAdventureEdit(adventureModel);
				},
				error: function(model, response, options){
					if (response.responseJSON.sessionExpired != undefined){
						Adventure.Main.renderSessionLogin();
					}else{
						alert("An error occurred while trying to load the adventure.");
					}
				}
			});			
		});
		this.listenTo(this.model, 'change', function(){
			this.render();
		});
	},
	setImage: function(imageID){
		if (imageID == 0 || imageID == '' || imageID == null){
			this.$el.find(".select-image").attr("src",'img/builder/icons/adventure.png');
		}else{
			this.$el.find(".select-image").attr("src",'uploads/'+this.model.get('images').get(imageID).get('URL'));
		}
	}
});
Adventure.AdventureList = Marionette.CollectionView.extend({
	childView: Adventure.AdventureView,
	className: 'adventure-list'
});
Adventure.AdventureEdit = Marionette.LayoutView.extend({
	template: 'AdventureEdit',
	className: 'adventure-edit',
	regions: {pageList:'.page-select .selections', sceneFilter:'.page-select .scene-selectbox'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.$el.find(".saveClose").click(function(){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));		
			return false;
		});		
		this.setImage(this.model.get("imageID"));
		this.$el.find(".image-button").click(function(){
			event.preventDefault();
			Adventure.Main.renderImageSelection(viewHandle.model.get('images'),viewHandle);
			return false;
		});
		this.showChildView('pageList', new Adventure.PageList({collection: this.model.get("pages")}));
		this.showChildView('sceneFilter', new Adventure.SceneSelect({filterBase: this.$el, filterElement: ".page-select .selection"}));
		this.$el.find(".page-select button").click(function(){
			event.preventDefault();
			viewHandle.model.get("pages").create({adventureID:viewHandle.model.id},{wait: true, validate: false, 
				success:function(model){
					model.initSubItems();
					Adventure.Main.renderPageEdit(model);
				}
			});
			return false;
		});
		this.$el.find(".scene-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderSceneSelection(viewHandle.model.get('scenes'));
			return false;
		});
		this.$el.find(".image-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderImageSelection(viewHandle.model.get('images'));
			return false;
		});
		this.$el.find(".flag-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderFlagSelection(viewHandle.model.get('flags'));
			return false;
		});
		this.$el.find(".effect-select button").click(function(){
			event.preventDefault();
			Adventure.Main.renderEffectSelection(viewHandle.model.get('effects'));
			return false;
		});
	},
	setImage: function(imageID){
		if (imageID == 0 || imageID == '' || imageID == null){
			this.$el.find(".image-button > img").attr("src",'img/builder/icons/image.png');
		}else{
			this.model.set("imageID",imageID);
			this.$el.find(".image-button > img").attr("src",'uploads/'+this.model.get('images').get(imageID).get('URL'));
		}
	}
});