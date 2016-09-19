Adventure.defaultImageURL = 'img/builder/icons/image.png';
Adventure.activeAdventure = null;
Adventure.userID = 0;
Adventure.admin = 0;

Adventure.saveResponseHandlers = function(viewHandle, callback){
	callback = (typeof callback == 'function') ? callback : null;
	return {
		success: function(){
			Adventure.Main.initiateRemoval(viewHandle, callback);
		},
		error: function(model, response, options){
			//viewHandle.$el.find(".errorRow").html("<ul>"+response.responseJSON.errorMsg+"</ul>");
			Adventure.handleInvalidInput(response.responseJSON);
		},
		validate: false
	};
}
Adventure.saveResponseHandlersWithoutRemoval = function(callback){
	callback = (typeof callback == 'function') ? callback : null;
	return {
		success: callback,
		error: function(model, response, options){
			Adventure.handleInvalidInput(response.responseJSON);
		},
		validate: false
	};
}
Adventure.saveImageUploadResponseHandlers = function(viewHandle, formMap){
	var response = Adventure.saveResponseHandlers(viewHandle,function(){Adventure.Main.renderImageEdit(viewHandle.model);});
	response['iframe'] = true;
	response['files'] = viewHandle.$el.find("[name='imageFile']");
	formMap['ID'] = viewHandle.model.id;
	formMap['adventureID'] = viewHandle.model.get('adventureID');
	response['data'] = formMap;
	return response;
}
Adventure.saveEventResponseHandlers = function(viewHandle,successFunction){
	return {
		success: successFunction,
		error: function(model, response, options){
			Adventure.handleInvalidInput(response.responseJSON);
		}
	};
}
Adventure.deleteDialog = function(viewHandle, itemName){
	if(confirm("Are you sure you want to delete this "+itemName+"?")){
		Adventure.Main.initiateRemoval(viewHandle);
		viewHandle.model.destroy();
	}
}
Adventure.generateFormMap = function(form){
	var formMap = {};
	form.find("input,select,textarea").each(function(){
		if($(this).attr("type") == "checkbox"){
			formMap[$(this).attr("name")] = $(this).is(":checked") ? 1 : 0;
		}else{
			formMap[$(this).attr("name")] = $(this).val();
		}
	})
	return formMap;
}
Adventure.handleInvalidInput = function(validation){
	if (validation.sessionExpired != undefined){
		Adventure.Main.renderSessionLogin();
	}else{
		$(".layer:last-child .errorRow").html("<ul>"+validation.errorMsg+"</ul>");
		for(var errorField of validation.errorFields){
			$(".layer:last-child .form-group:has([name='"+errorField+"'])").addClass("has-error");
		}
	}
}
Adventure.setupTooltips = function(viewHandle){
	viewHandle.$el.find('[data-toggle="tooltip"]').tooltip();
}

$(function(){
	Adventure.Options = new Adventure.OptionsMenu();
	Adventure.Status = new Adventure.StatusDisplay();
	Adventure.Main = new Adventure.MainView();
});