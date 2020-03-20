(function() {
	/**
	 * Manages the therapists controls for the lightbar.
	 * @param {Lightbar} lightbar        A lightbar to control
	 * @param {HTMLRangeElement} lightWidthRange Range input for controlling the light element's width
	 * @param {HTMLRangeElement} lightSpeedRange Range input for controlling the speed of the light element
	 * @param {HTMLButtonElement} startButton     Button for toggling the light's movement on and off
	 */
	function TherapistLightbarController(
		lightbar,
		lightWidthRange,
		lightSpeedRange,
		startButton
	) {
		this.minSpeed = 3000;
		this.maxSpeed = 100;
		this.lightbar = lightbar;
		this.lightWidthRange = lightWidthRange;
		this.lightSpeedRange = lightSpeedRange;
		this.startButton = startButton;

		this.lightWidthRange.onchange = this.handleLightWidthChange.bind(this);
		this.lightSpeedRange.onchange = this.handleLightSpeedChange.bind(this);
		this.startButton.onclick = this.toggleBounce.bind(this);

		this.initSocket();
		this.initSpeedAndWidth();
	}

	TherapistLightbarController.prototype.initSocket = function() {
		this.socket = io();
	};

	TherapistLightbarController.prototype.initSpeedAndWidth = function() {
		this._updateLightWidth();
		this._updateLightSpeed();
		this.emitNewSettings();
	};

	TherapistLightbarController.prototype.emitNewSettings = function() {
		// The Lightbar class manages its own serialization in Lightbar.prototype.toJSON
		this.socket.emit('therapist-new-settings', this.lightbar);
	};

	TherapistLightbarController.prototype._updateLightWidth = function() {
		const value = this.lightWidthRange.value;
		const percentage = parseInt(value) / 100;
		this.lightbar.updateLightWidth((30 * percentage) + '%');
	};

	TherapistLightbarController.prototype.handleLightWidthChange = function() {
		this._updateLightWidth();
		this.emitNewSettings();
	};

	TherapistLightbarController.prototype._updateLightSpeed = function() {
		const value = this.lightSpeedRange.value;
		const percentage = parseInt(value) / 100;
		const newSpeed = ((this.maxSpeed - this.minSpeed) * percentage) + this.minSpeed;
		this.lightbar.updateLightSpeed(newSpeed);
	};

	TherapistLightbarController.prototype.handleLightSpeedChange = function() {
		this._updateLightSpeed();
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
