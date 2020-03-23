(function() {
	const lb = new Lightbar(document.getElementById('light-container'));
	const ab = new Audiobar(document.getElementById('audio-container'));
	const lbc = new PatientLightbarController(lb);
	const abc = new PatientAudiobarController(ab);
	new PatientMethodController(lbc, abc);
})();
