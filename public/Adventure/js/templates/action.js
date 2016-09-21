Adventure.Templates.ActionEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="actionPriority<%= ID %>">Priority</label>
			<input class="form-control" name="priority" ID="actionPriority<%= ID %>" type="text" maxlength="3" placeholder="Priority Number" value="<%= _.xcape(priority) %>" data-toggle="tooltip" title="Determines the order in which actions are displayed, with the lowest values displayed at the top of the list. Actions for the page and scene are combined, and sorted by this value." />
		</div>
		<div class="form-group">
			<label>Type</label>
			<div class="form-field actionType-selectbox" data-toggle="tooltip" title="Determines the appearance of the action. It can display as an action box or speech bubble. If an arrow is selected, the text field will be ignored."></div>
		</div>
		<div class="form-group text-group">
			<label for="actionText<%= ID %>">Text</label>
			<textarea class="form-control" name="text" ID="actionText<%= ID %>" maxlength="500" placeholder="Action Text" data-toggle="tooltip" title="Enter the text for the action box or speech bubble."><%= text %></textarea>
		</div>
		<div class="form-group">
			<label>Next Page</label>
			<div class="form-field page-selectbox" data-toggle="tooltip" title="When this action is selected, the chosen page will be loaded, unless an event reroutes the player to a different page."></div>
		</div>
		<div class="form-group">
			<label>Effect</label>
			<div class="form-field effect-selectbox" data-toggle="tooltip" title="When this action is selected, the chosen effect will be applied to the page image. The page change will be delayed by the effect's duration, multiplied by its number of loops. Infinitely-looping effects will be ignored."></div>
		</div>
		<div class="form-group">
			<label>Transition</label>
			<div class="form-field transition-selectbox" data-toggle="tooltip" title="The selected transition will be applied to the page image as the page changes."></div>
		</div>

		<div class="requirement-select">
			<div class="row">
				<h3>Requirements</h3>
				<div class="selections"></div>
				<button class="new-requirement-button full-button">New Requirement</button>
			</div>
		</div>
		<div class="event-select">
			<div class="row">
				<h3>Events</h3>
				<div class="selections"></div>
				<button class="new-event-button full-button">New Event</button>
			</div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="save-button full-button">Save</button>
			<button class="delete-button full-button">Delete</button>
		</div>
	</form>
`;
Adventure.Templates.ActionButton = `
	<div class="action-button <%= (actionTypeID == 2) ? 'speech-bubble' : 'action-box' %>">
		<% if (actionTypeID == 3 || actionTypeID == 4){ %>
			<img src="img/viewer/<%= actionTypeID == 3 ? 'forward' : 'back' %>-arrow.gif" />
		<% }else{ %>
			<p><%= _.xcape(text) %></p>
		<% } %>
	</div>
	<div class="page-jump">
		<img src="img/builder/icons/page-jump.png" />
	</div>
`