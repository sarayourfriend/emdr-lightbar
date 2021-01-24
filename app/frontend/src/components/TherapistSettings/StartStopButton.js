import React from 'react';

const StartStopButton = ({ isStopping, isStarted, onClick }) =>
    <button type="button" onClick={onClick} disabled={isStopping}>
        {isStarted ? 'Stop' : 'Start'}
    </button>;

export default StartStopButton;
