(function() {
    function ClientSession(lightbar) {
        this.lightbar = lightbar;

        this.initSocket();
    }

    ClientSession.prototype.initSocket = function() {
        this.socket = io(window.location.href);

        this.socket.on('client-new-settings', this.handleNewSettings.bind(this));
    };

    ClientSession.prototype.handleNewSettings = function(newSettings) {
        this.lightbar.updateSettings(newSettings);
    };

    window.ClientSession = ClientSession;
})();