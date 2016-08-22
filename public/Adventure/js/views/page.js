Adventure.PageOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',
	initialize: function() {
		this.$el.val(this.model.get("ID"));
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.PageSelect = Marionette.CollectionView.extend({
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.PageOption,
	initialize: function() {
		if(!this.getOption("collection")){
			this.collection = Adventure.activeAdventure.get('pages');
			this.$el.attr("name",this.getOption("name") == undefined ? "pageID" : this.getOption("name"));
		}
	},
	onRender: function(){
		if(!this.getOption("justExisting")){
			this.$el.prepend("<option value='0'>Same Page</option>");
			this.$el.append("<option value='new'>New Page...</option>");
		}
		if(this.getOption("selected") !== ""){
			this.$el.val(this.getOption("selected"));
			if(!this.$el.find(":selected").length){
				this.$el.val(0);
			}
		}
	},
	events: {
		'change': function(event){
			if(this.$el.val() == 'new'){
				var pageSelectView = this;
				this.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false,
					success:function(model){
						model.initSubItems();
						Adventure.Main.renderPageEditLite(model);
						pageSelectView.$el.val(model.id);
						pageSelectView.options.selected = model.id;
					},
					error: function(model, response, options){
						Adventure.handleInvalidInput(response.responseJSON);
					}
				});
			}
		}
	}
});
Adventure.PageEdit = Marionette.LayoutView.extend({
	template: 'PageEdit',
	className: 'page-edit',
	regions: {
		sceneSelect:'.scene-selectbox',
		pageTypeSelect:'.pageType-selectbox',
		effectSelect:'.effect-selectbox',
		actionSelection:'.action-select .selections',
		eventSelection:'.event-select .selections',
		linkPageSelect:'.linkPage-selectbox'
	},
	ui: {
		nameField: '[name="name"]',
		imageButton: '.image-button',
		newActionButton: '.new-action-button',
		newEventButton: '.new-event-button',
		saveButton: '.save-button',
		deleteButton: '.delete-button',
		linkPageButton: '.link-select button'
	},
	initialize: function(){
		if(this.getOption("lite")){
			this.template = 'PageEditLite';
		}
		this.linkingPages = new Adventure.Pages();
		this.setupLinkingPages();
	},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.setImage(this.model.get("imageID"));
		this.$el.find('.header-key').hide();
		this.showChildView('sceneSelect', new Adventure.SceneSelect({selected: this.model.get("sceneID")}));
		this.showChildView('pageTypeSelect', new Adventure.PageTypeSelect({selected: this.model.get("pageTypeID")}));
		this.showChildView('effectSelect', new Adventure.EffectSelect({selected: this.model.get("effectID")}));
		if(!this.getOption("lite")){
			this.showChildView('actionSelection', new Adventure.ActionList({collection: this.model.get('actions'), pageView: this}));
			this.showChildView('eventSelection', new Adventure.EventLinkList({collection: this.model.get('pageEvents')}));
			this.showChildView('linkPageSelect', new Adventure.PageSelect({collection: this.linkingPages, justExisting: true, selected: ''}));
			this.$el.find(".link-select").toggle(this.linkingPages.length > 0);
		}
		this.listenTo(Adventure.activeAdventure.get('images'), 'change destroy', function(model){
			viewHandle.setImage(model.id);
		});
	},
	events: {
		'change @ui.nameField': function(event){
			this.model.set("name", event.target.value);
			this.model.handleBlankName();
		},
		'click @ui.imageButton': function(event){
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'),this);
			return false;
		},
		'click @ui.newActionButton': function(event){
			event.preventDefault();
			if(!this.getOption("lite")){
				this.model.get("actions").create({pageID:this.model.id},{wait: true, validate: false,
					success:function(model){
						model.initSubItems();
						Adventure.Main.renderActionEdit(model);
					},
					error: function(model, response, options){
						Adventure.handleInvalidInput(response.responseJSON);
					}
				});
			}
			return false;
		},
		'click @ui.newEventButton': function(event){
			event.preventDefault();
			if(!this.getOption("lite")){
				this.model.get("pageEvents").create({pageID:this.model.id},{wait: true, validate: false,
					success:function(model){
						Adventure.Main.renderEventLinkEdit(model);
					},
					error: function(model, response, options){
						Adventure.handleInvalidInput(response.responseJSON);
					}
				});
			}
			return false;
		},
		'click @ui.saveButton': function(event){
			event.preventDefault();
			this.model.save(Adventure.generateFormMap(this.$el.find("form")),Adventure.saveResponseHandlers(this));
			return false;
		},
		'click @ui.deleteButton': function(event){
			event.preventDefault();
			Adventure.deleteDialog(this,"page");
			return false;
		},
		'click @ui.linkPageButton': function(event){
			event.preventDefault();
			this.jumpToPage(this.$el.find(".link-select select").val());
			return false;
		}
	},
	setupLinkingPages: function(){
		var viewHandle = this;
		this.linkingPages.reset();
		Adventure.activeAdventure.get("pages").each(function(page){
			page.get("actions").each(function(action){
				if (action.get("nextPageID") == viewHandle.model.id){
					viewHandle.linkingPages.add(page);
				}
			});
		});
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
	},
	jumpToPage: function(pageID){
		var viewHandle = this;
		this.model.save(
			Adventure.generateFormMap(this.$el.find("form")),
			Adventure.saveResponseHandlersWithoutRemoval(function(){
				viewHandle.model = Adventure.activeAdventure.get("pages").get(pageID);
				viewHandle.setupLinkingPages();
				viewHandle.render();
			})
		);
	}
});
Adventure.PageButton = Marionette.ItemView.extend({
	template: 'PageButton',
	className: 'selection',
	initialize: function(){
		this.listenTo(Adventure.activeAdventure.get('images'), 'change destroy', this.render);
	},
	onRender: function(){
		this.$el.attr("data-scene",this.model.get("sceneID"));
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
			Adventure.Main.renderPageEdit(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.PageList = Marionette.CollectionView.extend({
	childView: Adventure.PageButton,
	viewComparator: function(model){
		return int(model.get('ID'));
	}
});