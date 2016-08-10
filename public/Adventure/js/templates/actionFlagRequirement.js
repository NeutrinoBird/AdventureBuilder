Adventure.Templates.ActionFlagRequirementEdit = `
	<form class="form-inline">		
		<div class="form-group">
			<label>Condition</label>
			<div class="form-field condition-selectbox"></div>
		</div>
		<div class="form-group flagID-group">
			<label>Flag</label>
			<div class="form-field flag-selectbox"></div>
		</div>
		<div class="form-group counterValue-group">
			<label for="reqCounterValue<%= ID %>">Value</label>
			<input class="form-control" name="counterValue" ID="reqCounterValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Value/Random %" value="<%= counterValue %>" />
		</div>
		<div class="form-group counterUpperValue-group">
			<label for="reqCounterUpperValue<%= ID %>">Maximum</label>
			<input class="form-control" name="counterUpperValue" ID="reqCounterUpperValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Maximum" value="<%= counterUpperValue %>" />
		</div>	
		<div class="errorRow"></div>		
		<div class="row">
			<button class="save-button full-button">Save</button>
			<button class="delete-button full-button">Delete</button>
		</div>
	</form>					
`;
Adventure.Templates.ActionFlagRequirementButton = `
	<img src="img/builder/icons/requirement.png" class="select-image" />
	<div class="select-description">
		<p><%= name %></p>
	</div>
`;						