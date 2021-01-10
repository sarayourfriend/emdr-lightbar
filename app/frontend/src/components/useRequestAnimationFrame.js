import { useRef, useEffect } from 'react';
import { requestAnimationFrameDelta } from '../reducers/lightbar';

const useRequestAnimationFrame = (dispatch) => {
    const previousTimestampRef = useRef();
    const requestRef = useRef();

    const dispatchDelta = (timestamp) => {
        if (previousTimestampRef.current) {
            const delta = timestamp - previousTimestampRef.current;
            dispatch(requestAnimationFrameDelta(delta));
        }
        previousTimestampRef.current = timestamp;
        requestAnimationFrame(dispatchDelta);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(dispatchDelta);
        return () => cancelAnimationFrame(requestRef.current);
    }, [])
};

export default useRequestAnimationFrame;
