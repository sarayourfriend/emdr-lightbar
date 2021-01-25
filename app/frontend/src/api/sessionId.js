import { API_BASE_URL } from '../constants';

export const getNewSessionId = () =>
    fetch(`${API_BASE_URL}rest/session/`, {
        method: 'POST',
        mode: 'cors'
    })
    .catch(e => console.error(e))
    .then(r => {
        return r.json();
    })
    .then(({ session_id }) => ({ sessionId: session_id }));
