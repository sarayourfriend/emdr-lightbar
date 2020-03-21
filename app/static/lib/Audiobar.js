(function() {
    // @todo fix popping while panning
    const LEFT_SIDE = -0.5;
    const RIGHT_SIDE = 0.5;

    // in Hz
    const PITCHES = {
        F3: 172.630,
        G3: 193.770,
        A3: 217.500,
        B3: 244.135,
        C4: 258.653,
        D4: 290.328,
        E4: 325.882,
        F4: 345.260,
        G4: 387.541,
        A4: 435.000, // :-)
        B4: 488.271
    };

    function Audiobar(rootElement, visible, initialData) {
        this.rootElement = rootElement;
        this.render(visible);
        this.data = Object.assign({
            isStarted: false,
            speed: 1000,
            pitch: PITCHES.D4,
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

    Audiobar.prototype.getPitches = function() {
        return PITCHES;
    };

    Audiobar.prototype.setPitch = function(toPitchByName) {
        this.data.pitch = PITCHES[toPitchByName];

        if (this.interval) {
            this.oscillator.frequency.setTargetAtTime(
                this.data.pitch,
                this.audioContext.currentTime,
                0.02
            );
        }
    };

    Audiobar.prototype.setSpeed = function(toSpeed) {
        this.data.speed = toSpeed;
        if (this.data.isStarted) {
            // restart the interval with the new speed
            window.clearInterval(this.interval);
            this.interval = window.setInterval(this.bounceAudio, this.data.speed);
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
        this.oscillator = this.audioContext.createOscillator();
        this.panner = this.audioContext.createStereoPanner();
        this.gain = this.audioContext.createGain();
        this.oscillator.type = 'sine';
        this.oscillator
            .connect(this.panner)
            .connect(this.gain)
            .connect(this.audioContext.destination);

        // keep the existing side if it's there
        if (this._nextSide === undefined) {
            this._nextSide = LEFT_SIDE;
        }
        // "bounce" it once to initialize it to the left side
        this.bounceAudio();

        // prevent popping on start by starting at a small volume and then ramping it up
        this.gain.gain.setValueAtTime(0.000001, this.audioContext.currentTime);
        this.oscillator.start();
        this.gain.gain.linearRampToValueAtTime(
            0.9,
            this.audioContext.currentTime + 0.5
        );

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
        if (!this.data.isStarted) {
            return;
        }

        console.log('nextSide', this._nextSide);
        this.panner.pan.linearRampToValueAtTime(
            this._nextSide,
            this.audioContext.currentTime + 0.1
        );

        switch (this._nextSide) {
            case LEFT_SIDE:
                this.setIndicator(this.leftIndicator, true);
                this.setIndicator(this.rightIndicator, false);
                this._nextSide = RIGHT_SIDE;
                break;
            default:
            case RIGHT_SIDE:
                this.setIndicator(this.leftIndicator, false);
                this.setIndicator(this.rightIndicator, true);
                this._nextSide = LEFT_SIDE;
                break;
        }
    };

    Audiobar.prototype.stopSound = function() {
        // stop the scheduled panning
        window.clearInterval(this.interval);

        // in the event that someone quickly clicks start and stop,
        // this will prevent the "stopping" routine's schedule
        // from being interrupted by the starting routine's schedule
        // which takes considerably longer
        //
        // starting takes 0.5 seconds and stopping takes 0.3; so if
        // you start and then stop within those first 0.2 seconds,
        // you'll end up with conflicting values being schedule
        // on the gain and get very strange effects
        //
        // We cannot prevent popping in this case, but at least
        // we can prevent some jostling around
        this.gain.gain.cancelScheduledValues(this.audioContext.currentTime);

        // while a single linear ramp is sufficient to
        // prevent the popping when the sound is starting
        // two are necessary while stopping the sound
        //
        // I really don't know why this is (some kind of
        // science about the human ear + how speakers are
        // built)
        //
        // I'll note that with only one linear ramp it
        // sounded fine with headphones but the pop
        // was consistent with laptop speakers; it may
        // be overkill to fix this because the audio panning
        // feature is only useful when you can isolate
        // both speakers per ear (i.e., when you have
        // headphones, basically) buuuut because I
        // can't predict what kinds of heaphones people
        // have, it seems like it's safest to just fix it
        // as much as possible.
        //
        // In any case, now it sounds great on my nice sony
        // headphones, and on less-than-nice macbook pro speakers
        //
        // I can't find my apple earbuds to test with
        // at the moment, but I can revisit this once I'm
        // able to test with more common headphone
        // situations
        //
        // The way it's done here will take 0.11 seconds to fully
        // stop, but really by 0.08 (this number is a guess) seconds,
        // the sound will be imperceptible. So even though it
        // will technically take 0.11 seconds to fully stop,
        // the user shouldn't notice anything about it other than
        // a gentle and soft stop to the tone :)
        this.gain.gain.linearRampToValueAtTime(
            // I'm completely stumped as to why it is necessary to
            // ramp first to the current gain, but if you adjust this
            // even by 0.1 it will cause a popping noise to happen
            // at the start of the gain wind-down
            0.9,
            this.audioContext.currentTime + 0.01
        );
        this.gain.gain.linearRampToValueAtTime(
            0.0001,
            this.audioContext.currentTime + 0.1
        );

        this.oscillator.stop(this.audioContext.currentTime + 0.11);

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
