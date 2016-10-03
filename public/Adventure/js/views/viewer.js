Adventure.Viewer = Marionette.LayoutView.extend({
	el: '#adventure',
	template: 'Viewer',
	currentPageType: "normal",
	startingPage: 0,
	transitionData: {},
	side: 'A',
	otherSide: 'B',
	blankHeight: 0,
	regions: {
		imageA: '.image-container.page-A',
		imageB: '.image-container.page-B',
		pageA: '.page-body.page-A',
		pageB: '.page-body.page-B',
		inventory:'.inventory-container',
		actionsA: '.actions.page-A',
		actionsB: '.actions.page-B',
		loader: '.loader'
	},
	ui: {
		closeBox: '.adventure-background .close-box',
		overlay: '.overlay',
		closeYes: '.close-dialog .option-yes',
		closeNo: '.close-dialog .option-no'
	},
	initialize: function(){
		var viewHandle = this;
		Adventure.initStatic(function(){
			viewHandle.setup();
		});
	},
	setup: function(){
		this.model = new Adventure.AdventureViewingModel({hashKey: this.$el.attr("data-adventure")});
		this.variables = {
			flags: []
		};
		this.inventorySet = new Adventure.Flags;
		this.listenTo(this.model, 'sync', function(){
			this.resetVariables();
			this.resetTransitionData();
			this.$el.prepend(this.model.get("effects").assembleKeyframes());
			this.showChildView('loader', new Adventure.Loading({images: this.model.get("images")}));
			this.resizeBox();
		});
		var viewHandle = this;
		$(window).on('resize', function(){
			viewHandle.resizeBox();
		});
		this.render();
		this.$el.find(".adventure-box").hide();
	},
	loadComplete: function(){
		this.$el.find(".adventure-box").show();
		this.$el.find(".loader").fadeOut();
		this.transitionData.nextPageID = this.variables.startingPage;
		this.loadPage();
		this.resetTransitionData();
		this.$el.find('.image-manager .page-'+this.otherSide).hide();
		this.$el.find('.action-manager .page-'+this.otherSide).hide();
		this.$el.find('.page-manager').height(this.$el.find('.page-manager .page-'+this.side).innerHeight());
		this.$el.find('.action-manager').height(this.$el.find('.action-manager .page-'+this.side).outerHeight(true));
		this.trimActions();
		this.resizeBox();
	},
	onRender: function(){
		var viewHandle = this;
		this.showChildView('inventory', new Adventure.Inventory({collection: this.inventorySet}));
		this.$el.find(".adventure-background-transition").hide();
		this.$el.find(".adventure-box").css("top",$(window).scrollTop()+48+'px');
		this.resizeBox();
	},
	events: {
		'click @ui.closeBox': function(){
			this.$el.find(".close-dialog").show();
		},
		'dblclick @ui.overlay': function(){
			this.$el.find(".close-dialog").show();
		},
		'click @ui.closeYes': function(){
			this.$el.find(".close-dialog").hide();
			this.$el.find(".adventure-container").addClass("closing");
			_.delay(function(viewHandle){
				viewHandle.destroy();
			}, 1000, this);
		},
		'click @ui.closeNo': function(){
			this.$el.find(".close-dialog").hide();
		}
	},
	resetVariables: function(){
		var viewHandle = this;
		this.variables.startingPage = this.model.get("pages").models[0].id;
		this.variables.currentPage = 0;
		this.variables.checkpointPage = 0;
		this.variables.storedPage = 0;
		this.model.get("flags").each(function(flag){
			viewHandle.variables.flags[int(flag.id)] = int(flag.get("isCounter")) ? int(flag.get("counterDefault")) || 0 : 0;
			if(int(flag.get("isItem"))){
				viewHandle.inventorySet.add(flag);
			}
		});
		this.savedVariables = JSON.parse(JSON.stringify(this.variables));
	},
	resetTransitionData: function(){
		this.transitionData.transitioning = false;
		this.transitionData.nextPageID = 0;
		this.transitionData.nextPageClass = "normal";
		this.transitionData.effectID = 0;
		this.transitionData.transitionID = 1;
		this.transitionData.beforePageText = "";
		this.transitionData.afterPageText = "";
		this.transitionData.randomRoll = 0;
		this.transitionData.setCheckpoint = false;
	},
	beginTransition: function(){
		this.resizeBox();
		if(this.transitionData.effectID > 0){
			var transitionEffect = this.model.get("effects").get(this.transitionData.effectID);
			if(transitionEffect){
				transitionEffect.applyEffect(this.$el.find('.image-manager .page-'+this.side+' img'));
				_.delay(function(viewHandle){
					viewHandle.$el.find('.image-manager .page-'+viewHandle.side+' img').css('animation','initial');
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
			this.transitionData.nextPageID = this.variables.currentPage;
		}
		this.loadPage();
		this.backgroundTransition(this.transitionData.nextPageClass);

		switch(int(this.transitionData.transitionID)){
			case 1:
				this.$el.find('.image-manager .page-'+this.otherSide).css('z-index',1);
				this.$el.find('.image-manager .page-'+this.side).css('z-index',2).fadeIn(1000,function(){
					viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
				});
				break;
			case 2:
				this.$el.find('.image-manager .page-'+this.side).show();
				this.$el.find('.image-manager .page-'+this.otherSide).hide();
				break;
			case 3:
				this.$el.find('.image-manager .blank').addClass('black').fadeIn(500, function(){
					viewHandle.$el.find('.image-manager .page-'+viewHandle.side).show();
					viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
					viewHandle.$el.find('.image-manager .blank').fadeOut(500, function(){
						$(this).removeClass('black');
					});
				});
				break;
			case 4:
				this.$el.find('.image-manager .blank').addClass('white').fadeIn(500, function(){
					viewHandle.$el.find('.image-manager .page-'+viewHandle.side).show();
					viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
					viewHandle.$el.find('.image-manager .blank').fadeOut(500, function(){
						$(this).removeClass('white');
					});
				});
				break;
			case 5:
				this.$el.find('.image-manager .page-'+this.side).show();
				this.$el.find('.image-manager .page-'+this.side+' div').css('left','-100%').animate({left: '0%'}, 1000);
				this.$el.find('.image-manager .page-'+this.otherSide+' div').animate({left: '100%'}, 1000, function(){
					$(this).css('left','0%');
					viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
				});
				break;
			case 6:
				this.$el.find('.image-manager .page-'+this.side).show();
				this.$el.find('.image-manager .page-'+this.side+' div').css('left','100%').animate({left: '0%'}, 1000);
				this.$el.find('.image-manager .page-'+this.otherSide+' div').animate({left: '-100%'}, 1000, function(){
					$(this).css('left','0%');
					viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
				});
				break;
			case 7:
				this.$el.find('.image-manager .page-'+this.side).show();
				this.$el.find('.image-manager .page-'+this.side+' div').css('top','-100%').animate({top: '0%'}, 1000);
				this.$el.find('.image-manager .page-'+this.otherSide+' div').animate({top: '100%'}, 1000, function(){
					$(this).css('top','0%');
					viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
				});
				break;
			case 8:
				this.$el.find('.image-manager .page-'+this.side).show();
				this.$el.find('.image-manager .page-'+this.side+' div').css('top','100%').animate({top: '0%'}, 1000);
				this.$el.find('.image-manager .page-'+this.otherSide+' div').animate({top: '-100%'}, 1000, function(){
					$(this).css('top','0%');
					viewHandle.$el.find('.image-manager .page-'+viewHandle.otherSide).hide();
				});
				break;
		}

		this.$el.find('.page-manager .page-'+this.side).css("top", "100%").css("bottom", "");;
		this.$el.find('.page-manager').animate({height: this.$el.find('.page-manager .page-'+this.side).innerHeight()+"px"}, 1000);
		this.$el.find('.page-manager .page-'+this.side).animate({top: "0%"}, 1000);
		this.$el.find('.page-manager .page-'+this.otherSide).css("top", "").animate({bottom: "100%"}, 1000);

		this.$el.find('.action-manager .page-'+this.side).show().css("left", "100%").fadeOut(750, function(){
			viewHandle.$el.find('.action-manager .page-'+viewHandle.side).css("left", "0%").fadeIn(250);
		});
		_.delay(function(viewHandle){
			viewHandle.trimActions();
		}, 751, this);
		this.$el.find('.action-manager .page-'+this.otherSide).fadeOut(250);
		this.$el.find('.action-manager').animate({height: this.$el.find('.action-manager .page-'+this.side).outerHeight(true)+"px"}, 1000, function(){
			viewHandle.resetTransitionData();
			viewHandle.$el.find(".adventure-manager").removeClass('transitioning');
		});

		var boxHeight = this.blankHeight + this.$el.find('.image-manager .page-'+this.side).innerHeight() + this.$el.find('.page-manager .page-'+this.side).innerHeight() + this.$el.find('.action-manager .page-'+this.side).outerHeight(true) + this.$el.find('.inventory-container').outerHeight(true);
		if (boxHeight % 16 > 0){
			boxHeight += 16 - (boxHeight % 16);
		}
		this.$el.find(".adventure-box").animate({height: boxHeight + "px"});
		this.$el.find(".adventure-manager").addClass('transitioning').animate({height: boxHeight - 16 + "px"});

		$("html, body").animate({ scrollTop: this.$el.find(".adventure-box").offset().top }, 500);
	},
	loadPage: function(){
		this.variables.currentPage = this.transitionData.nextPageID;
		pageModel = this.model.get("pages").get(this.transitionData.nextPageID);
		sceneModel = this.model.get("scenes").get(pageModel.get("sceneID"));
		if(sceneModel){
			sceneModel.get("actions").each(function(action){
				pageModel.get("actions").add(action);
			});
			sceneModel.get("sceneEvents").each(function(sceneEvent){
				pageModel.get("pageEvents").add({ID:'s_'+sceneEvent.id, priority:sceneEvent.get('priority'), eventID:sceneEvent.get('eventID')});
			});
		}
		this.handleEvents(pageModel.get("pageEvents"));
		if (this.transitionData.nextPageID != this.variables.currentPage){
			this.loadPage();
			return false;
		}
		this.transitionData.nextPageClass = Adventure.pageTypes.get(pageModel.get("pageTypeID")).get("style");
		if (this.transitionData.nextPageClass == 'checkpoint' || this.transitionData.setCheckpoint){
			this.variables.checkpointPage = this.transitionData.nextPageID;
			this.savedVariables = JSON.parse(JSON.stringify(this.variables));
			this.transitionData.beforePageText = Adventure.Templates.Checkpoint + this.transitionData.beforePageText;
		}
		if (this.transitionData.nextPageClass == 'death' || this.transitionData.nextPageClass == 'badEnding' || this.transitionData.nextPageClass == 'goodEnding'){
			if (this.transitionData.nextPageClass != 'goodEnding'){
				pageModel.get("actions").add({ID:'checkpoint', text:'Return to Checkpoint'});
			}
			pageModel.get("actions").add({ID:'restart', text:'Restart'});
		}
		this.showChildView('image'+this.side, new Adventure.ViewerImage({model: this.model.get("images").get(pageModel.get("imageID")), effect: this.model.get("effects").get(pageModel.get("effectID"))}));
		this.showChildView('page'+this.side, new Adventure.ViewerPage({model: pageModel, beforeText: this.transitionData.beforePageText, afterText: this.transitionData.afterPageText}));
		this.showChildView('actions'+this.side, new Adventure.ViewerActionList({collection: pageModel.get("actions")}));
	},
	backgroundTransition: function(nextClass){
		if (this.currentPageType != nextClass){
			var viewHandle = this;
			this.$el.find(".adventure-background-transition").addClass(nextClass);
			this.$el.find(".adventure-background-transition").fadeIn(1000,function(){
				viewHandle.$el.find(".adventure-background").removeClass(viewHandle.currentPageType);
				viewHandle.$el.find(".adventure-background").addClass(nextClass);
				viewHandle.$el.find(".adventure-background-transition").removeClass(nextClass);
				viewHandle.$el.find(".adventure-background-transition").hide();
				viewHandle.currentPageType = nextClass;
			});
		}
	},
	performAction: function(actionModel){
		if(!this.transitionData.transitioning){
			this.transitionData.randomRoll = Math.floor((Math.random() * 101));
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
	restart: function(){
		this.resetVariables();
		this.transitionData.nextPageID = this.variables.startingPage;
		this.transitionData.transitionID = 3;
		this.transitionData.randomRoll = Math.floor((Math.random() * 101));
		this.beginTransition();
	},
	returnToCheckpoint: function(){
		this.variables = JSON.parse(JSON.stringify(this.savedVariables));
		this.transitionData.nextPageID = this.variables.checkpointPage;
		this.transitionData.transitionID = 3;
		this.transitionData.randomRoll = Math.floor((Math.random() * 101));
		this.beginTransition();
	},
	handleEvents: function(eventLinkCollection){
		var viewHandle = this;
		eventLinkCollection.every(function(eventLink){
			var eventModel = viewHandle.model.get("events").get(eventLink.get("eventID"));
			var allowEvent = true;
			if(eventModel.get("eventFlagRequirements")){
				eventModel.get("eventFlagRequirements").every(function(requirement){
					requirement.updateName();
					if (!Adventure.conditions.get(requirement.get("conditionID")).evaluateCondition(viewHandle.variables.flags[int(requirement.get("flagID"))] || 0, requirement.get("counterValue"), requirement.get("counterUpperValue"), viewHandle.transitionData.randomRoll, viewHandle.variables.currentPage, requirement.get("pageID"), viewHandle.variables.flags[int(requirement.get("otherFlagID"))])){
						allowEvent = false;
						return false;
					}
					return true;
				});
			}
			if (allowEvent){
				//Append page text
				if (eventModel.get("textBefore") != ""){
					viewHandle.transitionData.beforePageText += eventModel.get("textBefore") + '<br><br>';
				}
				if (eventModel.get("textAfter") != ""){
					viewHandle.transitionData.afterPageText += '<br><br>' + eventModel.get("textAfter");
				}
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
						viewHandle.transitionData.nextPageID = eventModel.get("pageID");
						return false;
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
						break;
					case 10:
						viewHandle.transitionData.setCheckpoint = true;
				}
				//Handle counter bounds
				if(int(eventModel.get("flagID"))){
					if(int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("isCounter"))){
						var minimum = (viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMinimum") != null) ? int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMinimum")) : null;
						var maximum = (viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMaximum") != null) ? int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterMaximum")) : null;
						if(int(viewHandle.model.get("flags").get(eventModel.get("flagID")).get("counterWraps")) && minimum != null && maximum != null){
							//Wrapping
							while(viewHandle.variables.flags[int(eventModel.get("flagID"))] < minimum){
								viewHandle.variables.flags[int(eventModel.get("flagID"))] += (maximum - minimum + 1);
							}
							while(viewHandle.variables.flags[int(eventModel.get("flagID"))] > maximum){
								viewHandle.variables.flags[int(eventModel.get("flagID"))] -= (maximum - minimum + 1);
							}
						}else if(minimum != null && viewHandle.variables.flags[int(eventModel.get("flagID"))] < minimum){
							viewHandle.variables.flags[int(eventModel.get("flagID"))] = minimum;
						}else if(maximum != null && viewHandle.variables.flags[int(eventModel.get("flagID"))] > maximum){
							viewHandle.variables.flags[int(eventModel.get("flagID"))] = maximum;
						}
					}
				}
			}
			return true;
		});
		this.inventorySet.trigger("change");
	},
	trimActions: function(){
		this.$el.find('.action-manager .page-'+this.side+' .selection > div').each(function(){
			if($(this).find('p').length){
				$(this).css('width','100%');
				$(this).css('width',Math.min($(this).find('p').outerWidth()+27,$(this).outerWidth())+'px');
			}
		});
	},
	resizeBox: function(){
		//This resizes the box based on the window width, and constrains the dimensions to multiples of 16.
		//It is intended to make the NES-inspired theme look correct, especially the border bricks.

		var boxWidth = Math.min($(".adventure-container").width(), 640);
		$(".adventure-box").width(Math.max(boxWidth - (boxWidth % 16), 160));
		this.$el.find('.page-manager').height(this.$el.find('.page-manager .page-'+this.side).innerHeight());
		this.$el.find('.action-manager').height(this.$el.find('.action-manager .page-'+this.side).outerHeight(true));
		var boxHeight = $(".adventure-content").innerHeight();
		if (boxHeight % 16 > 0){
			$(".adventure-box").height(boxHeight + 16 - (boxHeight % 16));
		}else{
			$(".adventure-box").height(boxHeight);
		}
		this.blankHeight = this.$el.find(".adventure-box").height() - this.$el.find('.image-manager .page-'+this.side).innerHeight() - this.$el.find('.page-manager .page-'+this.side).innerHeight() - this.$el.find('.action-manager .page-'+this.side).outerHeight(true) - this.$el.find('.inventory-container').outerHeight(true);
		this.trimActions();
	},
	onDestroy: function(){
		$(window).off('resize load',this.resizeBox);
	}
});

Adventure.ViewerImage = Marionette.ItemView.extend({
	template: 'ViewerImage',
	onRender: function(){
		this.$el.find("img").attr("src",Adventure.assetPath+"uploads/"+this.model.get("URL"));
		this.model.applyAdjustment(this.$el.find("img"));
		if(this.getOption('effect')){
			this.getOption('effect').applyEffect(this.$el.find("img"));
		}
	}
});

Adventure.ViewerPage = Marionette.ItemView.extend({
	template: 'ViewerPage',
	initialize: function(options){
		this.model.set("combinedText",options.beforeText+this.model.get("filteredText")+options.afterText);
	}
});

Adventure.ViewerActionButton = Marionette.ItemView.extend({
	template: 'ViewerActionButton',
	className: 'selection',
	events: {
		'click': function(event){
			event.preventDefault();
			switch(this.model.id){
				case 'restart':
					Adventure.viewer.restart();
					break;
				case 'checkpoint':
					Adventure.viewer.returnToCheckpoint();
					break;
				default:
					Adventure.viewer.performAction(this.model);
			}
			return false;
		}
	},
	modelEvents: {
		'change': 'render'
	}
});
Adventure.ViewerActionList = Marionette.CollectionView.extend({
	className: 'selection-list',
	childView: Adventure.ViewerActionButton,
	viewComparator: function(model){
		return int(model.get('priority'));
	},
	filter: function (child, index, collection) {
		var requirements = child.get("actionFlagRequirements");
		var filterPass = true;
		if (child.id == 'checkpoint' && Adventure.viewer.variables.checkpointPage == 0){
			filterPass = false;
		}
		if(requirements){
			requirements.every(function(requirement){
				if (!Adventure.conditions.get(requirement.get("conditionID")).evaluateCondition(Adventure.viewer.variables.flags[int(requirement.get("flagID"))] || 0, requirement.get("counterValue"), requirement.get("counterUpperValue"), Adventure.viewer.transitionData.randomRoll, Adventure.viewer.variables.currentPage, requirement.get("pageID"), Adventure.viewer.variables.flags[int(requirement.get("otherFlagID"))])){
					filterPass = false;
					return false;
				}
				return true;
			});
		}
		return filterPass;
	}
});

Adventure.InventoryItem = Marionette.ItemView.extend({
	template: 'InventoryItem',
	className: 'item',
	ui: {
		description: '.description'
	},
	onRender: function(){
		this.renderImage();
		if(int(this.model.get("isCounter"))){
			this.$el.find(".quantity").html(Adventure.viewer.variables.flags[this.model.id]);
		}
	},
	events: {
		'mouseover': function(event){
			this.$el.find(".description").css("left","50%");
			if($(".adventure-box").width() > 312){
				var left = this.$el.offset().left - $(".adventure-box").offset().left;
				var right = $(".adventure-box").width() - left - 32;
				if(right < 140){
					this.$el.find(".description").css("left",100-((100/32)*(156-right))+"%");
				}else if(left < 140){
					this.$el.find(".description").css("left",(100/32)*(156-left)+"%");
				}
			}
		}
	},
	modelEvents: {
		'change': 'render'
	},
	renderImage: function(){
		var imageModel = Adventure.activeAdventure.get("images").get(this.model.get("imageID"));
		if(imageModel){
			this.$el.find("img").show().removeAttr('style').attr("src",Adventure.assetPath+"uploads/"+imageModel.get("URL"));
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
		if(this.$el.find(".item").length == 0){
			this.$el.hide();
		}else if(this.$el.find(":visible").length == 0){
			this.$el.fadeIn();
		};
	},
	collectionEvents: {
		'change': 'render'
	}
});
Adventure.LoadingImage = Marionette.ItemView.extend({
	template: false,
	tagName: 'img',
	initialize: function(){
		this.$el.attr('src',Adventure.assetPath+"uploads/"+this.model.get("URL"));
	},
	events: {
		'load': function(event){
			this.getOption('loader').onImageLoaded(this.model);
		}
	}
});
Adventure.LoadingImages = Marionette.CollectionView.extend({
	childView: Adventure.LoadingImage,
	initialize: function(options){
		this.childViewOptions = {
			loader: options.loader
		};
	}
});
Adventure.Loading = Marionette.LayoutView.extend({
	template: 'Loading',
	imageQueue: [],
	loadingSet: new Adventure.Images,
	totalImages: 1,
	imagesLoaded: 0,
	regions: {
		images: '.images'
	},
	initialize: function(options){
		var viewHandle = this;
		options.images.each(function(image){
			viewHandle.imageQueue.push(image);
		});
		this.totalImages = this.imageQueue.length;
		for (var i = 0; i < 10; i++){
			this.loadImage();
		}
	},
	onRender: function(){
		this.showChildView('images', new Adventure.LoadingImages({collection: this.loadingSet, loader: this}));
	},
	loadImage: function(){
		if(this.imageQueue.length > 0){
			this.loadingSet.add(this.imageQueue.pop());
		}
	},
	onImageLoaded: function(image){
		this.loadingSet.remove(image.id);
		this.imagesLoaded++;
		this.$el.find(".progress").css('width',100*(this.imagesLoaded/this.totalImages)+'%');
		if(this.imagesLoaded < this.totalImages){
			this.loadImage();
		}else{
			Adventure.viewer.loadComplete();
		}
	}
});