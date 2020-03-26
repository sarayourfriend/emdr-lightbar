(function() {
    function ClientLightbarController(lightbar) {
        this.lightbar = lightbar;
    }

    ClientLightbarController.prototype.handleNewSettings = function(newSettings) {
        this.lightbar.updateSettings(newSettings);
    };

    ClientLightbarController.prototype.setVisible = function(visible) {
        this.lightbar.setVisible(visible);
    };

    window.ClientLightbarController = ClientLightbarController;
})();
