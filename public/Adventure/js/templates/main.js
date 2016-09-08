Adventure.Templates = {};
Adventure.Templates.Layer = `
			<div ID="overlay-<%= ID %>" class="overlay"></div>
			<div ID="view-<%= ID %>" class="layer-view"></div>
`;
Adventure.Templates.Option = "<%= name %>";
Adventure.Templates.StatusDisplay = `
			<img class="success" src="img/builder/icons/thumb.png">
			<img class="error" src="img/builder/icons/x.png">
			<img class="loading" src="img/builder/icons/gear.png">
`;
Adventure.Templates.OptionsMenu = `
	<div class="options-menu">
		<button class="effect-button full-button">Effects Off</button>
		<button class="new-user-button full-button">New User</button>
	</div>
`;
Adventure.Templates.Login = `
	<form class="create-adventure">
		<div class="row">
			<div class="form-label">
				Username
			</div>
			<div class="form-field">
				<input type="text" name="username" value="" />
			</div>
		</div>
		<div class="row">
			<div class="form-label">
				Password
			</div>
			<div class="form-field">
				<input type="password" name="password" value="" />
			</div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="login-button full-button">Login</button>
		</div>
	</form>
`;
Adventure.Templates.SessionLogin = `
	<form class="create-adventure">
		<h3>Session Expired. Please log in to continue.</h3>
		<div class="row">
			<div class="form-label">
				Username
			</div>
			<div class="form-field">
				<input type="text" name="username" value="" />
			</div>
		</div>
		<div class="row">
			<div class="form-label">
				Password
			</div>
			<div class="form-field">
				<input type="password" name="password" value="" />
			</div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="login-button full-button">Login</button>
		</div>
	</form>
`;
Adventure.Templates.NewUser = `
	<form class="create-adventure">
		<h3>New User</h3>
		<div class="row">
			<div class="form-label">
				Username
			</div>
			<div class="form-field">
				<input type="text" name="username" value="" />
			</div>
		</div>
		<div class="row">
			<div class="form-label">
				Password
			</div>
			<div class="form-field">
				<input type="password" name="password" value="" />
			</div>
		</div>
		<div class="errorRow"></div>
		<div class="row">
			<button class="login-button full-button">Create User</button>
			<button class="close-button full-button">Cancel</button>
		</div>
	</form>
`;