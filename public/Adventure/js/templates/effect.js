Adventure.Templates.EffectEdit = `
	<form class="form-inline">
		<div class="form-group">
			<label for="effectName<%= ID %>">Name</label>
			<input class="form-control" name="name" ID="effectName<%= ID %>" type="text" maxlength="50" placeholder="Effect Name" value="<%= name %>" data-toggle="tooltip" title="The name of the effect, for internal use." />
		</div>
		<div class="form-group">
			<label for="effectKeyframes<%= ID %>">Keyframes</label>
			<textarea class="form-control" name="keyframes" ID="effectKeyframes<%= ID %>" maxlength="1000" placeholder="CSS Keyframes" data-toggle="tooltip" data-html="true" data-placement="top auto" title="A CSS3 Animation Keyframe definition.<br><br>Example:<br>0% {transform: translate(-50%,-50%) scale(1.5) rotate(0deg);}<br>100% {transform: translate(-50%,-50%) scale(1.5) rotate(360deg);}<br><br>When specifying a transformation, you will need to add translate and scale functions, as it overrides the transformation used by the image control. By default it is -50%,-50%; Simply invert your centerX and centerY values.<br><br>Refrain from using browser-specific variations of transform and filter, as they will be added automatically."><%= keyframes %></textarea>
		</div>
		<div class="form-group">
			<label for="effectTiming<%= ID %>">Timing</label>
			<input class="form-control" name="timing" ID="effectTiming<%= ID %>" type="text" maxlength="40" placeholder="CSS Timing Function" value="<%= timing %>" data-html="true" title="The CSS3 timing function for the effect animation." />
		</div>
		<div class="form-group">
			<label for="effectDuration<%= ID %>">Duration</label>
			<input class="form-control" name="duration" ID="effectDuration<%= ID %>" type="text" maxlength="5" placeholder="Duration in seconds" value="<%= duration %>" data-html="true" title="The duration, in seconds, of the effect." />
		</div>
		<div class="form-group">
			<label for="effectDelay<%= ID %>">Delay</label>
			<input class="form-control" name="delay" ID="effectDelay<%= ID %>" type="text" maxlength="5" placeholder="Delay in seconds" value="<%= delay %>" data-html="true" title="The time, in seconds, that will elapse before the animation begins." />
		</div>
		<div class="form-group">
			<label for="effectLoops<%= ID %>">Loops</label>
			<input class="form-control" name="loops" ID="effectLoops<%= ID %>" type="text" maxlength="5" placeholder="# of loops (0 = ∞)" value="<%= loops %>" data-html="true" title="The number of times the animation will loop before it ends. Enter 0 for an infinite loop." />
		</div>
		<div class="form-group">
			<label for="effectDirection<%= ID %>">Direction</label>
			<input class="form-control" name="direction" ID="effectDirection<%= ID %>" type="text" maxlength="20" placeholder="CSS Animation Direction" value="<%= direction %>" data-html="true" title="The CSS3 animation direction (normal, reverse, alternate, alternate-reverse)." />
		</div>
		<div class="form-group">
			<label for="effectFillMode<%= ID %>">Fill Mode</label>
			<input class="form-control" name="fillMode" ID="effectFillMode<%= ID %>" type="text" maxlength="20" placeholder="CSS Animation Fill Mode" value="<%= fillMode %>" data-html="true" title="The CSS3 fill mode, which defines the behavior before and after the animation (none, forwards, backwards, both)" />
		</div>

		<div class="row">
			<div class="form-label">
				<p>Test</p>
			</div>
			<button class="full-button test-image-select" data-html="true" title="Select an image to be used in the test area below.">Select Test Image</button>
			<button class="full-button test-button" data-html="true" title="Test the animation as defined by the fields above. If the input is valid, the effect will be applied to the image below.">Test</button>
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