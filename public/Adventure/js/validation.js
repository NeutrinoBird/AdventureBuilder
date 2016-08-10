function validate(form, elements){
	var output = {form : {}, error : false, errorMsg : "", errorFields : []};
	for(var i in elements){
		elements[i].type = elements[i].type || "uint";
		elements[i].required = elements[i].required || false;
		elements[i].maxLength = elements[i].maxLength || 0;
		if(form.selector == null){
			elements[i].value = form[elements[i].name];
			if(elements[i].type == "bit" && elements[i].value != 1){
				elements[i].value = 0;
			}
		}else{
			elements[i].value = form.find(" [name='"+elements[i].name+"']").val();
			if(form.find("[name='"+elements[i].name+"']").attr("type") == "checkbox" && elements[i].value == ""){
				elements[i].value = 0;
			}
		}
		if(elements[i].required && elements[i].value == ""){
			output.errorMsg += "<li>"+elements[i].name+" is required.</li>";
			output.errorFields.push(elements[i].name);
		}
		switch(elements[i].type){
			case "uint":
				if (!$.isNumeric(elements[i].value) && elements[i].value != ""){
					output.errorMsg += "<li>"+elements[i].name+" is invalid.</li>";
					output.errorFields.push(elements[i].name);
				}else if ($.isNumeric(elements[i].value)){
					if (elements[i].value > 4294967295){
						output.errorMsg += "<li>"+elements[i].name+" is too large.</li>";
						output.errorFields.push(elements[i].name);
					}else if(elements[i].value < 0){
						output.errorMsg += "<li>"+elements[i].name+" is too low.</li>";
						output.errorFields.push(elements[i].name);
					}
				}
				break;
			case "int":
				if (!$.isNumeric(elements[i].value) && elements[i].value != ""){
					output.errorMsg += "<li>"+elements[i].name+" is invalid.</li>";
					output.errorFields.push(elements[i].name);
				}else if ($.isNumeric(elements[i].value)){
					if (elements[i].value > 2147483647){
						output.errorMsg += "<li>"+elements[i].name+" is too large.</li>";
						output.errorFields.push(elements[i].name);
					}else if(elements[i].value < -2147483648){
						output.errorMsg += "<li>"+elements[i].name+" is too low.</li>";
						output.errorFields.push(elements[i].name);
					}
				}
				break;
			case "tinyint":
				if (!$.isNumeric(elements[i].value) && elements[i].value != ""){
					output.errorMsg += "<li>"+elements[i].name+" is invalid.</li>";
					output.errorFields.push(elements[i].name);
				}else if ($.isNumeric(elements[i].value)){
					if (elements[i].value > 255){
						output.errorMsg += "<li>"+elements[i].name+" is too large.</li>";
						output.errorFields.push(elements[i].name);
					}else if(elements[i].value < 0){
						output.errorMsg += "<li>"+elements[i].name+" is too low.</li>";
						output.errorFields.push(elements[i].name);
					}
				}
				break;
			case "bit":
				if (elements[i].value != 0 && elements[i].value != 1){
					output.errorMsg += "<li>"+elements[i].name+" is invalid.</li>";
					output.errorFields.push(elements[i].name);
				}
				break;
			case "string":
				if (elements[i].value.length >= elements[i].maxLength){
					output.errorMsg += "<li>"+elements[i].name+" must be "+elements[i].maxLength+" characters or less. It is currently "+elements[i].value.length+" characters long.</li>";
					output.errorFields.push(elements[i].name);
				}
				break;
			case "percent":
				if (elements[i].value.length >= elements[i].maxLength){
					output.errorMsg += "<li>"+elements[i].name+" must be "+elements[i].maxLength+" characters or less. It is currently "+elements[i].value.length+" characters long.</li>";
					output.errorFields.push(elements[i].name);
				}else if(elements[i].value.search(/^[0-9]+(\.[0-9]+)?%$/) == -1){
					output.errorMsg += "<li>"+elements[i].name+" is an invalid percentage.</li>";
					output.errorFields.push(elements[i].name);
				}
				break;
			case "decimal":
				if (elements[i].value.length >= elements[i].maxLength){
					output.errorMsg += "<li>"+elements[i].name+" must be "+elements[i].maxLength+" characters or less. It is currently "+elements[i].value.length+" characters long.</li>";
					output.errorFields.push(elements[i].name);
				}else if(elements[i].value.search(/^[0-9]+(\.[0-9]+)?$/) == -1){
					output.errorMsg += "<li>"+elements[i].name+" is an invalid decimal.</li>";
					output.errorFields.push(elements[i].name);
				}
				break;
		}
		output.form[elements[i].name] = elements[i].value;
	}
	output.error = output.errorMsg != "";
	return output;
}