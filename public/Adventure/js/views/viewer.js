Adventure.Viewer = Marionette.LayoutView.extend({
	el: '#adventure',
	template: 'Viewer',
	currentPageType: "normal",
	startingPage: 0,
	regions: {
		imageA: '.image-container.page-A',
		imageB: '.image-container.page-B',
		pageA: '.page-body.page-A',
		pageB: '.page-body.page-B',
		inventory:'.inventory-container',
		actionsA: '.actions.page-A',
		actionsB: '.actions.page-B'
	},
	initialize: function(){
		this.model = new Adventure.AdventureViewingModel({hashKey: this.$el.attr("data-adventure")});
		this.variables = {
			flags: []
		};
		this.transitionData = {};
		this.inventorySet = new Adventure.Flags;
		this.side  = 'A';
		this.otherSide  = 'B';
		this.blankHeight = 0;
		this.listenTo(this.model, 'sync', function(){
			this.resetVariables();
			this.resetTransitionData();
			this.$el.prepend(this.model.get("effects").assembleKeyframes());
			this.loadPage(this.variables.startingPage);
			this.$el.find('.page-manager').height(this.$el.find('.page-manager .page-'+this.side).innerHeight());
			this.$el.find('.action-manager').height(this.$el.find('.action-manager .page-'+this.side).outerHeight(true));
			this.resizeBox();
		});
		var viewHandle = this;
		$(window).on('resize', function(){
			viewHandle.resizeBox();
		});
		this.render();
	},
	onRender: function(){
		var viewHandle = this;
		this.showChildView('inventory', new Adventure.Inventory({collection: this.inventorySet}));
		this.$el.find(".adventure-background-transition").hide();
		//this.$el.find(".page-B").hide();
		//Temporary
		this.$el.find(".adventure-container").click(function(event){
			viewHandle.backgroundTransition("goodEnding");
		});
		this.resizeBox();
	},
	resetVariables: function(){
		var viewHandle = this;
		this.variables.startingPage = this.model.get("pages").models[0].id;
		this.variables.currentPage = 0;
		this.variables.storedPage = 0;
		this.model.get("flags").each(function(flag){
			viewHandle.variables.flags[int(flag.id)] = int(flag.get("isCounter")) ? int(flag.get("counterDefault")) || 0 : 0;
			if(int(flag.get("isItem"))){
				viewHandle.inventorySet.add(flag);
			}
		});
	},
	resetTransitionData: function(){
		this.transitionData.transitioning = false;
		this.transitionData.nextPageID = 0;
		this.transitionData.effectID = 0;
		this.transitionData.transitionID = 0;
		this.transitionData.beforePageText = "";
		this.transitionData.afterPageText = "";
		this.transitionData.randomRoll = 0;
	},
	beginTransition: function(){
		this.resizeBox();
		if(this.transitionData.effectID > 0){
			var transitionEffect = this.model.get("effects").get(this.transitionData.effectID);
			if(transitionEffect){
				transitionEffect.applyEffect(this.$el.find('.image-manager .page-'+this.side));
				console.log(transitionEffect.get("duration") +' '+ transitionEffect.get("loops") +' '+ 1000);
				_.delay(function(viewHandle){
					viewHandle.handleTransition();
				}, transitionEffect.get("duration") * transitionEffect.get("loops") * 1000, this);
			}else{
				this.handleTransition();
			}
		}else{
			this.handleTransition();
		}
	},
	handleTransition: function(){
		var viewHandle = this;
		this.transitionData.transitioning = true;
		this.otherSide = this.side;
		this.side = this.side == 'A' ? 'B' : 'A';
		if(this.transitionData.nextPageID == 0){
			this.loadPage(this.variables.currentPage);
		}else{
			this.loadPage(this.transitionData.nextPageID);
		}
		this.$el.find('.image-manager .page-'+this.side).css("z-index",2);
		this.$el.find('.image-manager .page-'+this.otherSide).css("z-index",1);
		this.$el.find('.image-manager .page-'+this.side).fadeIn(1000,function(){
			viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
			viewHandle.resetTransitionData();
		});
		//console.log(this.$el.find('.page-manager .page-'+this.side).innerHeight());
		this.$el.find('.page-manager .page-'+this.side).css("top", "100%");
		this.$el.find('.page-manager').animate({height: this.$el.find('.page-manager .page-'+this.side).innerHeight()+"px"}, 1000);
		this.$el.find('.page-manager .page-'+this.side).animate({top: "0%"}, 1000);
		this.$el.find('.page-manager .page-'+this.otherSide).animate({top: "-100%"}, 1000);

		this.$el.find('.action-manager .page-'+this.side).show().css("left", "100%").fadeOut(750, function(){
			viewHandle.$el.find('.action-manager .page-'+viewHandle.side).css("left", "0%").fadeIn(250);
		});
		this.$el.find('.action-manager .page-'+this.otherSide).fadeOut(250);
		this.$el.find('.action-manager').animate({height: this.$el.find('.action-manager .page-'+this.side).outerHeight(true)+"px"}, 1000);

		var boxHeight = this.blankHeight + this.$el.find('.image-manager .page-'+this.side).innerHeight() + this.$el.find('.page-manager .page-'+this.side).innerHeight() + this.$el.find('.action-manager .page-'+this.side).outerHeight(true) + this.$el.find('.inventory-container').outerHeight(true);
		if (boxHeight % 16 > 0){
			boxHeight += 16 - (boxHeight % 16);
		}
		this.$el.find(".adventure-box").animate({height: boxHeight + "px"});

		//this.resizeBox();
	},
	loadPage: function(pageID){
		pageModel = this.model.get("pages").get(pageID);
		this.showChildView('image'+this.side, new Adventure.ViewerImage({model: this.model.get("images").get(pageModel.get("imageID")), effect: this.model.get("effects").get(pageModel.get("effectID"))}));
		this.showChildView('page'+this.side, new Adventure.ViewerPage({model: pageModel}));
		this.showChildView('actions'+this.side, new Adventure.ViewerActionList({collection: pageModel.get("actions")}));
		this.variables.currentPage = pageID;
	},
	backgroundTransition: function(nextClass){
		var viewHandle = this;
		this.$el.find(".adventure-background-transition").addClass(nextClass);
		this.$el.find(".adventure-background-transition").fadeIn(400,function(){
			viewHandle.$el.find(".adventure-background").removeClass(viewHandle.currentPageType);
			viewHandle.$el.find(".adventure-background").addClass(nextClass);
			viewHandle.$el.find(".adventure-background-transition").removeClass(nextClass);
			viewHandle.$el.find(".adventure-background-transition").hide();
			viewHandle.currentPageType = nextClass;
		});
	},
	performAction: function(actionModel){
		if(!this.transitionData.transitioning){
			if(actionModel.get("actionEvents").length){
				this.handleEvents(actionModel.get("actionEvents"));
			}
			if(int(actionModel.get("nextPageID")) > 0 && !this.transitionData.nextPageID){
				this.transitionData.nextPageID = actionModel.get("nextPageID");
			}
			if(int(actionModel.get("effectID")) > 0){
				this.transitionData.effectID = actionModel.get("effectID");
			}
			if(int(actionModel.get("transitionID")) > 0){
				this.transitionData.transitionID = actionModel.get("transitionID");
			}
			this.beginTransition();
		}
	},
	handleEvents: function(eventLinkCollection){
		var viewHandle = this;
		this.transitionData.randomRoll = Math.floor((Math.random() * 101));
		eventLinkCollection.every(function(eventLink){
			var eventModel = viewHandle.model.get("events").get(eventLink.get("eventID"));
			if (viewHandle.evaluateCondition(eventModel.get("conditionID"),eventModel.get("conditionFlagID"),eventModel.get("counterValue"),eventModel.get("counterUpperValue"))){
				//Append page text
				viewHandle.transitionData.beforePageText = "";
				viewHandle.transitionData.afterPageText = "";
				//Handle event action
				switch(int(eventModel.get("eventTypeID"))){
					case 2:
						viewHandle.variables.flags[int(eventModel.get("flagID"))] = 1;
						break;
					case 3:
						viewHandle.variables.flags[int(eventModel.get("flagID"))] = 0;
						break;
					case 4:
						viewHandle.variables.flags[int(eventModel.get("flagID"))] = int(eventModel.get("value"));
						break;
					case 5:
						viewHandle.variables.flags[int(eventModel.get("flagID"))] += int(eventModel.get("value"));
						break;
					case 6:
						if(!viewHandle.transitionData.nextPageID){
							viewHandle.transitionData.nextPageID = eventModel.get("pageID");
						}
						break;
					case 7:
						viewHandle.variables.storedPage = viewHandle.variables.currentPage;
						break;
					case 8:
						if(!viewHandle.transitionData.nextPageID){
							viewHandle.transitionData.nextPageID = viewHandle.variables.storedPage;
						}
						break;
					case 9:
						return false; //Stop executing events
				}
				//Handle counter bounds
				if(eventModel.get("flagID")){
					if(int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("isCounter"))){
						var minimum = (viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMinimum") != null) ? int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMinimum")) : null;
						var maximum = (viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMaximum") != null) ? int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMaximum")) : null;
						if(int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterWraps")) && minimum != null && maximum != null){
							//Wrapping
							while(viewHandle.variables.flags[int(eventModel.get("flagID"))] < minimum){
								viewHandle.variables.flags[int(eventModel.get("flagID"))] += maximum - minimum;
							}
							while(viewHandle.variables.flags[int(eventModel.get("flagID"))] > maximum){
								viewHandle.variables.flags[int(eventModel.get("flagID"))] -= maximum - minimum;
							}
						}else if(minimum != null && viewHandle.variables.flags[int(eventModel.get("flagID"))] < minimum){
							viewHandle.variables.flags[int(eventModel.get("flagID"))] = minimum;
						}else if(maximum != null && viewHandle.variables.flags[int(eventModel.get("flagID"))] > maximum){
							viewHandle.variables.flags[int(eventModel.get("flagID"))] = maximum;
						}
					}
					//viewHandle.model.get("flags").get(eventModel.get("flagID")).trigger('change');
				}
			}
			return true;
		});
		this.inventorySet.trigger("change");
	},
	evaluateCondition: function(conditionID,flagID,value,upperValue){
		var flagValue = this.variables.flags[int(flagID)] || 0;
		value = int(value);
		upperValue = int(upperValue);
		switch(int(conditionID)){
			case 2:
				return flagValue;
				break;
			case 3:
				return !flagValue;
				break;
			case 4:
				return flagValue == value;
				break;
			case 5:
				return flagValue < value;
				break;
			case 6:
				return flagValue <= value;
				break;
			case 7:
				return flagValue > value;
				break;
			case 8:
				return flagValue >= value;
				break;
			case 9:
				return flagValue >= value && flagValue <= upperValue;
				break;
			case 10:
				return !(flagValue >= value && flagValue <= upperValue);
				break;
			case 11:
				return this.transitionData.randomRoll >= value && this.transitionData.randomRoll <= upperValue;
				break;
			default: return true;
		}
	},
	resizeBox: function(){
		//This resizes the box based on the window width, and constrains the dimensions to multiples of 16.
		//It is intended to make the NES-inspired theme look correct, especially the border bricks.

		var boxWidth = Math.min($(".adventure-container").width(), 640);
		$(".adventure-box").width(Math.max(boxWidth - (boxWidth % 16), 160));
		//$('.page-manager').height($('.page-manager .page-'+this.side).innerHeight());
		var boxHeight = $(".adventure-content").innerHeight();
		if (boxHeight % 16 > 0){
			$(".adventure-box").height(boxHeight + 16 - (boxHeight % 16));
		}
		this.blankHeight = this.$el.find(".adventure-box").height() - this.$el.find('.image-manager .page-'+this.side).innerHeight() - this.$el.find('.page-manager .page-'+this.side).innerHeight() - this.$el.find('.action-manager .page-'+this.side).outerHeight(true) - this.$el.find('.inventory-container').outerHeight(true);
	},
	onDestroy: function(){
		$(window).off('resize load',this.resizeBox);
	}
});

