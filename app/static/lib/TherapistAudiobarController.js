(function() {
    function TherapistAudiobarController(
        audiobar,
        visible,
        socket,
        pitchContainer,
        speedRange,
        startButton,
        rootElement
    ) {
        this.maxSpeed = 1500;
        this.minSpeed = 500;
        this.audiobar = audiobar;
        this.socket = socket;
        this.pitchContainer = pitchContainer;
        this.speedRange = speedRange;
        this.startButton = startButton;
        this.rootElement = rootElement;

        this.speedRange.onchange = this.handleSpeedChange.bind(this);
        this.startButton.onclick = this.toggleSound.bind(this);

        this.initSpeedAndPitch();
        this.setVisible(visible);
    }

    TherapistAudiobarController.prototype.initSpeedAndPitch = function() {
        this._renderPitchButtons();
        this._updateSpeed();
        this.emitNewSettings();
    };

    TherapistAudiobarController.prototype._renderPitchButtons = function() {
        const availablePitches = this.audiobar.getPitches();
        Object.keys(availablePitches).forEach(pitchName => {
            const pitchButton = document.createElement('button');
            pitchButton.type = 'button';
            pitchButton.innerText = pitchName;
            pitchButton.dataset.pitchName = pitchName;
            pitchButton.classList.add('pitch-button');
            pitchButton.onclick = () => this.handlePitchClick(pitchButton);
            this.pitchContainer.appendChild(pitchButton);
        });
    };

    TherapistAudiobarController.prototype.emitNewSettings = function() {
        this.socket.emit('therapist-new-settings', this.audiobar);
    };

    TherapistAudiobarController.prototype._updatePitch = function(buttonClicked) {
        const pitchName = buttonClicked.dataset.pitchName;
        this.audiobar.setPitch(pitchName);
    };

    TherapistAudiobarController.prototype._updateSpeed = function() {
        const value = this.speedRange.value;
        const percentage = (100 - parseInt(value)) / 100;
        const newSpeed = ((this.maxSpeed - this.minSpeed) * percentage) + this.minSpeed;
        this.audiobar.setSpeed(newSpeed);
    };

    TherapistAudiobarController.prototype.handlePitchClick = function(buttonClicked) {
        this._updatePitch(buttonClicked);
        this.emitNewSettings();
    };

    TherapistAudiobarController.prototype.handleSpeedChange = function() {
        this._updateSpeed();
        this.emitNewSettings();
    };

    TherapistAudiobarController.prototype.toggleSound = function() {
        const isSounding = this.audiobar.toggleSound();
        this.emitNewSettings();
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
            this.startButton.innerText = 'Start';
        } else {
            this.rootElement.style.display = 'none';
        }
        this.audiobar.setVisible(visible);
    };

    window.TherapistAudiobarController = TherapistAudiobarController;
})();
