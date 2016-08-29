Adventure.Templates.AdventureListFramework = `
	<div class="adventure-list"></div>
	<div class="new-adventure"></div>
`;
Adventure.Templates.Adventure = `
	<%
	if (imageURL){
		print('<div class="image-thumbnail select-image"><div class="image-container"><img src="uploads/'+imageURL+'" /></div></div>');
	}else{
		print('<img class="no-thumbnail select-image" src="img/builder/icons/adventure.png" />');
	}
	%>
	<div class="select-description">
		<h2><%= title %></h2>
		<p>By: <%= author %></p>
		<p><%= description %></p>
		<button class="full-button test-button">Test</button>
	</div>
`;
Adventure.Templates.AdventureCreate = `
	<button class="create-adventure-start full-button">Create Adventure</button>
	<form class="create-adventure">
		<h2>New Adventure</h2>
		<div class="row">
			<div class="form-label">
				Title
			</div>
			<div class="form-field">
				<input type="text" name="title" value="" data-toggle="tooltip" title="The name of the adventure. This is purely for internal use, and will not be seen by others." />
			</div>
		</div>
		<div class="row">
			<div class="form-label">
				Description
			</div>
			<div class="form-field">
				<textarea name="description" data-toggle="tooltip" title="A description for the adventure. This is purely for internal use, and will not be seen by others."></textarea>
			</div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="create full-button">Create</button>
		</div>
	</form>
`;
Adventure.Templates.AdventureEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="adventureTitle<%= ID %>">Title</label>
			<input class="form-control" name="title" ID="adventureTitle<%= ID %>" type="text" maxlength="100" placeholder="Adventure Title" value="<%= title %>" data-toggle="tooltip" title="The name of the adventure. This is purely for internal use, and will not be seen by others." />
		</div>
		<div class="form-group">
			<label for="adventureDescription<%= ID %>">Description</label>
			<textarea class="form-control" name="description" ID="adventureDescription<%= ID %>" maxlength="500" placeholder="Adventure Description" data-toggle="tooltip" title="A description for the adventure. This is purely for internal use, and will not be seen by others."><%= description %></textarea>
		</div>
		<div class="form-group">
			<label for="adventureImage<%= ID %>" class="image-label">Image</label>
			<button class="image-button" ID="adventureImage<%= ID %>" data-toggle="tooltip" title="Choose an image as a cover for the adventure, for internal use.">
				<div class="image-container">
					<img />
				</div>
			</button>
		</div>
		<div class="row">
			<div class="col-sm-offset-1 col-sm-10">
				<div class="page-select">
					<div class="row">
						<h3>Pages</h3>
						<div class="form-group">
							<label for="filterByScene">Filter by Scene</label>
							<div class="form-field scene-selectbox"></div>
						</div>
						<div class="selections"></div>
						<button class="new-button full-button">New Page</button>
					</div>
				</div>
				<div class="scene-select">
					<div class="row">
						<h3>Scenes</h3>
						<button class="full-button">View / Edit</button>
					</div>
				</div>
				<div class="image-select">
					<div class="row">
						<h3>Images</h3>
						<button class="full-button">View / Replace</button>
					</div>
				</div>
				<div class="effect-select">
					<div class="row">
						<h3>Effects</h3>
						<button class="full-button">View / Edit</button>
					</div>
				</div>
				<div class="flag-select">
					<div class="row">
						<h3>Flags</h3>
						<button class="full-button">View / Edit</button>
					</div>
				</div>
			</div>
		</div>
		<div class="form-group">
			<label>Viewer Code</label>
			<textarea class="form-control" disabled><%=hashKey%></textarea>
		</div>
		<div class="row">
			<button class="full-button">Publish</button>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="saveClose full-button">Save & Close</button>
		</div>
	</form>
`;