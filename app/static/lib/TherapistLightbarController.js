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
		visible,
		lightWidthRange,
		lightSpeedRange,
		startButton,
		rootElement
	) {
		this.minSpeed = emdrGetConstant('minLightSpeed');
		this.maxSpeed = emdrGetConstant('maxLightSpeed');
		this.lightbar = lightbar;
		this.lightWidthRange = lightWidthRange;
		this.lightSpeedRange = lightSpeedRange;
		this.startButton = startButton;
		this.rootElement = rootElement;

		this.lightWidthRange.onchange = this.handleLightWidthChange.bind(this);
		this.lightSpeedRange.onchange = this.handleLightSpeedChange.bind(this);
		this.startButton.onclick = this.toggleBounce.bind(this);

		this.initSpeedAndWidth();
		this.setVisible(visible);
	}

	TherapistLightbarController.prototype.initSpeedAndWidth = function() {
		this._updateLightWidth();
		this._updateLightSpeed();
	};

	TherapistLightbarController.prototype.emitNewSettings = function() {
		fetch('/therapist/settings', { method: "POST", credentials: "include", body: JSON.stringify(this.lightbar)});
	};

	TherapistLightbarController.prototype.handleInitialSettings = function(initialSettings) {
		this.lightbar.updateSettings(initialSettings);
		if (initialSettings.isStarted) {
			this.startButton.innerText = 'Stop';
		}
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
			/**
			 * the lightbar continues to bounce and slow down for a
			 * period of time so we disable the button to prevent the
			 * therapist from accidentally double clicking it and putting
			 * the app into a weird state.
			 */
			this.startButton.disabled = true;
			const callback = (function() {
				this.startButton.innerText = 'Start';
				this.startButton.disabled = false;
			}).bind(this);
			this.lightbar.stopBounce(callback);
		} else {
			this.startButton.innerText = 'Stop';
			this.lightbar.startBounce();
		}

		this.emitNewSettings();
	};


    TherapistLightbarController.prototype.setVisible = function(visible) {
		this.visible = visible;
        if (visible) {
            this.rootElement.style.display = 'flex';
            this.startButton.innerText = 'Start';
        } else {
            this.rootElement.style.display = 'none';
        }
        this.lightbar.setVisible(visible);
    };

	window.TherapistLightbarController = TherapistLightbarController;
})();
