if(!Adventure.Templates){
	Adventure.Templates = {};
}
Adventure.Templates.Viewer = `
	<div class="adventure-container">
		<div class="overlay"></div>
		<div class="adventure-box">
			<div class="adventure-content"></div>
			<div class="adventure-background-transition"></div>
			<div class="adventure-background normal"></div>
		</div>
	</div>
`;
Adventure.Templates.ViewerPage = `
	<div class="image-container">	
		<img src="uploads/TreronSieboldii_9aa458820389c711.jpg" />
	</div>
	<div class="page-body">
		<%= text %>
	</div>
	<div class="actions"></div>
`;
Adventure.Templates.ViewerActionButton = `
	<div class="<%= (isSpeech == 1) ? 'speech-bubble' : 'action-box' %>">
		<%= text %>
	</div>	
`