import { useRef, useEffect } from 'react';
import { BASE_URL } from '../constants';

const getNewSessionId = () =>
    fetch(`${BASE_URL}/rest/session/`, {
        method: 'POST',
        mode: 'cors'
    })
    .catch(e => console.error(e))
    .then(r => {
        return r.json();
    })
    .then(({ session_id, initial_settings }) => ({ sessionId: session_id, initialSettings: initial_settings }));

export const useSessionId = () => {
    const sessionIdRef = useRef();

    useEffect(() => {
        const url = new URL(window.location);
        if (url.searchParams.has('sessionId')) {
            sessionIdRef.current = url.searchParams.get('sessionId');
        } else {
            getNewSessionId().then(({ sessionId }) => (sessionIdRef.current = sessionId));
        }
    }, []);

    return sessionIdRef.current;
};
