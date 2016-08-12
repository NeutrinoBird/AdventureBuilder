Adventure.LayerView = Marionette.LayoutView.extend({
	template: 'Layer',
	regions: {layerView:'.layer-view'},
	className: 'layer',
	onRender: function(){
		this.showChildView('layerView', this.model.get('view'));
		this.$el.find(".layer-view").css("top",($("body").scrollTop()+40+30*this.model.get("ID"))+"px");
	}
});
Adventure.MainView = Marionette.CollectionView.extend({
	childView: Adventure.LayerView,	
	el: '#main',	
	collection: new Backbone.Collection(),
	layerCollection: [],
	viewLevel: 0,	
	initialize: function() {
		this.renderLogin();
		this.render();
	},
	renderLogin: function(){		
		this.addLayer(new Adventure.Login());
	},
	renderSessionLogin: function(){		
		this.addLayer(new Adventure.SessionLogin());
	},
	renderNewUser: function(){		
		this.addLayer(new Adventure.NewUser());
	},
	renderAdventureList: function(){		
		this.addLayer(new Adventure.AdventureList({collection: Adventure.Menu}));
	},
	renderAdventureEdit: function(adventureModel){		
		this.addLayer(new Adventure.AdventureEdit({model: adventureModel}));
	},
	renderPageEdit: function(pageModel){
		this.addLayer(new Adventure.PageEdit({model: pageModel}));	
	},
	renderPageEditLite: function(pageModel){
		this.addLayer(new Adventure.PageEdit({model: pageModel, lite: true}));
	},
	renderPageEventEdit: function(pageEventModel){
		this.addLayer(new Adventure.PageEventEdit({model: pageEventModel}));
	},
	renderActionEdit: function(actionModel){
		this.addLayer(new Adventure.ActionEdit({model: actionModel}));
	},
	renderActionEventEdit: function(actionEventModel){
		this.addLayer(new Adventure.ActionEventEdit({model: actionEventModel}));
	},
	renderActionFlagRequirementEdit: function(actionFlagRequirementModel){
		this.addLayer(new Adventure.ActionFlagRequirementEdit({model: actionFlagRequirementModel}));
	},
	renderActionFlagRequirementEventEdit: function(actionFlagRequirementEventModel){
		this.addLayer(new Adventure.ActionFlagRequirementEventEdit({model: actionFlagRequirementEventModel}));
	},
	renderSceneSelection: function(sceneCollection){
		this.addLayer(new Adventure.SceneSelection({collection: sceneCollection}));
	},
	renderSceneEdit: function(sceneModel){
		this.addLayer(new Adventure.SceneEdit({model: sceneModel}));
	},
	renderSceneEventEdit: function(sceneEventModel){
		this.addLayer(new Adventure.SceneEventEdit({model: sceneEventModel}));
	},
	renderFlagSelection: function(flagCollection){
		this.addLayer(new Adventure.FlagSelection({collection: flagCollection}));
	},
	renderFlagEdit: function(flagModel){
		this.addLayer(new Adventure.FlagEdit({model: flagModel}));
	},
	renderEffectSelection: function(effectCollection){
		this.addLayer(new Adventure.EffectSelection({collection: effectCollection}));
	},
	renderEffectEdit: function(effectModel){
		this.addLayer(new Adventure.EffectEdit({model: effectModel}));
	},
	renderImageSelection: function(imageCollection, parentView){		
		this.addLayer(new Adventure.ImageSelection({collection: imageCollection, parentView: parentView}));
	},
	renderImageEdit: function(imageModel){
		this.addLayer(new Adventure.ImageEdit({model: imageModel}));
	},
	renderImageUpload: function(imageModel){
		this.addLayer(new Adventure.ImageUpload({model: imageModel}));
	},
	addLayer: function(view){
		this.collection.push({ID: this.collection.length+1, view: view});
	},
	removeLayer: function(){
		this.collection.pop();
		if(this.collection.length == 1){
			Adventure.activeAdventure = null;
		}
	},
	initiateRemoval: function(view, callback){
		var mainView = this;
		view.$el.addClass("removing");
		setTimeout(function(){
			mainView.removeLayer();			
			view.remove();
			if(typeof callback == 'function') callback();
		}, 495);
	},	
	initiateAdventureList: function(view){
		var mainView = this;
		view.$el.addClass("removing");
		setTimeout(function(){
			mainView.removeLayer();			
			view.remove();
			Adventure.Menu = new Adventure.Adventures();
			Adventure.Menu.fetch({
				success: function(){
					Adventure.Menu.addNewOption();
					Adventure.initStatic();
					mainView.renderAdventureList();
					Adventure.Options.render();
				},
				error: function(model, response, options){
					Adventure.handleInvalidInput(response.responseJSON);
				}
			});
			
		}, 100);
	}
});

