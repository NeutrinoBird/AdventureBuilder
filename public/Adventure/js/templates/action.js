Adventure.Templates.ActionEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="actionText<%= ID %>">Text</label>
			<textarea class="form-control" name="text" ID="actionText<%= ID %>" maxlength="500" placeholder="Action Text"><%= text %></textarea>
		</div>	
		<div class="checkbox">
			<label>
				<input name="isSpeech" type="checkbox" value="1" <%= isSpeech == 1 ? 'checked' : '' %> >
				Speech Bubble
			</label>
		</div>
		<div class="form-group">
			<label>Next Page</label>
			<div class="form-field page-selectbox"></div>
		</div>
		<div class="form-group">
			<label>Effect</label>
			<div class="form-field effect-selectbox"></div>
		</div>
		<div class="form-group">
			<label>Transition</label>
			<div class="form-field transition-selectbox"></div>
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
	<div class="action-button <%= (isSpeech == 1) ? 'speech-bubble' : 'action-box' %>">
		<p><%= text %></p>
	</div>
	<div class="page-jump">
		<img src="img/builder/icons/page-jump.png" />
	</div>
`