Adventure.ViewerImage = Marionette.ItemView.extend({
	template: 'ViewerImage',
	onRender: function(){
		this.$el.find("img").attr("src",Adventure.assetPath+"uploads/"+this.model.get("URL"));
		this.$el.find("img").css("transform","translateX(-"+this.model.get("centerX")+") translateY(-"+this.model.get("centerY")+") scale("+this.model.get("scale")+")");
		this.$el.find("img").css("-webkit-transform","translateX(-"+this.model.get("centerX")+") translateY(-"+this.model.get("centerY")+") scale("+this.model.get("scale")+")");
		this.$el.find("img").css("-ms-transform","translateX(-"+this.model.get("centerX")+") translateY(-"+this.model.get("centerY")+") scale("+this.model.get("scale")+")");
		if(this.getOption('effect')){
			this.getOption('effect').applyEffect(this.$el.find("img"));
		}
	}
});

Adventure.ViewerPage = Marionette.ItemView.extend({
	template: 'ViewerPage'/*,
	currentPageType: "normal",
	regions: {inventory:'.inventory-container', actionList:'.actions'},
	initialize: function(){
		this.model.set("filteredText",this.model.get('text').replace(/\r?\n/g,'<br>'));
	},
	onRender: function(){
		var viewHandle = this;
		this.showChildView('actionList', new Adventure.ViewerActionList({collection: this.model.get("actions")}));
		this.showChildView('inventory', new Adventure.Inventory({collection: Adventure.viewer.inventorySet}));
		this.renderImage();
		if(int(this.model.get('effectID')) > 0){
			Adventure.activeAdventure.get("effects").get(this.model.get("effectID")).applyEffect(this.$el.find(".image-container img"));
		}
	},
	renderImage: function(){
		var imageModel = Adventure.activeAdventure.get("images").get(this.model.get("imageID"));
		if(imageModel){
			this.$el.find(".image-container").show();
			this.$el.find(".image-container img").attr("src",Adventure.assetPath+"uploads/"+imageModel.get("URL"));
			this.$el.find(".image-container img").css("transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
			this.$el.find(".image-container img").css("-webkit-transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
			this.$el.find(".image-container img").css("-ms-transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
		}else{
			this.$el.find(".image-container").hide();
		}
	},
	onDestroy: function(){
		console.log("I regret nothing");
	}*/
});

