(function() {
    function TherapistAudiobarController(
        audiobar,
        visible,
        socket,
        pitchRange,
        speedRange,
        startButton,
        rootElement
    ) {
        this.maxSpeed = 1500;
        this.minSpeed = 500;
        this.audiobar = audiobar;
        this.socket = socket;
        this.pitchRange = pitchRange;
        this.speedRange = speedRange;
        this.startButton = startButton;
        this.rootElement = rootElement;

        this.pitchRange.onchange = this.handlePitchChange.bind(this);
        this.speedRange.onchange = this.handleSpeedChange.bind(this);
        this.startButton.onclick = this.toggleSound.bind(this);

        this.initSpeedAndPitch();
        this.setVisible(visible);
    }

    TherapistAudiobarController.prototype.initSpeedAndPitch = function() {
        this._updatePitch();
        this._updateSpeed();
        this.emitNewSettings();
    };

    TherapistAudiobarController.prototype.emitNewSettings = function() {
        this.socket.emit('therapist-new-settings', this.audiobar);
    };

    TherapistAudiobarController.prototype._updatePitch = function() {
        console.log('updatePitch');
    };

    TherapistAudiobarController.prototype._updateSpeed = function() {
        const value = this.speedRange.value;
        const percentage = parseInt(value) / 100;
        const newSpeed = ((this.maxSpeed - this.minSpeed) * percentage) + this.minSpeed;
        this.audiobar.setSpeed(newSpeed);
    };

    TherapistAudiobarController.prototype.handlePitchChange = function() {
        this._updatePitch();
        this.emitNewSettings();
    };

    TherapistAudiobarController.prototype.handleSpeedChange = function() {
        this._updateSpeed();
        this.emitNewSettings();
    };

    TherapistAudiobarController.prototype.toggleSound = function() {
        const isSounding = this.audiobar.toggleSound();
        if (isSounding) {
            this.startButton.innerText = 'Stop';
        } else {
            this.startButton.innerText = 'Start';
        }
    };

    TherapistAudiobarController.prototype.setVisible = function(visible) {
        this.visible = visible;
        if (visible) {
            this.rootElement.style.display = 'flex';
        } else {
            this.rootElement.style.display = 'none';
        }
    };

    window.TherapistAudiobarController = TherapistAudiobarController;
})();
