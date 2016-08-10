Adventure.SceneOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.$el.val(this.model.get("ID"));
	}
});
Adventure.SceneSelect = Marionette.CollectionView.extend({	
	tagName: 'select',
	className: 'form-control',
	childView: Adventure.SceneOption,
	initialize: function() {
		var sceneSelectView = this;
		this.collection = Adventure.activeAdventure.get('scenes');
		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(Adventure.activeAdventure.get("pages"), 'change', this.render);
		this.filterSelection = '';
		if(this.getOption("filterBase") != undefined && this.getOption("filterElement") != undefined){			
			this.$el.addClass("scene-filter");
			this.$el.prepend("<option value=''>Show All</option><option value='0'>Unassigned</option>");			
			this.$el.change(function(){
				var filterElements = sceneSelectView.getOption("filterBase").find(sceneSelectView.getOption("filterElement"));
				sceneSelectView.filterSelection = sceneSelectView.$el.val();
				if(sceneSelectView.$el.val() === ''){
					filterElements.show();
				}else{
					filterElements.hide();
					filterElements.filter("[data-scene='"+sceneSelectView.$el.val()+"']").show();
				}
			});
		}else{
			this.$el.attr("name","sceneID");			
			this.$el.change(function(){
				var selectHandle = this;
				if($(this).val() == 'new'){				
					sceneSelectView.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
						success:function(model){
							model.initSubItems();
							Adventure.Main.renderSceneEdit(model);
							$(selectHandle).val(model.id);
						}
					});
				}
			});
		}
	},
	onRender: function(){
		var sceneSelectView = this;
		if(this.getOption("filterBase") != undefined && this.getOption("filterElement") != undefined){			
			this.$el.val(this.filterSelection);
			this.$el.change();				
		}else{
			this.$el.prepend("<option value='0'>Select Scene</option>");
			this.$el.append("<option value='new'>New Scene...</option>");
			if(this.getOption("selected") !== ""){
				this.$el.val(this.getOption("selected"));
			}
		}
	}
});
Adventure.SceneButton = Marionette.ItemView.extend({
	template: 'SceneButton',
	className: 'selection',
	initialize: function() {
		var sceneModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		this.$el.click(function(){
			Adventure.Main.renderSceneEdit(sceneModel);
		});
	}
});
Adventure.SceneList = Marionette.CollectionView.extend({
	childView: Adventure.SceneButton,
	initialize: function() {
		console.log(this);
		this.collection.on('add', this.append);
	}
});
Adventure.SceneSelection = Marionette.LayoutView.extend({	
	template: 'SceneSelection',
	className: 'scene-selection',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.SceneList({collection: this.collection}));
		this.$el.find(".new-button").click(function(){			
			event.preventDefault();
			viewHandle.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
				success:function(model){
					model.initSubItems();
					Adventure.Main.renderSceneEdit(model);
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
Adventure.SceneEdit = Marionette.LayoutView.extend({	
	template: 'SceneEdit',
	className: 'scene-edit',
	regions: {actionSelection:'.action-select .selections',eventSelection:'.event-select .selections'},
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.showChildView('actionSelection', new Adventure.ActionList({collection: this.model.get('actions')}));
		this.showChildView('eventSelection', new Adventure.SceneEventList({collection: this.model.get('sceneEvents')}));
		this.$el.find(".new-action-button").click(function(){			
			event.preventDefault();
			viewHandle.model.get("actions").create({sceneID:viewHandle.model.id},{wait: true, validate: false, 
				success:function(model){
					model.initSubItems();
					Adventure.Main.renderActionEdit(model);
				}
			});						
			return false;
		});
		this.$el.find(".new-event-button").click(function(){			
			event.preventDefault();
			viewHandle.model.get('sceneEvents').create({sceneID:viewHandle.model.id},{wait: true, validate: false, 
				success:function(model){
					Adventure.Main.renderSceneEventEdit(model);
				}
			});					
			return false;
		});
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));				
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"scene");
			return false;
		});
	}
});