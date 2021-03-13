(function() {
	const lb = new Lightbar(document.getElementById('light-container'));
	const ab = new Audiobar(document.getElementById('audio-container'));
	const lbc = new ClientLightbarController(lb);
	const abc = new ClientAudiobarController(ab);
	new ClientMethodController(lbc, abc, window.initialSettings);
})();
