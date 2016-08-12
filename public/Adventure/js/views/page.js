Adventure.PageOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.$el.val(this.model.get("ID"));
	}
});
Adventure.PageSelect = Marionette.CollectionView.extend({	
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.PageOption,
	initialize: function() {
		this.collection = Adventure.activeAdventure.get('pages');
		this.$el.attr("name",this.getOption("name") == undefined ? "pageID" : this.getOption("name"));
	},
	onRender: function(){
		var pageSelectView = this;		
		this.$el.prepend("<option value='0'>Same Page</option>");
		this.$el.append("<option value='new'>New Page...</option>");
		this.$el.change(function(){
			var selectHandle = this;
			if($(this).val() == 'new'){	
				var selectBox = $(this);			
				pageSelectView.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
					success:function(model){
						model.initSubItems();
						Adventure.Main.renderPageEditLite(model);
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
Adventure.PageEdit = Marionette.LayoutView.extend({	
	template: 'PageEdit',
	className: 'page-edit',
	regions: {sceneSelect:'.scene-selectbox',pageTypeSelect:'.pageType-selectbox',effectSelect:'.effect-selectbox',actionSelection:'.action-select .selections',eventSelection:'.event-select .selections'},
	initialize: function(){
		if(this.getOption("lite")){
			this.template = 'PageEditLite';
		}
	},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.$el.find('.header-key').hide();
		this.showChildView('sceneSelect', new Adventure.SceneSelect({selected: this.model.get("sceneID")}));
		this.showChildView('pageTypeSelect', new Adventure.PageTypeSelect({selected: this.model.get("pageTypeID")}));
		this.showChildView('effectSelect', new Adventure.EffectSelect({selected: this.model.get("effectID")}));
		if(!this.getOption("lite")){
			this.showChildView('actionSelection', new Adventure.ActionList({collection: this.model.get('actions'), pageView: this}));
			this.showChildView('eventSelection', new Adventure.PageEventList({collection: this.model.get('pageEvents')}));
		}

		this.$el.find(".image-button").click(function(event){			
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'),viewHandle);
			return false;
		});
		if(!this.getOption("lite")){
			this.$el.find(".new-action-button").click(function(event){			
				event.preventDefault();
				viewHandle.model.get("actions").create({pageID:viewHandle.model.id},{wait: true, validate: false, 
					success:function(model){
						model.initSubItems();
						Adventure.Main.renderActionEdit(model);					
					}
				});						
				return false;
			});
			this.$el.find(".new-event-button").click(function(event){			
				event.preventDefault();
				viewHandle.model.get("pageEvents").create({pageID:viewHandle.model.id},{wait: true, validate: false, 
					success:function(model){
						Adventure.Main.renderPageEventEdit(model);
					}
				});					
				return false;
			});
		}
		this.$el.find(".save-button").click(function(event){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));	
			return false;
		});
		this.$el.find(".delete-button").click(function(event){
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"page");
			return false;
		});
	},
	setImage: function(imageID){
		if (imageID == 0 || imageID == '' || imageID == null){
			this.$el.find(".image-button > img").attr("src",'img/builder/icons/image.png');
		}else{
			this.model.set("imageID",imageID);
			this.$el.find("[name=imageID]").val(imageID);
			this.$el.find(".image-button > img").attr("src",'uploads/'+Adventure.activeAdventure.get('images').get(imageID).get('URL'));
		}
	},
	jumpToPage: function(pageID){
		var viewHandle = this;
		this.model.save(
			Adventure.generateFormMap(this.$el.find("form")),
			Adventure.saveResponseHandlersWithoutRemoval(function(){
				viewHandle.model = Adventure.activeAdventure.get("pages").get(pageID);
				viewHandle.render();
			})
		);			
	}
});
Adventure.PageButton = Marionette.ItemView.extend({
	template: 'PageButton',
	className: 'selection',
	initialize: function(){
		var pageModel = this.model;
		this.listenTo(this.model, 'change', this.render);		
		this.$el.click(function(event){	
			Adventure.Main.renderPageEdit(pageModel);
		});
	},
	onRender: function(){
		this.$el.attr("data-scene",this.model.get("sceneID"));
		if(parseInt(this.model.get("imageID")) > 0){
			this.$el.find(".select-image").attr("src","uploads/"+Adventure.activeAdventure.get("images").get(this.model.get("imageID")).get("URL"));
		}
	}
});
Adventure.PageList = Marionette.CollectionView.extend({
	childView: Adventure.PageButton,
});