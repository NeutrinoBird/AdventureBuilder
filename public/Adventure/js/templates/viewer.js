if(!Adventure.Templates){
	Adventure.Templates = {};
}
Adventure.Templates.Viewer = `
	<div class="adventure-container">
		<div class="overlay"></div>
		<div class="adventure-box">
			<div class="adventure-content">
				<div class="image-manager">
					<div class="image-container page-A"></div>
					<div class="image-container page-B"></div>
					<div class="image-container blank"></div>
				</div>
				<div class="page-manager">
					<div class="page-body page-A"></div>
					<div class="page-body page-B"></div>
				</div>
				<div class="inventory-container"></div>
				<div class="action-manager">
					<div class="actions page-A"></div>
					<div class="actions page-B"></div>
				</div>
			</div>
			<div class="adventure-background-transition">
				<div class="close-box"></div>
			</div>
			<div class="adventure-background normal">
				<div class="close-box"></div>
			</div>
		</div>
	</div>
`;
Adventure.Templates.ViewerImage = `
	<img />
`;
Adventure.Templates.ViewerPage = `
	<%= combinedText %>
`;
Adventure.Templates.ViewerActionButton = `
	<div class="<%= (actionTypeID == 2) ? 'speech-bubble' : 'action-box' %>">
		<% if (actionTypeID == 3 || actionTypeID == 4){ %>
			<img src="img/viewer/<%= actionTypeID == 3 ? 'forward' : 'back' %>-arrow.gif" />
		<% }else{ %>
			<%= text %>
		<% } %>
	</div>
`
Adventure.Templates.InventoryItem = `
	<div class="item-image-container">
		<img src="img/builder/icons/flag.png" />
	</div>
	<div class="quantity"></div>
	<div class="description">
		<h3><%= name %></h3>
		<p><%= description %></p>
	</div>
`