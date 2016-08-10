Adventure.Templates = {
	Layer : `
		<!--<div id="layer-<%= id %>" class="layer">-->
			<div id="overlay-<%= id %>" class="overlay"></div>
			<div id="view-<%= id %>" class="layer-view"></div>
		<!--</div>-->
	`,
	AdventureList : `
		<div id="adventure-list"></div>
	`,
	Adventure : ` 
		<img src="<%= imageURL %>" class="select-image" />
		<div class="select-description">
			<h2><%= title %></h2>
			<p>By: <%= author %></p>
			<p><%= description %></p>
		</div>
	`,
	AdventureCreate : `
			<button id="CreateAdventureButton" class="full-button">Create Adventure</button>
			<form id="CreateAdventureForm">
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
				<div class="errorRow">
				</div>
				<div class="row">
					<button class="create full-button">Create</button>
				</div>
			</form>		
	`,
	AdventureEdit : `
		<!--<div class="adventure-edit">-->
			<form>
				<div class="row">						
					<div class="form-label">
						Title
					</div>
					<div class="form-field">
						<input type="text" name="title" value="<%= title %>" />
					</div>
				</div>
				<div class="row">
					<div class="form-label">
						Description
					</div>
					<div class="form-field">
						<textarea name="description"><%= description %></textarea>
					</div>
				</div>
				<div class="row">
					<div class="form-label">
						Image
					</div>
					<div class="form-field-image">
						<button class="image-button"><img src="img/builder/icons/image.png" /></button>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-offset-1 col-sm-10">
						<div class="page-select">
							<div class="row">
								<h3>Pages</h3>
								<div class="selections">
									<div class="selection">
										<img src="img/builder/icons/page.png" class="select-image" />
										<div class="select-description">
											<p>Page 1</p>
											<p>Description</p>
										</div>
									</div>
									<div class="selection">
										<img src="img/builder/icons/page.png" class="select-image" />
										<div class="select-description">
											<p>Page 2</p>
											<p>Description</p>
										</div>
									</div>
									<div class="selection">
										<img src="img/builder/icons/page.png" class="select-image" />
										<div class="select-description">
											<p>Page 3</p>
											<p>Description</p>
										</div>
									</div>
								</div>
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
						<!--
						<div class="event-select">
							<div class="row">
								<h3>Events</h3>
								<div class="selections-scroll">
									<div class="selection">
										<img src="img/builder/icons/event.png" class="select-image" />
										<div class="select-description">
											<p>Event 1</p>
										</div>
									</div>
									<div class="selection">
										<img src="img/builder/icons/event.png" class="select-image" />
										<div class="select-description">
											<p>Event 2</p>
										</div>
									</div>
									<div class="selection">
										<img src="img/builder/icons/event.png" class="select-image" />
										<div class="select-description">
											<p>Event 3</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						-->
					</div>			
				</div>					
				<div class="row">
					<button class="full-button">Publish</button>
				</div>
				<div class="errorRow">
				</div>
				<div class="row">
					<button class="saveClose full-button">Save & Close</button>
				</div>
			</form>
		<!--</div>-->
	`,
	PageEdit : `
		<div class="page-edit">
			<form>
				<div class="row">											
					<div class="form-label">
						Name
					</div>
					<div class="form-field">
						<input type="text" />
					</div>
				</div>
				<div class="row">
					<div class="form-label">
						Text
					</div>
					<div class="form-field">
						<textarea></textarea>
					</div>
				</div>
				<div class="row">											
					<div class="form-label">
						Scene
					</div>
					<div class="form-field">
						<select>
							<option>Select Scene</option>
							<option>Scene 1</option>
							<option>Scene 2</option>
							<option>Scene 3</option>
							<option>New Scene...</option>
						</select>
					</div>
				</div>
				<div class="row">
					<div class="form-label">
						Image
					</div>
					<div class="form-field-image">
						<button><img src="img/builder/icons/image.png" /></button>
					</div>
				</div>
				<div class="row">											
					<div class="form-label">
						Effect
					</div>
					<div class="form-field">
						<select>
							<option>Select Effect</option>
							<option>Effect 1</option>
							<option>Effect 2</option>
							<option>Effect 3</option>
							<option>New Effect...</option>
						</select>
					</div>
				</div>
				<div class="action-select">
					<div class="row">
						<h3>Actions</h3>
						<div class="selections">
							<div class="selection">
								<div class="action-box">
									<p>Action 1</p>
								</div>
							</div>
							<div class="selection">
								<div class="action-box">
									<p>Action 2</p>
								</div>
							</div>
							<div class="selection">
								<div class="speech-bubble">
									<p>Action 3</p>
								</div>
							</div>
							<div class="selection">
								<div class="speech-bubble">
									<p>A metaphor breezes against the doctor. Skeleton ribbons a benefit outside the bitten resolve. Sausage mandates skeleton over the sympathy. A configured cupboard staggers after the amateur staircase. The applicant edges any chemistry behind a questioning grain. Will the changing eccentric cooperate throughout skeleton?</p>
								</div>
							</div>
							<div class="selection">
								<div class="action-box">
									<p>New Action...</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="event-select">
					<div class="row">
						<h3>Events</h3>
						<div class="selections">
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>Event 1</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>Event 2</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>Event 3</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>New Event...</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<button class="full-button">Create</button>
				</div>
			</form>				
		</div>
	`,
	PageButton : `
		<img src="img/builder/icons/page.png" class="select-image" />
		<div class="select-description">
			<p><%= name %></p>
		</div>
	`,
	ActionEdit : `
		<div class="action-edit">
			<form>
				<div class="row">
					<div class="form-label">
						Text
					</div>
					<div class="form-field">
						<textarea></textarea>
					</div>
				</div>
				<div class="row">
					<div class="form-label">
						Speech
					</div>
					<div class="form-field">
						<input type="checkbox" />
					</div>
				</div>
				<div class="row">											
					<div class="form-label">
						Effect
					</div>
					<div class="form-field">
						<select>
							<option>Select Effect</option>
							<option>Effect 1</option>
							<option>Effect 2</option>
							<option>Effect 3</option>
							<option>New Effect...</option>
						</select>
					</div>
				</div>
				<div class="row">											
					<div class="form-label">
						Transition
					</div>
					<div class="form-field">
						<select>
							<option>Select Transition</option>
							<option>Transition 1</option>
							<option>Transition 2</option>
							<option>Transition 3</option>
							<option>New Transition...</option>
						</select>
					</div>
				</div>
				
				<div class="requirement-select">
					<div class="row">
						<h3>Requirements</h3>
						<div class="selections">
							<div class="selection">
								<img src="img/builder/icons/requirement.png" class="select-image" />
								<div class="select-description">
									<p>Requirement 1</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/requirement.png" class="select-image" />
								<div class="select-description">
									<p>Requirement 2</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/requirement.png" class="select-image" />
								<div class="select-description">
									<p>Requirement 3</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/requirement.png" class="select-image" />
								<div class="select-description">
									<p>New Requirement...</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="event-select">
					<div class="row">
						<h3>Events</h3>
						<div class="selections">
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>Event 1</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>Event 2</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>Event 3</p>
								</div>
							</div>
							<div class="selection">
								<img src="img/builder/icons/event.png" class="select-image" />
								<div class="select-description">
									<p>New Event...</p>
								</div>
							</div>
						</div>
					</div>
				</div>					
				<div class="row">
					<button class="full-button">Create</button>
				</div>
			</form>				
		</div>				
	`,
	RequirementEdit : `
		<div class="requirement-edit">
			<form>
				<div class="row">											
					<div class="form-label">
						Flag
					</div>
					<div class="form-field">
						<select>
							<option>Select Flag</option>
							<option>Flag 1</option>
							<option>Flag 2</option>
							<option>Flag 3</option>
							<option>New Flag...</option>
						</select>
					</div>
				</div>
				<div class="row">											
					<div class="form-label">
						Condition
					</div>
					<div class="form-field">
						<select>
							<option>Select Condition</option>
							<option>Condition 1</option>
							<option>Condition 2</option>
							<option>Condition 3</option>
							<option>New Condition...</option>
						</select>
					</div>
				</div>
				<div class="row">											
					<div class="form-label">
						Counter
					</div>
					<div class="form-field">
						<input type="text" />
					</div>
				</div>
				<div class="row">											
					<div class="form-label">
						Maximum
					</div>
					<div class="form-field">
						<input type="text" />
					</div>
				</div>
				<div class="row">
					<button class="full-button">Create</button>
				</div>
			</form>				
		</div>		
	`,
	SceneEdit : `
		<!--<div class="scene-edit">-->
			<form>
				<div class="form-group">
					<label for="sceneName<%= id %>">Name</label>
					<input name="name" id="sceneName<%= id %>" type="text" maxlength="50" placeholder="Scene Name" value="<%= name %>" />
				</div>
				<div class="event-select-full">
					<div class="row">
						<h3>Events</h3>
						<div class="selections"></div>
						<button class="new-event-button full-button">New Event</button>
					</div>
				</div>					
				<div class="row">
					<button class="save-button full-button">Save</button>
					<button class="create-button full-button">Create</button>
					<button class="close-button full-button">Cancel</button>
				</div>
			</form>				
		<!--</div>-->
	`,
	ImageEdit : `
		<!--<div class="image-edit">-->
			<form>
				<div class="form-group">
					<label for="imageFile<%= id %>" class="image-label">Image File</label>
					<input name="imageFile" id="imageFile<%= id %>" type="file" />
				</div>					
				<div class="row">
					<button class="save-button full-button">Upload</button>
					<button class="create-button full-button">Upload</button>
					<button class="close-button full-button">Cancel</button>
				</div>
			</form>				
		<!--</div>-->
	`,
	EffectEdit : `
		<!--<div class="effect-edit">-->
			<form>
				<div class="form-group">
					<label for="effectName<%= id %>">Name</label>
					<input name="name" id="effectName<%= id %>" type="text" maxlength="50" placeholder="Effect Name" value="<%= name %>" />
				</div>	
				<div class="form-group">
					<label for="effectScript<%= id %>">Script</label>
					<textarea name="script" id="effectScript<%= id %>" maxlength="1000" placeholder="CSS Script"><%= script %></textarea>
				</div>	

				<div class="row">
					<div class="form-label">
						<p>Test</p>
						<button class="full-button image-button"><img src="img/builder/icons/image.png" /></button>
						<button class="full-button">Test</button>
					</div>
					<div class="form-field">
						<img class="test-image" src="img/builder/icons/image.png" />
					</div>
				</div>
					
				<div class="row">
					<button class="save-button full-button">Save</button>
					<button class="create-button full-button">Create</button>
					<button class="close-button full-button">Cancel</button>
				</div>
			</form>				
		<!--</div>-->
	`,
	FlagEdit : `
		<!--<div class="flag-edit">-->
			<form class="form-inline">

				<div class="form-group">
					<label for="flagName<%= id %>">Name</label>
					<input name="name" id="flagName<%= id %>" type="text" maxlength="50" placeholder="Flag Name" value="<%= name %>" />
				</div>

				<div class="checkbox">
					<label>
						<input name="isItem" type="checkbox" value="1" <%= isItem == 1 ? 'checked' : '' %> >
						Item
					</label>
				</div>

				<div class="checkbox">
					<label>
						<input name="isCounter" type="checkbox" value="1" <%= isCounter == 1 ? 'checked' : '' %> >
						Counter
					</label>
				</div>

				<div class="form-group">
					<label for="flagImage<%= id %>" class="image-label">Image</label>
					<button class="image-button" id="flagImage<%= id %>"><img src="img/builder/icons/image.png" /></button>
				</div>

				<div class="form-group">
					<label>Counter</label>
					<div>
						<div class="form-group">
							<label for="flagDefault<%= id %>">Default</label>
							<input name="counterDefault" id="flagDefault<%= id %>" type="text" maxlength="10" placeholder="Default Value" value="<%= counterDefault %>" />
						</div>
						<div class="form-group">
							<label for="flagMinimum<%= id %>">Minimum</label>
							<input name="counterMinimum" id="flagMinimum<%= id %>" type="text" maxlength="10" placeholder="Minimum Value" value="<%= counterMinimum %>" />
						</div>
						<div class="form-group">
							<label for="flagMaximum<%= id %>">Maximum</label>
							<input name="counterMaximum" id="flagMaximum<%= id %>" type="text" maxlength="10" placeholder="Maximum Value" value="<%= counterMaximum %>" />
						</div>
						<div class="checkbox">
							<label>
								<input name="counterWraps" type="checkbox" value="1" <%= counterWraps == 1 ? 'checked' : '' %> >
								Wrap Value
							</label>
						</div>
					</div>
				</div>
					
				<div class="row">
					<button class="save-button full-button">Save</button>
					<button class="create-button full-button">Create</button>
					<button class="close-button full-button">Cancel</button>
				</div>
			</form>				
		<!--</div>-->
	`,
	EventEdit : `
		<!--<div class="event-edit">
			<form>-->
				<div class="form-group">
					<label>Type</label>
					<div class="form-field eventtype-selectbox"></div>
				</div>
				<div class="form-group">
					<label>Flag</label>
					<div class="form-field flag-selectbox"></div>
				</div>
				<div class="form-group">
					<label for="eventValue<%= id %>">Value</label>
					<input name="value" id="eventValue<%= id %>" type="text" maxlength="10" placeholder="Counter Value" value="<%= value %>" />
				</div>
				<div class="form-group">
					<label for="eventTextBefore<%= id %>">Text Before</label>
					<input name="textBefore" id="eventTextBefore<%= id %>" type="text" maxlength="200" placeholder="Text Before Page Text" value="<%= textBefore %>" />
				</div>
				<div class="form-group">
					<label for="eventTextAfter<%= id %>">Text After</label>
					<input name="textAfter" id="eventTextAfter<%= id %>" type="text" maxlength="200" placeholder="Text After Page Text" value="<%= textAfter %>" />
				</div>
				<div class="form-group">
					<label>Page</label>
					<div class="form-field page-selectbox">
						<select>
							<option>Select Page</option>
							<option>Page 1</option>
							<option>Page 2</option>
							<option>Page 3</option>
							<option>New Page...</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<label>Condition</label>
					<div class="form-field condition-selectbox">
						<select>
							<option>Select Page</option>
							<option>Page 1</option>
							<option>Page 2</option>
							<option>Page 3</option>
							<option>New Page...</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<label>Condition Variables</label>
					<div>
						<div class="form-group">
							<label>Flag</label>
							<div class="form-field condition-flag-selectbox">
								<select>
									<option>Select Flag</option>
									<option>Flag 1</option>
									<option>Flag 2</option>
									<option>Flag 3</option>
									<option>New Flag...</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label for="eventCounterValue<%= id %>">Value</label>
							<input name="counterValue" id="eventCounterValue<%= id %>" type="text" maxlength="10" placeholder="Counter Value/Random %" value="<%= counterValue %>" />
						</div>
						<div class="form-group">
							<label for="eventCounterUpperValue<%= id %>">Maximum</label>
							<input name="counterUpperValue" id="eventCounterUpperValue<%= id %>" type="text" maxlength="10" placeholder="Counter Maximum" value="<%= counterUpperValue %>" />
						</div>
					</div>
				</div>
					
				<div class="row">
					<button class="full-button">Create</button>
				</div>
			<!--</form>				
		</div>-->
	`,
	EventLink : `
		<!--<div class="event-edit">-->
			<form>								
				<div class="form-group">
					<label for="eventPriority<%= id %>">Priority</label>
					<input name="priority" id="eventPriority<%= id %>" type="text" maxlength="3" placeholder="Priority Number" value="<%= priority %>" />
				</div>
				<div class="form-group">
					<label>Event</label>
					<div class="form-field event-selectbox"></div>
				</div>
				<div class="event-form"></div>
				<div class="row">
					<button class="save-button full-button">Save</button>
					<button class="create-button full-button">Create</button>
					<button class="close-button full-button">Cancel</button>
				</div>
			</form>				
		<!--</div>-->
	`,
	ImageButton : `
		<!--<div class="selection">-->
			<img src="<%= URL %>" />
		<!--</div>-->
	`,
	ImageSelection : `
		<!--<div class="image-selection">-->
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
		<!--</div>-->
	`,
	SceneButton : `
		<!--<div class="selection">-->
			<img src="img/builder/icons/scene.png" class="select-image" />
			<div class="select-description">
				<p><%= name %></p>
			</div>
		<!--</div>-->
	`,
	SceneSelection : `
		<!--<div class="scene-selection">-->
			<form>
				<div class="row">
					<h3>Scenes</h3>
					<div class="selections"></div>
				</div>
				<div class="row">
					<button class="new-button full-button">New Scene</button>
					<button class="close-button full-button">Close</button>
				</div>
			</form>
		<!--</div>-->
	`,
	EffectButton : `
		<!--<div class="selection">-->
			<img src="img/builder/icons/effect.png" class="select-image" />
			<div class="select-description">
				<p><%= name %></p>
			</div>
		<!--</div>-->
	`,
	EffectSelection : `
		<!--<div class="effect-selection">-->
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
		<!--</div>-->
	`,
	FlagButton : `
		<!--<div class="selection">-->
			<img src="img/builder/icons/flag.png" class="select-image" />
			<div class="select-description">
				<p><%= name %></p>
			</div>
		<!--</div>-->
	`,
	FlagSelection : `
		<!--<div class="flag-selection">-->
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
		<!--</div>-->
	`,
	EventButton : `
		<!--<div class="selection">-->
			<img src="img/builder/icons/event.png" class="select-image" />
			<div class="select-description">
				<p><%= name %></p>
			</div>
		<!--</div>-->
	`,
	EventSelection : `
		<div class="event-selection">
			<form>
				<div class="row">
					<h3>Events</h3>
					<div class="selections-scroll">
						<div class="selection">
							<img src="img/builder/icons/event.png" class="select-image" />
							<div class="select-description">
								<p>Event 1</p>
							</div>
						</div>
						<div class="selection">
							<img src="img/builder/icons/event.png" class="select-image" />
							<div class="select-description">
								<p>Event 2</p>
							</div>
						</div>
						<div class="selection">
							<img src="img/builder/icons/event.png" class="select-image" />
							<div class="select-description">
								<p>Event 3</p>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<button class="full-button">New Event</button>
				</div>
			</form>
		</div>
	`,
	Option : "<%= name %>"
};