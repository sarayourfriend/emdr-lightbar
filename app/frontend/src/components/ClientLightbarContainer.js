import React from 'react';
import { useParams } from 'react-router-dom';

import Lightbar from './Lightbar';
import useLightbarReducer from '../reducers/lightbar'
import useRequestAnimationFrame from '../hooks/useRequestAnimationFrame';

const ClientLightbarContainer = () => {
    const { sessionId } = useParams();
    const [lightbarState, dispatch] = useLightbarReducer({ isTherapist: false, sessionId });
    useRequestAnimationFrame(dispatch);
    return (
        <>
            <Lightbar {...lightbarState} />
        </>
    );
};

export default ClientLightbarContainer;
