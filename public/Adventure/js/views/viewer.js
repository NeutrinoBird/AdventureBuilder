Adventure.Viewer = Marionette.LayoutView.extend({
	el: '#adventure',
	template: 'Viewer',
	currentPageType: "normal",
	startingPage: 0,
	regions: {pageView:'.adventure-content'},
	initialize: function(){
		this.model = new Adventure.AdventureViewingModel({hashKey: this.$el.attr("data-adventure")});
		this.listenTo(this.model, 'sync', function(){
			this.startingPage = this.model.get("pages").models[0].id;
			this.$el.prepend(this.model.get("effects").assembleKeyframes());
			this.loadPage(this.startingPage);
		});
		$(window).resize(this.resizeBox);
		$(window).load(this.resizeBox);
		this.render();
	},
	onRender: function(){
		var viewHandle = this;
		this.$el.find(".adventure-background-transition").hide();
		this.resizeBox();
		//Temporary
		this.$el.find(".adventure-container").click(function(event){
			viewHandle.backgroundTransition("goodEnding");
		});
	},
	loadPage: function(pageID){
		this.showChildView('pageView', new Adventure.ViewerPage({model: this.model.get("pages").get(pageID)}));
	},
	resizeBox: function(){
		var boxWidth = Math.min($(".adventure-container").width(), 640);
		$(".adventure-box").width(Math.max(boxWidth - (boxWidth % 16), 160));
		var boxHeight = $(".adventure-content").innerHeight();
		if (boxHeight % 16 > 0){
			$(".adventure-box").height(boxHeight + 16 - (boxHeight % 16));
		}
		if($(".adventure-box").width() >= 640){
			$(".image-container").height(350);
		}else{
			$(".image-container").height(58 + 292 * ($(".adventure-box").width() - 160)/480);
		}
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
	}
});

Adventure.ViewerPage = Marionette.LayoutView.extend({
	template: 'ViewerPage',
	currentPageType: "normal",
	regions: {actionList:'.actions'},
	/*
	initialize: function(){
		$(window).resize(this.resizeBox);
		$(window).load(this.resizeBox);
		this.render();
	},
	*/
	onRender: function(){
		var viewHandle = this;
		this.showChildView('actionList', new Adventure.ViewerActionList({collection: this.model.get("actions")}));
		this.renderImage();
		if(parseInt(this.model.get('effectID')) > 0){
			Adventure.activeAdventure.get("effects").get(this.model.get("effectID")).applyEffect(this.$el.find(".image-container img"));
		}
	},
	renderImage: function(){
		var imageModel = Adventure.activeAdventure.get("images").get(this.model.get("imageID"));
		this.$el.find(".image-container img").attr("src",Adventure.assetPath+"uploads/"+imageModel.get("URL"));
		this.$el.find(".image-container img").css("transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
		this.$el.find(".image-container img").css("-webkit-transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
		this.$el.find(".image-container img").css("-ms-transform","translateX(-"+imageModel.get("centerX")+") translateY(-"+imageModel.get("centerY")+") scale("+imageModel.get("scale")+")");
	}
});

Adventure.ViewerActionButton = Marionette.ItemView.extend({
	template: 'ViewerActionButton',
	className: 'selection',
	events: {
		'click': function(event){
			event.preventDefault();
			//
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