Adventure.Templates.FlagEdit = `
	<form class="form-inline">

		<div class="form-group">
			<label for="flagName<%= ID %>">Name</label>
			<input class="form-control" name="name" ID="flagName<%= ID %>" type="text" maxlength="50" placeholder="Flag Name" value="<%= _.xcape(name) %>" data-toggle="tooltip" title="The name of the flag. If the flag is an item, this will be displayed to the player if inspected in the inventory." />
		</div>

		<div class="checkbox">
			<label>
				<input name="isItem" type="checkbox" value="1" <%= isItem == 1 ? 'checked' : '' %> data-toggle="tooltip" title="If checked, then this flag will be treated as an item, and added to the inventory when the flag is active, or if its counter is above zero." >
				Item
			</label>
		</div>

		<div class="form-group">
			<label for="flagDescription<%= ID %>">Description</label>
			<textarea class="form-control" name="description" ID="flagDescription<%= ID %>" maxlength="200" placeholder="Item Description" data-toggle="tooltip" title="A description for an item. This will be displayed to the player when inspected in the inventory."><%= description %></textarea>
		</div>

		<div class="checkbox">
			<label>
				<input name="isCounter" type="checkbox" value="1" <%= isCounter == 1 ? 'checked' : '' %>  data-toggle="tooltip" title="If checked, this flag will be treated as a counter with an integer value. Otherwise, it will be true or false." >
				Counter
			</label>
		</div>

		<div class="form-group">
			<label for="flagImage<%= ID %>" class="image-label">Image</label>
			<button class="image-button" ID="flagImage<%= ID %>" data-toggle="tooltip" title="Add an image to a flag if you are using it as an item. It will be displayed in the inventory when active.">
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
					<input class="form-control" name="counterDefault" ID="flagDefault<%= ID %>" type="text" maxlength="10" placeholder="Default Value" value="<%= _.xcape(counterDefault) %>" data-toggle="tooltip" title="When the adventure begins, the value of the counter will be set to this value." />
				</div>
				<div class="form-group">
					<label for="flagMinimum<%= ID %>">Minimum</label>
					<input class="form-control" name="counterMinimum" ID="flagMinimum<%= ID %>" type="text" maxlength="10" placeholder="Minimum Value" value="<%= _.xcape(counterMinimum) %>" data-toggle="tooltip" title="The minimum value of the counter." />
				</div>
				<div class="form-group">
					<label for="flagMaximum<%= ID %>">Maximum</label>
					<input class="form-control" name="counterMaximum" ID="flagMaximum<%= ID %>" type="text" maxlength="10" placeholder="Maximum Value" value="<%= _.xcape(counterMaximum) %>" data-toggle="tooltip" title="The maximum value of the counter." />
				</div>
				<div class="checkbox">
					<label>
						<input name="counterWraps" type="checkbox" value="1" <%= counterWraps == 1 ? 'checked' : '' %>  data-toggle="tooltip" title="If this is checked, then when the value of the counter passes beyond one if its bounds, then it will be set to a value relative to the other bound. For example, a counter with a range from 1-20 will have its value set to 17 if an event tried to set it to -3. This allows for incrementing counters to loop repeatedly through the range. If this is unchecked, the value will instead be set to the bound that was exceeded. For the previous example, the resulting value would instead be 1.">
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
		<p><%= _.xcape(name) %></p>
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