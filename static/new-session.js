(function() {
	const lb = new Lightbar(document.getElementById('light-container'));
	const controls = new SessionControls(
		lb,
		document.querySelector('[name="light-width"]'),
		document.querySelector('[name="light-speed"]'),
		document.querySelector('[name="start"]'),
		document.getElementById('link-display')
	);
})();
