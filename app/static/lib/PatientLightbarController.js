(function() {
    function PatientLightbarController(lightbar) {
        this.lightbar = lightbar;
    }

    PatientLightbarController.prototype.handleNewSettings = function(newSettings) {
        this.lightbar.updateSettings(newSettings);
    };

    PatientLightbarController.prototype.setVisible = function(visible) {
        this.lightbar.setVisible(visible);
    };

    window.PatientLightbarController = PatientLightbarController;
})();
