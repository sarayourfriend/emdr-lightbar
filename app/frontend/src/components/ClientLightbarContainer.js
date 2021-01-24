import React from 'react';
import { useParams } from 'react-router-dom';

import Lightbar from './Lightbar';
import useLightbarState from '../hooks/useLightbarState'
import useRequestAnimationFrame from '../hooks/useRequestAnimationFrame';

const ClientLightbarContainer = () => {
    const { sessionId } = useParams();
    const [lightbarState, dispatch] = useLightbarState({ isTherapist: false, sessionId });
    useRequestAnimationFrame(dispatch);
    return (
        <>
            <Lightbar {...lightbarState} />
        </>
    );
};

export default ClientLightbarContainer;
