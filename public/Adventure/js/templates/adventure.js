Adventure.Templates.AdventureList = `
	<div ID="adventure-list"></div>
`;
Adventure.Templates.Adventure = ` 
	<img class="select-image" />
	<div class="select-description">
		<h2><%= title %></h2>
		<p>By: <%= author %></p>
		<p><%= description %></p>
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
				<input type="text" name="title" value="" />
			</div>
		</div>
		<div class="row">
			<div class="form-label">
				Description
			</div>
			<div class="form-field">
				<textarea name="description"></textarea>
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
			<input class="form-control" name="title" ID="adventureTitle<%= ID %>" type="text" maxlength="100" placeholder="Adventure Title" value="<%= title %>" />
		</div>
		<div class="form-group">
			<label for="adventureDescription<%= ID %>">Description</label>
			<textarea class="form-control" name="description" ID="adventureDescription<%= ID %>" maxlength="500" placeholder="Adventure Description"><%= description %></textarea>
		</div>	
		<div class="form-group">
			<label for="adventureImage<%= ID %>" class="image-label">Image</label>
			<button class="image-button" ID="adventureImage<%= ID %>"><img /></button>
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