Adventure.ViewerActionButton = Marionette.ItemView.extend({
	template: 'ViewerActionButton',
	className: 'selection',
	events: {
		'click': function(event){
			event.preventDefault();
			Adventure.viewer.performAction(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.ViewerActionList = Marionette.CollectionView.extend({
	className: 'selection-list',
	childView: Adventure.ViewerActionButton
});

Adventure.InventoryItem = Marionette.ItemView.extend({
	template: 'InventoryItem',
	className: 'item',
	initialize: function(){
		if(this.model.get("description")){
			this.$el.attr("title",this.model.get("description"));
			this.$el.attr("alt",this.model.get("description"));
		}
	},
	onRender: function(){
		this.renderImage();
		if(int(this.model.get("isCounter"))){
			this.$el.find(".quantity").html(Adventure.viewer.variables.flags[this.model.id]);
		}
		//this.$el.toggle(Adventure.viewer.variables.flags[this.model.id] > 0);
	},
	events: {
		'click': function(event){
			event.preventDefault();
			//Adventure.viewer.performAction(this.model);
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	},
	renderImage: function(){
		var imageModel = Adventure.activeAdventure.get("images").get(this.model.get("imageID"));
		if(imageModel){
			this.$el.find("img").show();
			this.$el.find("img").attr("src",Adventure.assetPath+"uploads/"+imageModel.get("URL"));
			this.$el.find("img").css("transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
			this.$el.find("img").css("-webkit-transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
			this.$el.find("img").css("-ms-transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
		}else{
			this.$el.find("img").hide();
		}
	}
});
Adventure.Inventory = Marionette.CollectionView.extend({
	className: 'inventory',
	childView: Adventure.InventoryItem,
	filter: function (child, index, collection) {
		return Adventure.viewer.variables.flags[child.id] > 0;
	},
	onRender: function(){
		this.$el.toggle(this.$el.find(".item").length > 0);
	},
	collectionEvents: {
		'change': 'render'
	}
});

//TODO:
//		Try adding a transitional value to the inventory window size