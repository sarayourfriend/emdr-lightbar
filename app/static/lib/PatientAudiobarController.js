(function() {
    function PatientAudiobarController(audiobar) {
        this.audiobar = audiobar;
    }

    PatientAudiobarController.prototype.handleNewSettings = function(newSettings) {
        this.audiobar.updateSettings(newSettings);
    };

    PatientAudiobarController.prototype.setVisible = function(visible) {
        this.audiobar.setVisible(visible);
    };

    window.PatientAudiobarController = PatientAudiobarController;
})();
