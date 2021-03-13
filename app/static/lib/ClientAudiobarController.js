function ClientAudiobarController(audiobar) {
    this.audiobar = audiobar;
}

ClientAudiobarController.prototype.handleNewSettings = function(newSettings) {
    this.audiobar.updateSettings(newSettings);
};

ClientAudiobarController.prototype.setVisible = function(visible) {
    this.audiobar.setVisible(visible);
};

export default ClientAudiobarController;
