import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import debounce from 'lodash.debounce';
import { receiveApiState } from '../reducers/lightbar';
import { BASE_URL } from '../constants';

const debouncedEmitTherapistNewSettings = debounce((socket, newSettings, sessionId) => {
    console.log('emitting');
    socket.emit('therapist-new-settings', newSettings, sessionId);
}, 100, { maxWait: 300 });

const useApiState = (sessionId, { isTherapist, isStarted, isStopping, width, speed, stoppingBounceCount }, dispatch) => {
    const socketRef = useRef();
    window.socket = socketRef;

    useEffect(() => {
        if (sessionId) {
            const url = isTherapist ? BASE_URL : `${BASE_URL}/${sessionId}`;
            socketRef.current = io(url);
        }
    }, [isTherapist, sessionId]);

    useEffect(() => {
        if (!socketRef.current) return;

        if (isTherapist) {
            debouncedEmitTherapistNewSettings(socketRef.current, {
                isStarted, isStopping, width, speed, stoppingBounceCount
            }, sessionId);
        }
    }, [isTherapist, isStarted, isStopping, width, speed, sessionId, stoppingBounceCount]);

    useEffect(() => {
        if (!socketRef.current) return;

        if (!isTherapist) {
            socketRef.current.on(
                'client-new-settings',
                (receivedState) => {
                    console.log('receving', receivedState);
                    dispatch(receiveApiState(receivedState))
                },
            );
        }
    }, [isTherapist, dispatch]);
};

export default useApiState;
