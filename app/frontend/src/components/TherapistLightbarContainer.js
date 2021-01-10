import React from 'react';

import Lightbar from './Lightbar';
import useLightbarReducer from '../reducers/lightbar'
import useRequestAnimationFrame from './useRequestAnimationFrame';
import { useSessionId } from '../api/session';
import TherapistSettings from './TherapistSettings';

const TherapistLightbarContainer = () => {
    const [lightbarState, dispatch] = useLightbarReducer(true);
    useRequestAnimationFrame(dispatch);
    return (
        <>
            <TherapistSettings {...lightbarState} dispatch={dispatch} />
            <Lightbar {...lightbarState} />
        </>
    )
};

export default TherapistLightbarContainer;
