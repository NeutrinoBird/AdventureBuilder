Adventure.Templates.EventEdit = `
	<div class="form-group">
		<label>Type</label>
		<div class="form-field eventtype-selectbox" data-toggle="tooltip" title="Determines the effect this event will have."></div>
	</div>
	<div class="form-group flag-group">
		<label>Flag</label>
		<div class="form-field flag-selectbox" data-toggle="tooltip" title="The flag/counter that this event will change."></div>
	</div>
	<div class="form-group value-group">
		<label for="eventValue<%= ID %>">Value</label>
		<input class="form-control" name="value" ID="eventValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Value" value="<%= _.xcape(value) %>" data-toggle="tooltip" title="The value that the counter will be set to or incremented by." />
	</div>
	<div class="form-group page-group">
		<label>Page</label>
		<div class="form-field page-selectbox" data-toggle="tooltip" title="The page the player will be sent to upon execution of this event."></div>
	</div>
	<div class="form-group">
		<label for="eventTextBefore<%= ID %>">Text Before</label>
		<input class="form-control" name="textBefore" ID="eventTextBefore<%= ID %>" type="text" maxlength="200" placeholder="Text Before Page Text" value="<%= _.xcape(textBefore) %>" data-toggle="tooltip" title="If text is provided here, then it will be added to the page text, on a new line before the main text body. Multiple events can provide additional text, and they will be ordered in same order that the events are processed." />
	</div>
	<div class="form-group">
		<label for="eventTextAfter<%= ID %>">Text After</label>
		<input class="form-control" name="textAfter" ID="eventTextAfter<%= ID %>" type="text" maxlength="200" placeholder="Text After Page Text" value="<%= _.xcape(textAfter) %>" data-toggle="tooltip" title="If text is provided here, then it will be added to the page text, on a new line after the main text body. Multiple events can provide additional text, and they will be ordered in same order that the events are processed." />
	</div>
	<div class="form-group">
		<label>Condition</label>
		<div class="form-field condition-selectbox" data-toggle="tooltip" title="If a condition is selected, then it must evaluate as true in order for the event to occur. Otherwise, processing will proceed to the next event in queue."></div>
	</div>
	<div class="form-group condition-group">
		<label>Condition Variables</label>
		<div>
			<div class="form-group condition-flag-group">
				<label>Flag</label>
				<div class="form-field condition-flag-selectbox" data-toggle="tooltip" title="The value of the chosen flag/counter will be evaluated by the above condition."></div>
			</div>
			<div class="form-group counterValue-group">
				<label for="eventCounterValue<%= ID %>">Value</label>
				<input class="form-control" name="counterValue" ID="eventCounterValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Value" value="<%= _.xcape(counterValue) %>" data-toggle="tooltip" title="The value that the chosen flag/counter will be compared to. If the condition uses a range, this value is the lower bound. For a random roll, a random number is generated when an action is selected, and is shared by all random number conditions that occur until the next action selection." />
			</div>
			<div class="form-group condition-otherFlag-group">
				<label>Other Flag</label>
				<div class="form-field other-flag-selectbox" data-toggle="tooltip" title="A flag whose value will be compared to the first flag instead of the above value field."></div>
			</div>
			<div class="form-group counterUpperValue-group">
				<label for="eventCounterUpperValue<%= ID %>">Maximum</label>
				<input class="form-control" name="counterUpperValue" ID="eventCounterUpperValue<%= ID %>" type="text" maxlength="10" placeholder="Counter Maximum" value="<%= _.xcape(counterUpperValue) %>" data-toggle="tooltip" title="The upper bound of the value range. For a random roll, a random number is generated when an action is selected, and is shared by all random number conditions that occur until the next action selection." />
			</div>
			<div class="form-group condition-page-group">
				<label>Page</label>
				<div class="form-field condition-page-selectbox" data-toggle="tooltip" title="The page referenced by the above condition. The ID of this page is compared to the page the player is currently on, not the target page of an action or event."></div>
			</div>
		</div>
	</div>
`;
Adventure.Templates.EventLink = `
	<form class="form-inline">
		<div class="event-link">
			<div class="form-group">
				<label for="eventPriority<%= ID %>">Priority</label>
				<input class="form-control" name="priority" ID="eventPriority<%= ID %>" type="text" maxlength="3" placeholder="Priority Number" value="<%= _.xcape(priority) %>" data-toggle="tooltip" title="Determines the order in which events are processed, with priority given to events with lower values. A page's events are combined with those from its scene, sorted by this value, and processed upon landing on the page. Action events are processed before a page change." />
			</div>
			<div class="form-group">
				<label>Event</label>
				<div class="form-field event-selectbox" data-toggle="tooltip" title="Create a new event, or choose an existing event you have used in the adventure. Multiple objects can reference the same event. If an event is modified, it will be modified for each object that references the event."></div>
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
		<p><%= _.xcape(name) %></p>
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