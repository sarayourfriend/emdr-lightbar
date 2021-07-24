import Lightbar from "./lib/Lightbar";
import Audiobar from "./lib/Audiobar";
import TherapistLightbarController from "./lib/TherapistLightbarController";
import TherapistAudiobarController from "./lib/TherapistAudiobarController";
import TherapistMethodController from "./lib/TherapistMethodController";
import "./therapist-session.css";
import { copy } from "./lib/Clipboard";

window.Clipboard = { copy };

const lb = new Lightbar(document.getElementById("light-container"), false);
const lbc = new TherapistLightbarController(
	lb,
	false,
	document.querySelector('[name="light-width"]'),
	document.querySelector('[name="light-speed"]'),
	document.querySelector('[name="light-start"]'),
	document.getElementById("light-controls")
);

const ab = new Audiobar(document.getElementById("audio-container"), true);
const abc = new TherapistAudiobarController(
	ab,
	true,
	document.getElementById("audio-pitch-container"),
	document.querySelector('[name="audio-speed"]'),
	document.querySelector('[name="audio-start"]'),
	document.getElementById("audio-controls")
);

new TherapistMethodController(lbc, abc, window.initialSettings);
