(function() {
	function SessionControls(
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

	SessionControls.prototype.initSocket = function() {
		this.socket = io();

		// Emit the init event which prompts the server to respond with
		// the session-id event which in turn provides us with the session
		// id to display in the link.
		this.socket.emit('therapist-session-init');
		this.socket.on('therapist-session-id', this.saveSessionId.bind(this));
	};

	SessionControls.prototype.saveSessionId = function(sessionId) {
		this.sessionId = sessionId;
		const link = window.location.href + sessionId + '/';
		this.linkDisplay.href = link;
		this.linkDisplay.innerText = link;
	};

	SessionControls.prototype.emitNewSettings = function() {
		this.socket.emit('therapist-new-settings', this.lightbar);
	};

	SessionControls.prototype.handleLightWidthChange = function(event) {
		const value = event.target.value;
		const percentage = parseInt(value) / 100;
		this.lightbar.updateLightWidth((10 * percentage) + 'em');
		this.emitNewSettings();
	};

	SessionControls.prototype.handleLightSpeedChange = function(event) {
		const value = event.target.value;
		const percentage = parseInt(value) / 100;
		const newSpeed = ((this.maxSpeed - this.minSpeed) * percentage) + this.minSpeed;
		this.lightbar.updateLightSpeed(newSpeed);
		this.emitNewSettings();
	};

	SessionControls.prototype.toggleBounce = function() {
		if (this.lightbar.isBouncing()) {
			this.startButton.innerText = 'Start';
			this.lightbar.stopBounce();
		} else {
			this.startButton.innerText = 'Stop';
			this.lightbar.startBounce();
		}

		this.emitNewSettings();
	};

	window.SessionControls = SessionControls;
})();
