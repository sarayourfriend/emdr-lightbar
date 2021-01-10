import React, { useCallback } from 'react';
import { setSpeed, setWidth, toggleStart } from '../reducers/lightbar';
import StartStopButton from './StartStopButton';
import Speed from './Speed';
import Width from './Width';

import './TherapistSettings.css';

const TherapistSettings = ({ isStarted, isStopping, width, speed, dispatch }) => {
    const handleToggleStart = useCallback(() => dispatch(toggleStart()), [dispatch]);
    const handleSetSpeed = useCallback((speed) => dispatch(setSpeed(speed)), [dispatch]);
    const handleSetWidth = useCallback((width) => dispatch(setWidth(width)), [dispatch]);

    return (
        <div className="therapist-settings">
            <Speed speed={speed} onChange={handleSetSpeed} />
            <Width width={width} onChange={handleSetWidth} />
            <StartStopButton
                isStarted={isStarted}
                isStopping={isStopping}
                onClick={handleToggleStart}
            />
        </div>
    )
};

export default TherapistSettings;
