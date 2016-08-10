Adventure.Templates.SceneEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="sceneName<%= ID %>">Name</label>
			<input class="form-control" name="name" ID="sceneName<%= ID %>" type="text" maxlength="50" placeholder="Scene Name" value="<%= name %>" />
		</div>
		<div class="action-select">
			<div class="row">
				<h3>Actions</h3>
				<div class="selections"></div>
				<button class="new-action-button full-button">New Action</button>
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
Adventure.Templates.SceneButton = `
	<img src="img/builder/icons/scene.png" class="select-image" />
	<div class="select-description">
		<p><%= name %></p>
	</div>
`;
Adventure.Templates.SceneSelection = `
	<form>
		<div class="row">
			<h3>Scenes</h3>
			<div class="selections"></div>
		</div>
		<div class="row">
			<button class="new-button full-button">New Scene</button>
			<button class="close-button full-button">Close</button>
		</div>
	</form>
`;