Adventure.Templates.EffectEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="effectName<%= ID %>">Name</label>
			<input class="form-control" name="name" ID="effectName<%= ID %>" type="text" maxlength="50" placeholder="Effect Name" value="<%= name %>" />
		</div>
		<div class="form-group">
			<label for="effectKeyframes<%= ID %>">Keyframes</label>
			<textarea class="form-control" name="keyframes" ID="effectKeyframes<%= ID %>" maxlength="1000" placeholder="CSS Keyframes"><%= keyframes %></textarea>
		</div>
		<div class="form-group">
			<label for="effectTiming<%= ID %>">Timing</label>
			<input class="form-control" name="timing" ID="effectTiming<%= ID %>" type="text" maxlength="40" placeholder="CSS Timing Function" value="<%= timing %>" />
		</div>
		<div class="form-group">
			<label for="effectDuration<%= ID %>">Duration</label>
			<input class="form-control" name="duration" ID="effectDuration<%= ID %>" type="text" maxlength="5" placeholder="Duration in seconds" value="<%= duration %>" />
		</div>
		<div class="form-group">
			<label for="effectDelay<%= ID %>">Delay</label>
			<input class="form-control" name="delay" ID="effectDelay<%= ID %>" type="text" maxlength="5" placeholder="Delay in seconds" value="<%= delay %>" />
		</div>
		<div class="form-group">
			<label for="effectLoops<%= ID %>">Loops</label>
			<input class="form-control" name="loops" ID="effectLoops<%= ID %>" type="text" maxlength="5" placeholder="# of loops (0 = ∞)" value="<%= loops %>" />
		</div>
		<div class="form-group">
			<label for="effectDirection<%= ID %>">Direction</label>
			<input class="form-control" name="direction" ID="effectDirection<%= ID %>" type="text" maxlength="20" placeholder="CSS Animation Direction" value="<%= direction %>" />
		</div>
		<div class="form-group">
			<label for="effectFillMode<%= ID %>">Fill Mode</label>
			<input class="form-control" name="fillMode" ID="effectFillMode<%= ID %>" type="text" maxlength="20" placeholder="CSS Animation Fill Mode" value="<%= fillMode %>" />
		</div>

		<div class="row">
			<div class="form-label">
				<p>Test</p>
			</div>
			<button class="full-button test-image-select">Select Test Image</button>
			<button class="full-button test-button">Test</button>
		</div>
		<div class="image-row">
			<div class="image-maximum">
				<div class="image-container">
					<style type="text/css" class="test-keyframes"></style>
					<img src="img/builder/icons/image.png" />
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
Adventure.Templates.EffectButton = `
	<img src="img/builder/icons/effect.png" class="select-image" />
	<div class="select-description">
		<p><%= name %></p>
	</div>
`;
Adventure.Templates.EffectSelection = `
	<form>
		<div class="row">
			<h3>Effects</h3>
			<div class="selections"></div>
		</div>
		<div class="row">
			<button class="new-button full-button">New Effect</button>
			<button class="close-button full-button">Close</button>
		</div>
	</form>
`;