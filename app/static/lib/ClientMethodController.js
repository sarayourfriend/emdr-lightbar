import io from 'socket.io-client';

function ClientMethodController(
    lightbarController,
    audiobarController,
    initialSettings
    ) {
    this.lightbarController = lightbarController;
    this.audiobarController = audiobarController;

    const socket = io(window.location.href);
    socket.on('client-new-settings', this.handleNewSettings.bind(this));
    this.handleNewSettings(initialSettings);
}

ClientMethodController.prototype.handleNewSettings = function(newSettings) {
    switch (newSettings.type) {
        case 'lightbar':
            this.lightbarController.setVisible(true);
            this.lightbarController.handleNewSettings(newSettings);
            this.audiobarController.setVisible(false);
            break;
        case 'audiobar':
            this.lightbarController.setVisible(false);
            this.audiobarController.setVisible(true);
            this.audiobarController.handleNewSettings(newSettings);
            break;
    }
};

export default ClientMethodController;
