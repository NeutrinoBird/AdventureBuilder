Adventure.Templates.FlagEdit = `
	<form class="form-inline">

		<div class="form-group">
			<label for="flagName<%= ID %>">Name</label>
			<input class="form-control" name="name" ID="flagName<%= ID %>" type="text" maxlength="50" placeholder="Flag Name" value="<%= name %>" />
		</div>

		<div class="checkbox">
			<label>
				<input name="isItem" type="checkbox" value="1" <%= isItem == 1 ? 'checked' : '' %> >
				Item
			</label>
		</div>

		<div class="form-group">
			<label for="flagDescription<%= ID %>">Description</label>
			<textarea class="form-control" name="description" ID="flagDescription<%= ID %>" maxlength="200" placeholder="Item Description"><%= description %></textarea>
		</div>

		<div class="checkbox">
			<label>
				<input name="isCounter" type="checkbox" value="1" <%= isCounter == 1 ? 'checked' : '' %> >
				Counter
			</label>
		</div>

		<div class="form-group">
			<label for="flagImage<%= ID %>" class="image-label">Image</label>
			<button class="image-button" ID="flagImage<%= ID %>">
				<div class="image-container">
					<img src="img/builder/icons/image.png" />
				</div>
			</button>
			<input class="form-control" name="imageID" ID="flagImageeID<%= ID %>" type="hidden" value="<%= imageID %>" />
		</div>

		<div class="form-group counter-group">
			<label>Counter</label>
			<div>
				<div class="form-group">
					<label for="flagDefault<%= ID %>">Default</label>
					<input class="form-control" name="counterDefault" ID="flagDefault<%= ID %>" type="text" maxlength="10" placeholder="Default Value" value="<%= counterDefault %>" />
				</div>
				<div class="form-group">
					<label for="flagMinimum<%= ID %>">Minimum</label>
					<input class="form-control" name="counterMinimum" ID="flagMinimum<%= ID %>" type="text" maxlength="10" placeholder="Minimum Value" value="<%= counterMinimum %>" />
				</div>
				<div class="form-group">
					<label for="flagMaximum<%= ID %>">Maximum</label>
					<input class="form-control" name="counterMaximum" ID="flagMaximum<%= ID %>" type="text" maxlength="10" placeholder="Maximum Value" value="<%= counterMaximum %>" />
				</div>
				<div class="checkbox">
					<label>
						<input name="counterWraps" type="checkbox" value="1" <%= counterWraps == 1 ? 'checked' : '' %> >
						Wrap Value
					</label>
				</div>
			</div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="save-button full-button">Save</button>
			<button class="delete-button full-button">Delete</button>
		</div>
	</form>
`;
Adventure.Templates.FlagButton = `
	<img src="img/builder/icons/flag.png" class="no-thumbnail select-image" />
	<div class="image-thumbnail select-image">
		<div class="image-container">
			<img src="img/builder/icons/flag.png" />
		</div>
	</div>
	<div class="select-description">
		<p><%= name %></p>
	</div>
`;
Adventure.Templates.FlagSelection = `
	<form>
		<div class="row">
			<h3>Flags</h3>
			<div class="selections"></div>
		</div>
		<div class="row">
			<button class="new-button full-button">New Flag</button>
			<button class="close-button full-button">Close</button>
		</div>
	</form>
`;