Adventure.StatusDisplay = Marionette.LayoutView.extend({
	template: 'StatusDisplay',
	el: '.status-icon',
	initialize: function() {
		this.render();
		var viewHandle = this;		
		this.$el.find(".success").hide();
		this.$el.find(".error").hide();
		this.$el.find(".loading").hide();
		$(document).ajaxSuccess(function(){
			viewHandle.showSuccess();
		});
		$(document).ajaxError(function(){
			viewHandle.showError();
		});
		$(document).ajaxSend(function(){
			viewHandle.showLoading();
		});
		this.successTimer = setTimeout(function(){}, 10);
		this.errorTimer = setTimeout(function(){}, 10);
	},
	showSuccess: function(){
		var viewHandle = this;	
		this.$el.find(".loading").hide();
		this.$el.find(".success").hide(); //reset animation
		clearTimeout(this.successTimer);
		setTimeout(function(){
			viewHandle.$el.find(".success").show();
			viewHandle.successTimer = setTimeout(function(){
				viewHandle.$el.find(".success").hide();
			}, 4000);
		}, 50);
	},
	showError: function(){
		var viewHandle = this;	
		this.$el.find(".loading").hide();
		this.$el.find(".error").hide(); //reset animation		
		clearTimeout(this.errorTimer);
		setTimeout(function(){
			viewHandle.$el.find(".error").show();
			viewHandle.errorTimer = setTimeout(function(){
				viewHandle.$el.find(".error").hide();
			}, 6000);
		}, 50);
	},
	showLoading: function(){
		this.$el.find(".loading").show();
	}
});

Adventure.OptionsMenu = Marionette.LayoutView.extend({	
	template: 'OptionsMenu',
	el: '#options-menu',
	onRender: function() {
		var viewHandle = this;		
		this.$el.find(".effect-button").click(function(event){			
			event.preventDefault();
			$("body").toggleClass("no-effect");
			$(this).html($("body.no-effect").length ? "Effects On" : "Effects Off");
			return false;
		});
		if(Adventure.admin){
			this.$el.find(".new-user-button").click(function(event){			
				event.preventDefault();
				if(Adventure.admin && $(".login").length == 0){
					Adventure.Main.renderNewUser();
				}
				return false;
			});
		}else{
			this.$el.find(".new-user-button").remove();
		}
	}
});

Adventure.Login = Marionette.LayoutView.extend({	
	template: 'Login',
	className: 'login',
	onRender: function() {
		var viewHandle = this;	
		this.$el.find(".login-button").click(function(event){			
			event.preventDefault();
			$.ajax({
				type: "POST",
				url: "services/user.php",
				data: {username: viewHandle.$el.find("[name='username']").val() ,password: viewHandle.$el.find("[name='password']").val()},
				success: function(response){
					Adventure.userID = response.userID;
					Adventure.admin = response.isAdmin;
					Adventure.Main.initiateAdventureList(viewHandle);
				},
				dataType: 'json'
			}).fail(function(response){
				viewHandle.$el.find(".errorRow").html(response.responseJSON.errorMsg);
			});
			return false;
		})
	}
});

Adventure.SessionLogin = Marionette.LayoutView.extend({	
	template: 'SessionLogin',
	className: 'login',
	onRender: function() {
		var viewHandle = this;	
		this.$el.find(".login-button").click(function(event){			
			event.preventDefault();
			$.ajax({
				type: "POST",
				url: "services/user.php",
				data: {username: viewHandle.$el.find("[name='username']").val() ,password: viewHandle.$el.find("[name='password']").val()},
				success: function(response){
					if (Adventure.userID != response.userID){
						location.reload();
					}else{
						Adventure.Main.initiateRemoval(viewHandle);
					}					
				},
				dataType: 'json'
			}).fail(function(response){
				viewHandle.$el.find(".errorRow").html(response.responseJSON.errorMsg);
			});
			return false;
		});		
	}
});

Adventure.NewUser = Marionette.LayoutView.extend({	
	template: 'NewUser',
	className: 'login',
	onRender: function() {
		var viewHandle = this;	
		this.$el.find(".login-button").click(function(event){			
			event.preventDefault();
			$.ajax({
				type: "POST",
				url: "services/newUser.php",
				data: {username: viewHandle.$el.find("[name='username']").val() ,password: viewHandle.$el.find("[name='password']").val()},
				success: function(response){
					Adventure.Main.initiateRemoval(viewHandle);
				},
				dataType: 'json'
			}).fail(function(response){
				viewHandle.$el.find(".errorRow").html(response.responseJSON.errorMsg);
			});
			return false;
		})
		this.$el.find(".close-button").click(function(event){			
			event.preventDefault();
			Adventure.Main.initiateRemoval(viewHandle);
			return false;
		});
	}
});