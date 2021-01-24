import { useReducer } from 'react';
import { reducer, initialState } from '../reducers/lightbar';
import useApiState from './useApiState';

export default function useLightbarState({ isTherapist, sessionId }) {
    const [state, dispatch] = useReducer(reducer, { ...initialState, isTherapist });
    useApiState(sessionId, state, dispatch);
    return [state, dispatch];
};
