(function() {
    function HelpController(element, visible) {
        this.element = element;
        this.setVisible(visible);
    }

    HelpController.prototype.toggle = function(button) {
        this.setVisible(!this.visible);
        if (this.visible) {
            button.innerText = 'Hide help';
        } else {
            button.innerText = 'Show help';
        }
    }

    HelpController.prototype.setVisible = function(visible) {
        this.visible = visible;
        if (visible) {
            this.element.style.display = 'block';
        } else {
            this.element.style.display = 'none';
        }
    };

    window.HelpController = HelpController;
})();
