import React, { useEffect, useState } from 'react';
import { Text, Heading, View } from '@wp-g2/components';
import { Link } from 'react-router-dom';

import Lightbar from './Lightbar';
import useLightbarState from '../hooks/useLightbarState'
import useRequestAnimationFrame from '../hooks/useRequestAnimationFrame';
import { getNewSessionId } from '../api/sessionId';
import TherapistSettings from './TherapistSettings';

const TherapistLightbarContainer = () => {
    const [sessionId, setSessionId] = useState();

    useEffect(() => {
        getNewSessionId().then(({ sessionId }) => setSessionId(sessionId));
    }, []);

    const [lightbarState, dispatch] = useLightbarState({ isTherapist: true, sessionId });
    useRequestAnimationFrame(dispatch);
    return sessionId ? (
        <>
            <View css={{ margin: 'auto', width: '20rem' }}>
                <Heading size={1}>EMDR Lightbar</Heading>
                <Text>
                    <p>
                        Session ID to share with your client: <strong>{sessionId}</strong>
                    </p>
                    <p>
                        Unsure how to start? <Link to="/therapist/help/" target="_blank">Click here to get help</Link>.
                    </p>
                </Text>
                <TherapistSettings {...lightbarState} dispatch={dispatch} sessionId={sessionId} />
            </View>
            <Lightbar {...lightbarState} />
        </>
    ) : null;
};

export default TherapistLightbarContainer;
