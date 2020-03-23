(function() {
    function PatientMethodController(
        lightbarController,
        audiobarController
        ) {
        const socket = io(window.location.href);
        socket.on('patient-new-settings', function(newSettings) {
            switch (newSettings.type) {
                case 'lightbar':
                    lightbarController.setVisible(true);
                    lightbarController.handleNewSettings(newSettings);
                    audiobarController.setVisible(false);
                    break;
                case 'audiobar':
                    lightbarController.setVisible(false);
                    audiobarController.setVisible(true);
                    audiobarController.handleNewSettings(newSettings);
                    break;
            }
        });
    }

    window.PatientMethodController = PatientMethodController;
})();
