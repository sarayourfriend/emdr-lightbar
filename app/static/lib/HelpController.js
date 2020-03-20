(function() {
    function HelpController(element) {
        this.element = element;
        this.isShowing = true;
    }

    HelpController.prototype.toggle = function(button) {
        if (this.isShowing) {
            this.isShowing = false;
            this.element.style.display = 'none';
            button.innerText = 'Show help';
        } else {
            this.isShowing = true;
            this.element.style.display = 'block';
            button.innerText = 'Hide help';
        }
    };

    window.HelpController = HelpController;
})();
