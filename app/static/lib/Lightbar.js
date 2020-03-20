(function() {
	/**
	 * Lightbar controls the appearance and behavior of
	 * a rendered Lightbar. For the most part this should
	 * be an object with a relatively simple API that just
	 * responds to data changes as they happen and updates
	 * the internal state as well as the DOM.
	 *
	 * This object is used to control both the therapist's and
	 * the client's lightbars, so it should not include
	 * anything specific to the controls for configuring the
	 * appearance or behavior of the lightbar. That stuff
	 * should live in TherapistLightbarController.
	 *
	 * @param {HTMLElement} rootElement The element into which the Lighbar should be rendered
	 * @param {?Object} initialData Optional initial settings for the lighbar appearance and behavior
	 * @param {Boolean} initialData.isStarted Whether the lightbar is currently moving
	 * @param {Number} initialData.speed The number of ms it takes for the light to travel across the bar
	 * @param {'right'|'left'} initialData.movementDirection The current direction of the light's movement
	 * @param {0} initialData.minMarginLeft A constant of 0; this should not be overridden
	 * @param {Number} initialData.maxMarginLeft The highest allowed value for margin left of the light element during animation
	 * @param {String} initialData.lightWidth The initial width of the light element
	 */
	function Lightbar(rootElement, visible, initialData) {
		this.rootElement = rootElement;
		this.render(visible);
		this.data = Object.assign({
			isStarted: false,
			speed: 1000,
			movementDirection: 'right',
			// @todo move this to a real constant instead of in data
			minMarginLeft: 0,
			maxMarginLeft: this.getMaxMarginLeft(),
			// @todo use lightWidth to set the initial width of the light element
			lightWidth: '2%',
		}, initialData);

		this._doBounce = this._doBounce.bind(this);
	}

	Lightbar.prototype.render = function(visible) {
		this.lightbarElement = document.getElementById('lightbar');
		this.lightElement = document.getElementById('light');
		this.setVisible(visible);
	};

	Lightbar.prototype.toJSON = function() {
		return {
			type: 'lightbar',
			isStarted: this.data.isStarted,
			speed: this.data.speed,
			lightWidth: this.data.lightWidth
		};
	};

	/**
	 * Handles updates to the lightbar's appearance and
	 * behavior. Used to send new settings after a therapist
	 * updates it on their end and the new settings event
	 * is captured on the client's browser.
	 * @param  {Object} newSettings The new settings to apply to the lightbar
	 * @param {Number} newSettings.speed The new speed of the lightbar
	 * @param {String} newSettings.lightWidth The new width of the light element
	 * @param {Boolean} newSettings.isStarted Whether the lightbar should be moving or not
	 */
	Lightbar.prototype.updateSettings = function(newSettings) {
		this.updateLightSpeed(newSettings.speed);
		this.updateLightWidth(newSettings.lightWidth);

		if (newSettings.isStarted !== this.data.isStarted) {
			if (newSettings.isStarted) {
				this.startBounce();
			} else {
				this.stopBounce();
			}
		}
	};

	/**
	 * Retrieve the greatest possible value for margin-left of
	 * the light element that places it all the way to the right-
	 * most edge of the lightbar.
	 * @return {Number} The max margin-left of the lightbar
	 */
	Lightbar.prototype.getMaxMarginLeft = function() {
		const barWidth = this.lightbarElement.clientWidth;
		const lightWidth = this.lightElement.clientWidth;
		return barWidth - lightWidth;
	};

	Lightbar.prototype.updateLightWidth = function(toWidth) {
		this.data.lightWidth = toWidth;
		this.lightElement.style.width = toWidth;
	};

	Lightbar.prototype.updateLightSpeed = function(toSpeed) {
		this.data.speed = toSpeed;
	};

	Lightbar.prototype.isBouncing = function() {
		return this.data.isStarted;
	}

	Lightbar.prototype.startBounce = function() {
		this.data.isStarted = true;

		window.requestAnimationFrame(this._doBounce);
	};

	Lightbar.prototype.stopBounce = function() {
		this.data.isStarted = false;
	}

	/**
	 * Animates the movement of the light across the lightbar and back.
	 *
	 * Example of desired animation behavior:
	 * [|----]
	 * [-|---]
	 * [--|--]
	 * [---|-]
	 * [----|]
	 * [---|-]
	 * [--|--]
	 * [-|---]
	 * [|----]
	 *
	 * @param  {Number} timestamp The current animation frame's timestamp
	 */
	Lightbar.prototype._doBounce = function(timestamp) {
		if (!this._previous) {
			this._previous = timestamp;
			return window.requestAnimationFrame(this._doBounce);
		}

		this.data.maxMarginLeft = this.getMaxMarginLeft();
		// this is constant really but makes the code more readable than a random 0 all of the place
		this.data.minMarginLeft = 0;
		const pxPerMs = this.data.maxMarginLeft / this.data.speed;

		const timeDelta = timestamp - this._previous;
		const pxDelta = timeDelta * pxPerMs;
		const currentMarginLeft = this.lightElement.style.marginLeft;
		const parsedMarginLeft = currentMarginLeft !== '' ? parseInt(currentMarginLeft) : 0;

		switch (this.data.movementDirection) {
			case 'left':
				this._handleMoveLeft(
					parsedMarginLeft,
					pxDelta
				);
				break;
			case 'right':
				this._handleMoveRight(
					parsedMarginLeft,
					pxDelta
				);
				break;
		}

		if (this.data.isStarted) {
			this._previous = timestamp;
			window.requestAnimationFrame(this._doBounce)
		} else {
			// animation has been stopped
			this._previous = null;
		}
	};

	Lightbar.prototype._handleMoveLeft = function(currentMarginLeft, pxDelta) {
		const nextMarginLeft = currentMarginLeft - pxDelta;

		if (currentMarginLeft === this.data.minMarginLeft) {
			this.data.movementDirection = 'right';
			this._handleMoveRight(currentMarginLeft, pxDelta);
		} else if (nextMarginLeft < this.data.minMarginLeft) {
			/**
			the next required movement would move past the left-most
			boundary, so we need to split the difference. For example,
			if pxDelta is 3 and our currentMarginLeft looks like this:
			[-|----------]
			then we want to end up here
			[--|---------]
			because we spend 1 getting to the end and then would need to turn around and go 2 more
			
			if we don't do this then the edges of the lightbar will appear to lag
			
			Therefore, we can find the correct difference by getting the abs of nextMarginLeft;
			*/
			const inBoundsMarginLeft = Math.abs(nextMarginLeft);
			this.lightElement.style.marginLeft = inBoundsMarginLeft + 'px';
			this.data.movementDirection = 'right';
		} else {
			this.lightElement.style.marginLeft = nextMarginLeft + 'px';
		}
	};

	Lightbar.prototype._handleMoveRight = function(currentMarginLeft, pxDelta) {
		const nextMarginLeft = currentMarginLeft + pxDelta;

		if (currentMarginLeft === this.data.maxMarginLeft) {
			this.data.movementDirection = 'left';
			this._handleMoveLeft(currentMarginLeft, pxDelta);
		} else if (nextMarginLeft > this.data.maxMarginLeft) {
			/**
			the next required movement would move past the right-most
			boundary, so we need to split the difference. For example,
			if pxDelta is 3 and our currentMarginLeft looks like this:
			[---------|--]
			then we want to end up here
			[----------|-]
			because we spend 2 getting to the end and then would need to turn around

			if we don't do this then the edges of the lightbar will appear to lag

			Therefore, we can find the correct difference by subtracting max from our next and then subtracting that from the max. We also need to reverse the movement direction.
			*/
			const inBoundsMarginLeft = this.data.maxMarginLeft - (nextMarginLeft - this.data.maxMarginLeft);
			this.lightElement.style.marginLeft = inBoundsMarginLeft + 'px';
			this.data.movementDirection = 'left';
		} else {
			this.lightElement.style.marginLeft = nextMarginLeft + 'px';
		}
	};

    Lightbar.prototype.setVisible = function(visible) {
    	this.visible = visible;
        if (visible) {
            this.rootElement.style.display = 'flex';
        } else {
            this.rootElement.style.display = 'none';
        }
    };

	window.Lightbar = Lightbar;
})();
