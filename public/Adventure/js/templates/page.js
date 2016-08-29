Adventure.Templates.PageEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="pageName<%= ID %>">Name</label>
			<input class="form-control" name="name" ID="pageName<%= ID %>" type="text" maxlength="50" placeholder="Page Name" value="<%= name %>" data-toggle="tooltip" title="The internal name for the page. Refer to this name when linking from actions or events." />
		</div>
		<div class="form-group">
			<label for="pageText<%= ID %>">Text</label>
			<textarea class="form-control" name="text" ID="pageText<%= ID %>" maxlength="2000" placeholder="Page Body" data-toggle="tooltip" title="This text will be displayed to the player on this page. Events can add additional text before or after this text."><%= text %></textarea>
		</div>
		<div class="form-group">
			<label>Scene</label>
			<div class="form-field scene-selectbox" data-toggle="tooltip" title="If a page is part of a scene, then that scene's actions and events will be added to the page's own collections."></div>
		</div>
		<div class="form-group">
			<label>Type</label>
			<div class="form-field pageType-selectbox" data-toggle="tooltip" title="Determines the background of the page, and can add actions. For instance, 'Death' and 'Bad Ending' will add 'Return to Checkpoint' and 'Restart' links. Setting the type to 'Checkpoint' will establish this page as a checkpoint when the player lands on it."></div>
		</div>
		<div class="form-group">
			<label for="pageImage<%= ID %>" class="image-label">Image</label>
			<button class="image-button" ID="pageImage<%= ID %>" data-toggle="tooltip" title="Choose an image to be displayed on top of the page.">
				<div class="image-container">
					<img src="img/builder/icons/image.png" />
				</div>
			</button>
			<input class="form-control" name="imageID" ID="pageImageID<%= ID %>" type="hidden" value="<%= imageID %>" />
		</div>
		<div class="form-group">
			<label>Effect</label>
			<div class="form-field effect-selectbox" data-toggle="tooltip" title="If specified, an effect will be applied to the page image."></div>
		</div>
		<div class="action-select">
			<div class="row">
				<h3>Actions</h3>
				<div class="header-key">
					<label>Jump to Page</label>
				</div>
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
		<div class="link-select">
			<div class="form-group">
			<label>Linking Pages</label>
			<div class="form-field">
				<div class="linkPage-selectbox" data-toggle="tooltip" title="These pages link to the current page."></div>
				<button class="linking-page-button" data-toggle="tooltip" title="Save this page, and jump to the selected page.">
					<img src="img/builder/icons/page-jump.png" class="select-image" />
					<div class="select-description">
						Jump to Page
					</div>
				</button>
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
Adventure.Templates.PageEditLite = `
	<form class="form-inline">
		<div class="form-group">
			<label for="pageName<%= ID %>">Name</label>
			<input class="form-control" name="name" ID="pageName<%= ID %>" type="text" maxlength="50" placeholder="Page Name" value="<%= name %>" data-toggle="tooltip" title="The internal name for the page. Refer to this name when linking from actions or events." />
		</div>
		<div class="form-group">
			<label for="pageText<%= ID %>">Text</label>
			<textarea class="form-control" name="text" ID="pageText<%= ID %>" maxlength="2000" placeholder="Page Body" data-toggle="tooltip" title="This text will be displayed to the player on this page. Events can add additional text before or after this text."><%= text %></textarea>
		</div>
		<div class="form-group">
			<label>Scene</label>
			<div class="form-field scene-selectbox" data-toggle="tooltip" title="If a page is part of a scene, then that scene's actions and events will be added to the page's own collections."></div>
		</div>
		<div class="form-group">
			<label>Type</label>
			<div class="form-field pageType-selectbox" data-toggle="tooltip" title="Determines the background of the page, and can add actions. For instance, 'Death' and 'Bad Ending' will add 'Return to Checkpoint' and 'Restart' links. Setting the type to 'Checkpoint' will establish this page as a checkpoint when the player lands on it."></div>
		</div>
		<div class="form-group">
			<label for="pageImage<%= ID %>" class="image-label">Image</label>
			<button class="image-button" ID="pageImage<%= ID %>" data-toggle="tooltip" title="Choose an image to be displayed on top of the page.">
				<div class="image-container">
					<img src="img/builder/icons/image.png" />
				</div>
			</button>
			<input class="form-control" name="imageID" ID="pageImageID<%= ID %>" type="hidden" value="<%= imageID %>" />
		</div>
		<div class="form-group">
			<label>Effect</label>
			<div class="form-field effect-selectbox" data-toggle="tooltip" title="If specified, an effect will be applied to the page image."></div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="save-button full-button">Save</button>
			<button class="delete-button full-button">Delete</button>
		</div>
	</form>
`;
Adventure.Templates.PageButton = `
	<img src="img/builder/icons/page.png" class="no-thumbnail select-image" />
	<div class="image-thumbnail select-image">
		<div class="image-container">
			<img src="img/builder/icons/page.png" />
		</div>
	</div>
	<div class="select-description">
		<p><%= name %></p>
	</div>
`;