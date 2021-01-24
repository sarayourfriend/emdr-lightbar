import React, { useCallback } from 'react';
import { setSpeed, setWidth, toggleStart } from '../../reducers/lightbar';
import StartStopButton from './StartStopButton';
import Speed from './Speed';
import Width from './Width';

const TherapistSettings = ({ isStarted, isStopping, width, speed, sessionId, dispatch }) => {
    const handleToggleStart = useCallback(() => dispatch(toggleStart()), [dispatch]);
    const handleSetSpeed = useCallback((speed) => dispatch(setSpeed(speed)), [dispatch]);
    const handleSetWidth = useCallback((width) => dispatch(setWidth(width)), [dispatch]);

    return (
        <>
            <Speed speed={speed} onChange={handleSetSpeed} />
            <Width width={width} onChange={handleSetWidth} />
            <StartStopButton
                isStarted={isStarted}
                isStopping={isStopping}
                sessionId={sessionId}
                onClick={handleToggleStart}
            />
        </>
    )
};

export default TherapistSettings;
