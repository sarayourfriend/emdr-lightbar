import React, { useEffect, useState } from 'react';

import Lightbar from './Lightbar';
import useLightbarReducer from '../reducers/lightbar'
import useRequestAnimationFrame from '../hooks/useRequestAnimationFrame';
import { getNewSessionId } from '../api/sessionId';
import TherapistSettings from './TherapistSettings';

const TherapistLightbarContainer = () => {
    const [sessionId, setSessionId] = useState();

    useEffect(() => {
        getNewSessionId().then(({ sessionId }) => setSessionId(sessionId));
    }, []);

    const [lightbarState, dispatch] = useLightbarReducer({ isTherapist: true, sessionId });
    useRequestAnimationFrame(dispatch);
    return sessionId ? (
        <>
            <h1>EMDR Lightbar</h1>
            <div>
                Session ID to share with your client: {sessionId}
            </div>
            <TherapistSettings {...lightbarState} dispatch={dispatch} sessionId={sessionId} />
            <Lightbar {...lightbarState} />
        </>
    ) : null;
};

export default TherapistLightbarContainer;
