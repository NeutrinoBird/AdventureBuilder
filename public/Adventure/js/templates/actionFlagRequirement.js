Adventure.Templates.ActionFlagRequirementEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label>Condition</label>
			<div class="form-field condition-selectbox" data-toggle="tooltip" title="The chosen condition must evaluate as true for the action to be displayed. If more than one requirement is given to an action, then all of their conditions must evaluate as true."></div>
		</div>
		<div class="form-group flagID-group">
			<label>Flag</label>
			<div class="form-field flag-selectbox" data-toggle="tooltip" title="The value of the chosen flag/counter will be evaluated by the above condition."></div>
		</div>
		<div class="form-group counterValue-group">
			<label for="reqCounterValue<%= ID %>">Value</label>
			<input class="form-control" name="counterValue" ID="reqCounterValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Value" value="<%= counterValue %>" data-toggle="tooltip" title="The value that the chosen flag/counter will be compared to. If the condition uses a range, this value is the lower bound. For a random roll, a random number is generated when an action is selected, and is shared by all random number conditions that occur until the next action selection." />
		</div>
		<div class="form-group otherFlagID-group">
			<label>Other Flag</label>
			<div class="form-field other-flag-selectbox" data-toggle="tooltip" title="A flag whose value will be compared to the first flag instead of the above value field."></div>
		</div>
		<div class="form-group counterUpperValue-group">
			<label for="reqCounterUpperValue<%= ID %>">Maximum</label>
			<input class="form-control" name="counterUpperValue" ID="reqCounterUpperValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Maximum" value="<%= counterUpperValue %>" data-toggle="tooltip" title="The upper bound of the value range. For a random roll, a random number is generated when an action is selected, and is shared by all random number conditions that occur until the next action selection." />
		</div>
		<div class="form-group pageID-group">
			<label>Page</label>
			<div class="form-field page-selectbox" data-toggle="tooltip" title="The page referenced by the above condition. The ID of this page is compared to the page the player is currently on, not the target page of an action or event."></div>
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