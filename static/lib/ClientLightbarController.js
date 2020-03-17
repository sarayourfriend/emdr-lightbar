(function() {
    function ClientLightbarController(lightbar) {
        this.lightbar = lightbar;

        this.initSocket();
    }

    ClientLightbarController.prototype.initSocket = function() {
        this.socket = io(window.location.href);

        /**
         * This event is emitted by the server whenever the therapist updates
         * the lightbar settings on their end.
         */
        this.socket.on('client-new-settings', this.handleNewSettings.bind(this));
    };

    ClientLightbarController.prototype.handleNewSettings = function(newSettings) {
        this.lightbar.updateSettings(newSettings);
    };

    window.ClientLightbarController = ClientLightbarController;
})();
