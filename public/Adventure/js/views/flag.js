Adventure.FlagOption = Marionette.ItemView.extend({
	template: 'Option',
	tagName: 'option',	
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.$el.val(this.model.get("ID"));
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
		var flagSelectView = this;
		this.$el.attr("name",this.getOption("name") == undefined ? "flagID" : this.getOption("name"));
		this.$el.prepend("<option value='0'>Select Flag</option>");
		this.$el.append("<option value='new'>New Flag...</option>");
		this.$el.change(function(){
			var selectHandle = this;
			if($(this).val() == 'new'){	
				var selectBox = $(this);			
				flagSelectView.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
					success:function(model){
						Adventure.Main.renderFlagEdit(model);
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
Adventure.FlagEdit = Marionette.LayoutView.extend({	
	template: 'FlagEdit',
	className: 'flag-edit',
	onRender: function() {
		var viewHandle = this;
		this.model.form = this.$el.find("form");
		this.$el.find("[name='isCounter']").change(function(){
			viewHandle.$el.find(".counter-group").toggle(viewHandle.$el.find("[name='isCounter']:checked").length == 1);
		}).change();
		this.$el.find(".image-button").click(function(){			
			event.preventDefault();
			Adventure.Main.renderImageSelection(Adventure.activeAdventure.get('images'),viewHandle);
			return false;
		});
		this.$el.find(".save-button").click(function(){			
			event.preventDefault();
			viewHandle.model.save(Adventure.generateFormMap(viewHandle.$el.find("form")),Adventure.saveResponseHandlers(viewHandle));				
			return false;
		});
		this.$el.find(".delete-button").click(function(){			
			event.preventDefault();
			Adventure.deleteDialog(viewHandle,"flag");
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
	}
});
Adventure.FlagButton = Marionette.ItemView.extend({
	template: 'FlagButton',
	className: 'selection',
	initialize: function() {
		var flagModel = this.model;
		this.listenTo(this.model, 'change', this.render);
		this.$el.click(function(){
			Adventure.Main.renderFlagEdit(flagModel);
		});
	}
});
Adventure.FlagList = Marionette.CollectionView.extend({
	childView: Adventure.FlagButton,
});
Adventure.FlagSelection = Marionette.LayoutView.extend({	
	template: 'FlagSelection',
	className: 'flag-selection',
	regions: {selectionView:'.selections'},
	onRender: function() {
		var viewHandle = this;
		this.showChildView('selectionView', new Adventure.FlagList({collection: this.collection}));
		this.$el.find(".new-button").click(function(){			
			event.preventDefault();
			viewHandle.collection.create({adventureID:Adventure.activeAdventure.id},{wait: true, validate: false, 
				success:function(model){
					Adventure.Main.renderFlagEdit(model);
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