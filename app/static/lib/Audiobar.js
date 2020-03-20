(function() {
    const LEFT_SIDE = 0;
    const RIGHT_SIDE = 100;

    function Audiobar(rootElement, visible, initialData) {
        this.rootElement = rootElement;
        this.render(visible);
        this.data = Object.assign({
            isStarted: false,
            speed: 1000,
            pitch: 1000,
        }, initialData);

        this.initAudio();

        this.bounceAudio = this.bounceAudio.bind(this);
    }

    Audiobar.prototype.render = function(visible) {
        this.leftIndicator = document.getElementById('left-indicator');
        this.rightIndicator = document.getElementById('right-indicator');
        this.setVisible(visible);
    };

    Audiobar.prototype.initAudio = function() {
        this.audioContext = new AudioContext();
    };

    Audiobar.prototype.setSpeed = function(toSpeed) {
        this.data.speed = toSpeed;
        if (this.data.isStarted) {
            // restart the sound to use the new speed
            this.stopSound();
            this.startSound();
        }
    };

    Audiobar.prototype.toJSON = function() {
        return {
            type:' audiobar',
            isStarted: this.data.isStarted,
            speed: this.data.speed,
            pitch: this.data.pitch
        };
    };

    Audiobar.prototype.startSound = function() {
        this.oscillator = this.audioContext.createOscillator()
        this.panner = this.audioContext.createStereoPanner();
        this.oscillator.type = 'sine';
        this.oscillator.connect(this.panner).connect(this.audioContext.destination);

        // keep the existing side if it's there
        if (this._nextSide === undefined) {
            this._nextSide = LEFT_SIDE;
        }
        // "bounce" it once to initialize it to the left side
        this.bounceAudio();

        this.oscillator.start();

        this.interval = window.setInterval(this.bounceAudio, this.data.speed);
    };

    Audiobar.prototype.setIndicator = function(indicator, on) {
        if (on) {
            indicator.style.backgroundColor = 'black';
            indicator.style.color = 'white';
        } else {
            indicator.style.backgroundColor = 'white';
            indicator.style.color = 'black';
        }
    };

    Audiobar.prototype.bounceAudio = function() {
        this.panner.pan.setValueAtTime(this._nextSide, this.audioContext.currentTime);

        switch (this._nextSide) {
            case LEFT_SIDE:
                this.setIndicator(this.leftIndicator, true);
                this.setIndicator(this.rightIndicator, false);
                this._nextSide = RIGHT_SIDE;
                break;
            default:
            case RIGHT_SIDE:
                this._nextSide = LEFT_SIDE;
                this.setIndicator(this.leftIndicator, false);
                this.setIndicator(this.rightIndicator, true);
                break;
        }
    };

    Audiobar.prototype.stopSound = function() {
        this.oscillator.stop();
        window.clearInterval(this.interval);
        this.interval = null;
    };

    Audiobar.prototype.toggleSound = function() {
        if (this.data.isStarted) {
            this.data.isStarted = false;
            this.stopSound();
        } else {
            this.data.isStarted = true;
            this.startSound();
        }

        return this.data.isStarted;
    };

    Audiobar.prototype.setVisible = function(visible) {
        this.visible = visible;
        if (visible) {
            this.rootElement.style.display = 'flex';
        } else {
            this.rootElement.style.display = 'none';
        }
    };

    window.Audiobar = Audiobar;
})();
