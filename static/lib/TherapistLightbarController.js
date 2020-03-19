(function() {
	/**
	 * Manages the therapists controls for the lightbar.
	 * @param {Lightbar} lightbar        A lightbar to control
	 * @param {HTMLRangeElement} lightWidthRange Range input for controlling the light element's width
	 * @param {HTMLRangeElement} lightSpeedRange Range input for controlling the speed of the light element
	 * @param {HTMLButtonElement} startButton     Button for toggling the light's movement on and off
	 * @param {HTMLElement} linkDisplay     An element to display the current session URL into
	 */
	function TherapistLightbarController(
		lightbar,
		lightWidthRange,
		lightSpeedRange,
		startButton,
		linkDisplay,
	) {
		this.minSpeed = 3000;
		this.maxSpeed = 100;
		this.lightbar = lightbar;
		this.lightWidthRange = lightWidthRange;
		this.lightSpeedRange = lightSpeedRange;
		this.startButton = startButton;
		this.linkDisplay = linkDisplay;

		this.lightWidthRange.onchange = this.handleLightWidthChange.bind(this);
		this.lightSpeedRange.onchange = this.handleLightSpeedChange.bind(this);
		this.startButton.onclick = this.toggleBounce.bind(this);

		this.initSocket();
	}

	TherapistLightbarController.prototype.initSocket = function() {
		this.socket = io();

		// Emit the init event which prompts the server to respond with
		// the session-id event which in turn provides us with the session
		// id to display in the link.
		this.socket.emit('therapist-session-init');
		this.socket.on('therapist-session-id', this.saveSessionId.bind(this));
	};

	TherapistLightbarController.prototype.saveSessionId = function(sessionId) {
		this.sessionId = sessionId;
		const link = window.location.href + sessionId + '/';
		this.linkDisplay.href = link;
		this.linkDisplay.innerText = link;
	};

	TherapistLightbarController.prototype.emitNewSettings = function() {
		// The Lightbar class manages its own serialization in Lightbar.prototype.toJSON
		this.socket.emit('therapist-new-settings', this.lightbar);
	};

	TherapistLightbarController.prototype.handleLightWidthChange = function(event) {
		const value = event.target.value;
		const percentage = parseInt(value) / 100;
		this.lightbar.updateLightWidth((30 * percentage) + '%');
		this.emitNewSettings();
	};

	TherapistLightbarController.prototype.handleLightSpeedChange = function(event) {
		const value = event.target.value;
		const percentage = parseInt(value) / 100;
		const newSpeed = ((this.maxSpeed - this.minSpeed) * percentage) + this.minSpeed;
		this.lightbar.updateLightSpeed(newSpeed);
		this.emitNewSettings();
	};

	TherapistLightbarController.prototype.toggleBounce = function() {
		if (this.lightbar.isBouncing()) {
			this.startButton.innerText = 'Start';
			this.lightbar.stopBounce();
		} else {
			this.startButton.innerText = 'Stop';
			this.lightbar.startBounce();
		}

		this.emitNewSettings();
	};

	window.TherapistLightbarController = TherapistLightbarController;
})();
