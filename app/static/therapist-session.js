import io from 'socket.io-client';
import TherapistLightbarController from './lib/TherapistLightbarController';
import Lightbar from './lib/Lightbar';
import Audiobar from './lib/Audiobar';
import TherapistAudiobarController from './lib/TherapistAudiobarController';
import TherapistMethodController from './lib/TherapistMethodController';
import './lib/toggleTheme';
import './lib/Clipboard';
import './therapist-session.css';

const socket = io();
const lb = new Lightbar(document.getElementById('light-container'), false);
const lbc = new TherapistLightbarController(
    lb,
    false,
    socket,
    document.querySelector('[name="light-width"]'),
    document.querySelector('[name="light-speed"]'),
    document.querySelector('[name="light-start"]'),
    document.getElementById('light-controls')
);

const ab = new Audiobar(document.getElementById('audio-container'), true);
const abc = new TherapistAudiobarController(
    ab,
    true,
    socket,
    document.getElementById('audio-pitch-container'),
    document.querySelector('[name="audio-speed"]'),
    document.querySelector('[name="audio-start"]'),
    document.getElementById('audio-controls')
);

new TherapistMethodController(lbc, abc, window.initialSettings);
