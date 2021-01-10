import { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { receiveApiState } from '../reducers/lightbar';
import { BASE_URL } from '../constants';

const useApiState = (sessionId, { isTherapist, isStarted, isStopping, width, speed }, dispatch) => {
    const socketRef = useRef();

    useEffect(() => {
        if (sessionId) {
            socketRef.current = io(`${BASE_URL}/${sessionId}`);
        }
        return () => socketRef.current && socketRef.current.disconnect();
    }, [sessionId]);

    useEffect(() => {
        if (socketRef.current && isTherapist) {
            socketRef.current.emit('therapist-new-settings', {
                isStarted, isStopping, width, speed
            }, sessionId);
        }
    }, [socketRef, isTherapist, isStarted, isStopping, width, speed])

    useEffect(() => {
        if (!socketRef.current) {
            return;
        }

        if (!isTherapist) {
            socketRef.current.on(
                'client-new-settings',
                (receivedState) => dispatch(receiveApiState(receivedState))
            );
        } else {
            socketRef.current.off('client-new-settings');
        }
    }, [socketRef, isTherapist, dispatch]);
};

export default useApiState;
