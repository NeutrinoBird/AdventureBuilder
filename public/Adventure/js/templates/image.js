Adventure.Templates.ImageUpload = `
	<form class="form-inline" enctype="multipart/form-data">
		<div class="form-group">
			<label for="imageFile<%= ID %>" class="image-label">Image File</label>
			<input class="form-control" name="imageFile" ID="imageFile<%= ID %>" type="file" />
			<input name="MAX_FILE_SIZE" type="hidden" value="2097152" />
			<input name="centerX" type="hidden" value="<%= centerX %>" />
			<input name="centerY" type="hidden" value="<%= centerY %>" />
			<input name="scale" type="hidden" value="<%= scale %>" />
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="save-button full-button">Save</button>
			<button class="delete-button full-button">Delete</button>
		</div>
	</form>
`;
Adventure.Templates.ImageEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="imageCenterX<%= ID %>">Center X%</label>
			<input class="form-control" name="centerX" ID="imageCenterX<%= ID %>" type="text" maxlength="10" placeholder="X-Percent of Center" value="<%= centerX %>" />
		</div>
		<div class="form-group">
			<label for="imageCenterY<%= ID %>">Center Y%</label>
			<input class="form-control" name="centerY" ID="imageCenterY<%= ID %>" type="text" maxlength="10" placeholder="Y-Percent of Center" value="<%= centerY %>" />
		</div>
		<div class="form-group">
			<label for="imageScale<%= ID %>">Scale</label>
			<input class="form-control" name="scale" ID="imageScale<%= ID %>" type="text" maxlength="10" placeholder="Decimal scale (1 = 100%)" value="<%= scale %>" />
		</div>
		<input name="URL" type="hidden" value="<%= URL %>" />
		<input name="width" type="hidden" value="<%= width %>" />
		<input name="height" type="hidden" value="<%= height %>" />
		<div class="form-group">
			<div class="row">
				<button class="full-button test-button">Test</button>
				<div class="image-container">
					<img src="<%= (URL=='') ? 'img/builder/icons/image.png' : 'uploads/'+URL %>" />
				</div>
			</div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="upload-button full-button">Select Replacement Image</button>
			<button class="save-button full-button">Save</button>
			<button class="delete-button full-button">Delete</button>
		</div>
	</form>
`;
Adventure.Templates.ImageButton = `
	<img src="<%= URL != '' ? 'uploads/'+URL : 'img/builder/icons/image.png' %>" />
`;
Adventure.Templates.ImageSelection = `
	<form>
		<div class="row">
			<h3>Images</h3>
			<div class="selections"></div>
		</div>
		<div class="row">
			<button class="new-button full-button">New Image</button>
			<button class="close-button full-button">Close</button>
		</div>
	</form>
`;