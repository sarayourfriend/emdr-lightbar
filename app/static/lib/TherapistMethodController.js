const DEFAULT_METHOD = "light";
function TherapistMethodController(
	lightbarController,
	audiobarController,
	initialSettings
) {
	this.lightbarController = lightbarController;
	this.audiobarController = audiobarController;

	this.methodChoices = document.querySelectorAll('[name="method-choice"]');
	this.methodChoices.forEach((methodChoice) => {
		methodChoice.checked = methodChoice.value === initialSettings.type;
		methodChoice.onchange = this.handleMethodChange.bind(this);
	});
	this.handleInitialSettings(initialSettings);
}

TherapistMethodController.prototype.handleInitialSettings = function (
	initialSettings
) {
	switch (initialSettings.type) {
		case "lightbar":
			this.lightbarController.setVisible(true);
			this.lightbarController.handleInitialSettings(initialSettings);
			this.audiobarController.setVisible(false);
			break;
		case "audiobar":
			this.lightbarController.setVisible(false);
			this.audiobarController.setVisible(true);
			this.audiobarController.handleInitialSettings(initialSettings);
			break;
	}
};

TherapistMethodController.prototype.handleMethodChange = function (e) {
	const methodChoice = e.target;

	switch (methodChoice.value) {
		case "lightbar":
			this.audiobarController.setVisible(false);
			this.lightbarController.setVisible(true);
			this.lightbarController.emitNewSettings();
			break;
		default:
		case "audiobar":
			this.lightbarController.setVisible(false);
			this.audiobarController.setVisible(true);
			this.audiobarController.emitNewSettings();
	}
};

export default TherapistMethodController;
