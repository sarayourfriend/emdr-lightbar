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
	function Lightbar(rootElement, initialData) {
		this.rootElement = rootElement;
		this.render();
		this.data = Object.assign({
			isStarted: false,
			speed: 1000,
			movementDirection: 'right',
			maxMarginLeft: this.getMaxMarginLeft(),
			// @todo use lightWidth to set the initial width of the light element
			lightWidth: '2%',
			isStopping: false,
		}, initialData);

		this._doBounce = this._doBounce.bind(this);

		this.minMarginLeft = emdrGetConstant('minMarginLeft');
	}

	Lightbar.prototype.render = function() {
		this.lightbarElement = document.getElementById('lightbar');
		this.lightElement = document.getElementById('light');
	};

	Lightbar.prototype.toJSON = function() {
		return {
			type: 'lightbar',
			isStarted: this.data.isStarted,
			speed: this.data.speed,
			lightWidth: this.data.lightWidth,
			isStopping: this.data.isStopping,
			stoppingBounceCount: this.data.stoppingBounceCount,
			stoppingSpeed: this.data.stoppingSpeed
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
		this.data.isStopping = false;
		this.data.stoppingBounceCount = 0;
		this.data.onStop = null;
		this.data.frames = [];

		window.requestAnimationFrame(this._doBounce);
	};

	Lightbar.prototype.stopBounce = function(then) {
		if (this.data) {
			this.data.isStarted = false;
			this.data.isStopping = true;
			this.data.stoppingBounceCount = 0;
			this.data.stoppingSpeed = this.data.speed;
			this.data.onStop = then;
		}
	};

	Lightbar.prototype._isAtMidpoint = function() {
		const currentMarginLeft = this.lightElement.style.marginLeft;
		const parsedMarginLeft = currentMarginLeft !== '' ? parseInt(currentMarginLeft) : 0;

		const midpoint = this.data.maxMarginLeft / 2;
		const tolerance = this.data.maxMarginLeft * 0.02;
		const lowerTolerance = midpoint - (tolerance / 2);
		const upperTolerance = midpoint + (tolerance / 2);
		
		if (parsedMarginLeft > lowerTolerance && parsedMarginLeft < upperTolerance) {
			// within midpoint
			return true;
		}
		return false;
	}

	Lightbar.prototype._getAveragePxDelta = function() {
		return this.data.frames.reduce((acc, frame) => acc + frame, 0) / this.data.frames.length;
	}
	
	/**
	 * @todo(saramarcondes) fix this... it doesn't _really_ work that well...
	 * mostly just automatically slows down to the target speed
	 */
	Lightbar.prototype._getNextStoppingSpeed = function() {
		const targetSpeed = emdrGetConstant('targetStoppingSpeed');
		if (this.data.stoppingSpeed >= targetSpeed) {
			// we're already at the targetSpeed
			return this.data.stoppingSpeed;
		}
		
		const midpoint = this.data.maxMarginLeft / 2;
		// "speed" is inverse so target will always be greater than the current speed
		const distanceToTargetSpeed = targetSpeed - this.data.speed;
		const averagePxDelta = this._getAveragePxDelta();
		const estimatedFramesRemaining = midpoint / averagePxDelta;

		const speedDelta = distanceToTargetSpeed / estimatedFramesRemaining;

		return this.data.stoppingSpeed + speedDelta;
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
		const speed = this.data.isStopping ? this.data.stoppingSpeed : this.data.speed;
		const pxPerMs = this.data.maxMarginLeft / speed;

		const timeDelta = timestamp - this._previous;
		const pxDelta = timeDelta * pxPerMs;
		if (!this.data.isStopping) {
			this.data.frames.push(pxDelta);
		}
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

		if (this.data.stoppingBounceCount === 2) {
			// we've bounced twice
			if (this._isAtMidpoint()) {
				this.data.isStarted = false;
				this.data.isStopping = false;

				if (typeof this.data.onStop === 'function') {
					this.data.onStop();
				}
			}
		}

		if (this.data.isStopping && this.data.stoppingBounceCount === 2) {
			// speed is actually "time to travel" so bigger is slower
			const nextStoppingSpeed = this._getNextStoppingSpeed();
			this.data.stoppingSpeed = nextStoppingSpeed;
		}

		if (this.data.isStarted || this.data.isStopping) {
			this._previous = timestamp;
			window.requestAnimationFrame(this._doBounce)
		} else {
			// animation has been stopped
			this._previous = null;
		}
	};

	Lightbar.prototype._changeDirection = function(to) {
		this.data.movementDirection = to;
		if (this.data.isStopping) {
			this.data.stoppingBounceCount += 1;
		}
	}

	Lightbar.prototype._handleMoveLeft = function(currentMarginLeft, pxDelta) {
		const nextMarginLeft = currentMarginLeft - pxDelta;

		if (currentMarginLeft === this.minMarginLeft) {
			this._changeDirection(MovementDirection.Right);
			this._handleMoveRight(currentMarginLeft, pxDelta);
		} else if (nextMarginLeft < this.minMarginLeft) {
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
			this._changeDirection(MovementDirection.Right);
		} else {
			this.lightElement.style.marginLeft = nextMarginLeft + 'px';
		}
	};

	Lightbar.prototype._handleMoveRight = function(currentMarginLeft, pxDelta) {
		const nextMarginLeft = currentMarginLeft + pxDelta;

		if (currentMarginLeft === this.data.maxMarginLeft) {
			this._changeDirection(MovementDirection.Left);
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
			this._changeDirection(MovementDirection.Left);
		} else {
			this.lightElement.style.marginLeft = nextMarginLeft + 'px';
		}
	};

    Lightbar.prototype.setVisible = function(visible, then) {
    	this.visible = visible;
        if (visible) {
            this.rootElement.style.display = 'flex';
        } else {
            this.stopBounce(then);
            this.rootElement.style.display = 'none';
        }
    };

	window.Lightbar = Lightbar;
})();
