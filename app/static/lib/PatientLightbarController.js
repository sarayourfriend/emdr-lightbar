(function() {
    function PatientLightbarController(lightbar) {
        this.lightbar = lightbar;

        this.initSocket();
    }

    PatientLightbarController.prototype.initSocket = function() {
        this.socket = io(window.location.href);

        /**
         * This event is emitted by the server whenever the therapist updates
         * the lightbar settings on their end.
         */
        this.socket.on('patient-new-settings', this.handleNewSettings.bind(this));
    };

    PatientLightbarController.prototype.handleNewSettings = function(newSettings) {
        this.lightbar.updateSettings(newSettings);
    };

    window.PatientLightbarController = PatientLightbarController;
})();
