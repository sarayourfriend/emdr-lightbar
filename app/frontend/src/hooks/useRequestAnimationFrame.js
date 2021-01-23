import { useRef, useEffect, useCallback } from 'react';
import { requestAnimationFrameDelta } from '../reducers/lightbar';

const useRequestAnimationFrame = (dispatch) => {
    const previousTimestampRef = useRef();
    const requestRef = useRef();

    const dispatchDelta = useCallback(
        (timestamp) => {
            if (previousTimestampRef.current) {
                const delta = timestamp - previousTimestampRef.current;
                dispatch(requestAnimationFrameDelta(delta));
            }
            previousTimestampRef.current = timestamp;
            requestAnimationFrame(dispatchDelta);
        },
        [dispatch]
    );

    useEffect(() => {
        requestRef.current = requestAnimationFrame(dispatchDelta);
        return () => cancelAnimationFrame(requestRef.current);
    }, [dispatchDelta])
};

export default useRequestAnimationFrame;
