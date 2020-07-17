(function() {
    const constants = {
        minLightSpeed: 100,
        maxLightSpeed: 3000,
        defaultLightSpeed: 1000,
        minMarginLeft: 0,
        targetStoppingSpeed: 3000,
        
        minAudioSpeed: 500,
        maxAudioSpeed: 1500,

    };

    window.emdrGetConstant = function(constant) {
        return constants[constant];
    };

    window.MovementDirection = {
        Right: 'right',
        Left: 'left',
    }
})();
