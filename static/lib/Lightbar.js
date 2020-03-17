(function() {
	function Lightbar(rootElement, initialData) {
		this.rootElement = rootElement;
		this.render();
		this.data = Object.assign({
			isStarted: false,
			speed: 1000,
			movementDirection: 'right',
			minMarginLeft: 0,
			maxMarginLeft: this.getMaxMarginLeft(),
			lightWidth: '2em',
		}, initialData);

		this._doBounce = this._doBounce.bind(this);
	}

	Lightbar.prototype.render = function() {
		this.lightbarElement = document.createElement('div');
		this.lightbarElement.id = 'lightbar';
		this.lightElement = document.createElement('div');
		this.lightElement.id = 'light';

		this.lightbarElement.appendChild(this.lightElement);
		this.rootElement.appendChild(this.lightbarElement);
	};

	Lightbar.prototype.toJSON = function() {
		return {
			isStarted: this.data.isStarted,
			speed: this.data.speed,
			lightWidth: this.data.lightWidth
		};
	};

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
			because we spend 2 getting to the end and then would need to turn around
			
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

	window.Lightbar = Lightbar;
})();
