Adventure.Templates.EventEdit = `
	<div class="form-group">
		<label>Type</label>
		<div class="form-field eventtype-selectbox"></div>
	</div>
	<div class="form-group flag-group">
		<label>Flag</label>
		<div class="form-field flag-selectbox"></div>
	</div>
	<div class="form-group value-group">
		<label for="eventValue<%= ID %>">Value</label>
		<input class="form-control" name="value" ID="eventValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Value" value="<%= value %>" />
	</div>
	<div class="form-group page-group">
		<label>Page</label>
		<div class="form-field page-selectbox"></div>
	</div>
	<div class="form-group">
		<label for="eventTextBefore<%= ID %>">Text Before</label>
		<input class="form-control" name="textBefore" ID="eventTextBefore<%= ID %>" type="text" maxlength="200" placeholder="Text Before Page Text" value="<%= textBefore %>" />
	</div>
	<div class="form-group">
		<label for="eventTextAfter<%= ID %>">Text After</label>
		<input class="form-control" name="textAfter" ID="eventTextAfter<%= ID %>" type="text" maxlength="200" placeholder="Text After Page Text" value="<%= textAfter %>" />
	</div>	
	<div class="form-group">
		<label>Condition</label>
		<div class="form-field condition-selectbox"></div>
	</div>
	<div class="form-group condition-group">
		<label>Condition Variables</label>
		<div>
			<div class="form-group condition-flag-group">
				<label>Flag</label>
				<div class="form-field condition-flag-selectbox"></div>
			</div>
			<div class="form-group counterValue-group">
				<label for="eventCounterValue<%= ID %>">Value</label>
				<input class="form-control" name="counterValue" ID="eventCounterValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Value/Random %" value="<%= counterValue %>" />
			</div>
			<div class="form-group counterUpperValue-group">
				<label for="eventCounterUpperValue<%= ID %>">Maximum</label>
				<input class="form-control" name="counterUpperValue" ID="eventCounterUpperValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Maximum" value="<%= counterUpperValue %>" />
			</div>
		</div>
	</div>
`;
Adventure.Templates.EventLink = `
	<form class="form-inline">
		<div class="event-link">
			<div class="form-group">
				<label for="eventPriority<%= ID %>">Priority</label>
				<input class="form-control" name="priority" ID="eventPriority<%= ID %>" type="text" maxlength="3" placeholder="Priority Number" value="<%= priority %>" />
			</div>
			<div class="form-group">
				<label>Event</label>
				<div class="form-field event-selectbox"></div>
			</div>
		</div>
		<div class="event-form"></div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="save-button full-button">Save</button>
			<button class="delete-button full-button">Delete</button>
		</div>
	</form>				
`;

Adventure.Templates.EventButton = `
	<img src="img/builder/icons/event.png" class="select-image" />
	<div class="select-description">
		<p><%= name %></p>
	</div>
`;
Adventure.Templates.EventSelection = `
	<div class="event-selection">
		<form>
			<div class="row">
				<h3>Events</h3>
				<div class="selections-scroll"></div>
			</div>
			<div class="row">
				<button class="full-button">New Event</button>
			</div>
		</form>
	</div>
`;