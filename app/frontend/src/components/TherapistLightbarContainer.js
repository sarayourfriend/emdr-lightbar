import React, { useEffect, useState } from 'react';

import Lightbar from './Lightbar';
import useLightbarState from '../hooks/useLightbarState'
import useRequestAnimationFrame from '../hooks/useRequestAnimationFrame';
import { getNewSessionId } from '../api/sessionId';
import TherapistSettings from './TherapistSettings';
import { Link } from 'react-router-dom';

const TherapistLightbarContainer = () => {
    const [sessionId, setSessionId] = useState();

    useEffect(() => {
        getNewSessionId().then(({ sessionId }) => setSessionId(sessionId));
    }, []);

    const [lightbarState, dispatch] = useLightbarState({ isTherapist: true, sessionId });
    useRequestAnimationFrame(dispatch);
    return sessionId ? (
        <>
            <h1>EMDR Lightbar</h1>
            <p>
                Session ID to share with your client: {sessionId}
            </p>

            <p>
                Unsure how to start? <Link to="/therapist/help/" target="_blank">Click here to get help</Link>.
            </p>
            <TherapistSettings {...lightbarState} dispatch={dispatch} sessionId={sessionId} />
            <Lightbar {...lightbarState} />
        </>
    ) : null;
};

export default TherapistLightbarContainer;
