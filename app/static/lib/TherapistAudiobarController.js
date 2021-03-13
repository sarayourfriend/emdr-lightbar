import { emdrGetConstant } from './utils';

export default class TherapistAudiobarController {
    constructor(audiobar,
        visible,
        socket,
        pitchContainer,
        speedRange,
        startButton,
        rootElement) {
        this.maxSpeed = emdrGetConstant('maxAudioSpeed');
        this.minSpeed = emdrGetConstant('minAudioSpeed');
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

    initSpeedAndPitch() {
        this._renderPitchButtons();
        this._updateSpeed();
    }
    
    _renderPitchButtons() {
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
    }

    emitNewSettings() {
        this.socket.emit('therapist-new-settings', this.audiobar);
    }
    
    handleInitialSettings(initialSettings) {
        this.audiobar.updateSettings(initialSettings);
        if (initialSettings.isStarted) {
            this.startButton.innerText = 'Stop';
        }
    }

    _updatePitch(buttonClicked) {
        const pitchName = buttonClicked.dataset.pitchName;
        this.audiobar.setPitch(pitchName);
    }
    
    _updateSpeed() {
        const value = this.speedRange.value;
        const percentage = (100 - parseInt(value)) / 100;
        const newSpeed = ((this.maxSpeed - this.minSpeed) * percentage) + this.minSpeed;
        this.audiobar.setSpeed(newSpeed);
    }
    
    handlePitchClick(buttonClicked) {
        this._updatePitch(buttonClicked);
        this.emitNewSettings();
    }
    
    handleSpeedChange() {
        this._updateSpeed();
        this.emitNewSettings();
    }
    
    toggleSound() {
        const isSounding = this.audiobar.toggleSound();
        this.emitNewSettings();
        if (isSounding) {
            this.startButton.innerText = 'Stop';
        } else {
            this.startButton.innerText = 'Start';
        }
    }
    
    setVisible(visible) {
        this.visible = visible;
        if (visible) {
            this.rootElement.style.display = 'flex';
            this.startButton.innerText = 'Start';
        } else {
            this.rootElement.style.display = 'none';
        }
        this.audiobar.setVisible(visible);
    }
}
