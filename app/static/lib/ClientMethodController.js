(function() {
    function ClientMethodController(
        lightbarController,
        audiobarController,
        initialSettings
        ) {
        this.lightbarController = lightbarController;
        this.audiobarController = audiobarController;

        window.addEventListener('load', () => {
            const eventSource = new EventSource(`/client/settings/${window.sessionId}`);
            eventSource.addEventListener('publish', console.log);
            eventSource.onpublish = (e) => console.log('open!', e);
            eventSource.onerror = console.error;
            eventSource.onmessage = (event) => {
                const settings = JSON.parse(event.data);
                console.log(settings);
                this.handleNewSettings(settings);
            }
        })
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

    window.ClientMethodController = ClientMethodController;
})();
