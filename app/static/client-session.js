import Lightbar from "./lib/Lightbar";
import Audiobar from "./lib/Audiobar";
import ClientLightbarController from "./lib/ClientLightbarController";
import ClientAudiobarController from "./lib/ClientAudiobarController";
import ClientMethodController from "./lib/ClientMethodController";

const lb = new Lightbar(document.getElementById("light-container"));
const ab = new Audiobar(document.getElementById("audio-container"));
const lbc = new ClientLightbarController(lb);
const abc = new ClientAudiobarController(ab);
new ClientMethodController(lbc, abc, window.initialSettings);
