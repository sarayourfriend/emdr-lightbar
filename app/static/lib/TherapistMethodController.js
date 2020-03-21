(function() {
    const DEFAULT_METHOD = 'light';
    function TherapistMethodController(
        lightbarController,
        audiobarController,
    ) {
        this.lightbarController = lightbarController;
        this.audiobarController = audiobarController;
        this.currentMethod = null;

        this.methodChoices = document.querySelectorAll('[name="method-choice"]');
        this.methodChoices.forEach(methodChoice => {
            if (methodChoice.checked) {
                this.setMethod(methodChoice.value);
            }
            methodChoice.onchange = this.handleMethodChange.bind(this);
        });

        if (!this.currentMethod) {
            this.setMethod(DEFAULT_METHOD);
        }
    }

    TherapistMethodController.prototype.setMethod = function(method) {
        this.currentMethod = method;
        switch (method) {
            case 'light':
                this.audiobarController.setVisible(false);
                this.lightbarController.setVisible(true);
                this.lightbarController.emitNewSettings();
                break;
            default:
            case 'audio':
                this.lightbarController.setVisible(false);
                this.audiobarController.setVisible(true);
                this.audiobarController.emitNewSettings();
        }
    }

    TherapistMethodController.prototype.handleMethodChange = function(e) {
        const methodChoice = e.target;
        this.setMethod(methodChoice.value)
    };

    window.TherapistMethodController = TherapistMethodController;
})();
