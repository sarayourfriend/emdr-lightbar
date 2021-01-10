import { useReducer } from 'react';
import useApiState from '../../socket/useApiState';
import { useSessionId } from '../../api/session';

import { REQUEST_ANIMATION_FRAME_DELTA, TOGGLE_START, SET_WIDTH, SET_SPEED, RECEIVE_API_STATE } from './actions';

const minMarginLeft = 0;

const reverseMovementDirection = (state) => {
    const nextMovementDirection = state.movementDirection === 'right' ? 'left' : 'right';
    const nextStoppingBounceCount = state.isStopping
        ? state.stoppingBounceCount + 1
        : state.stoppingBounceCount;

    return {
        ...state,
        movementDirection: nextMovementDirection,
        stoppingBounceCount: nextStoppingBounceCount,
    };
};

const bounceLeftSide = (state, nextMarginLeft) => {
    const bouncedMarginLeft = Math.abs(nextMarginLeft);
    return reverseMovementDirection({
        ...state,
        marginLeft: bouncedMarginLeft,
    });
};

const moveLeft = (state, pctDelta) => {
    const nextMarginLeft = state.marginLeft - pctDelta;
    if (nextMarginLeft < minMarginLeft) {
        return bounceLeftSide(state, nextMarginLeft);
    } else {
        return {
            ...state,
            marginLeft: nextMarginLeft,
        };
    }
};

const bounceRightSide = (state, nextMarginLeft) => {
    const bouncedMarginLeft = state.maxMarginLeft - (nextMarginLeft - state.maxMarginLeft);
    return reverseMovementDirection({ ...state, marginLeft: bouncedMarginLeft });
};

const moveRight = (state, pctDelta) => {
    const nextMarginLeft = state.marginLeft + pctDelta;
    if (nextMarginLeft > state.maxMarginLeft) {
        return bounceRightSide(state, nextMarginLeft);
    } else {
        return {
            ...state,
            marginLeft: nextMarginLeft,
        }
    }
};

const stop = (state) => {
    return {
        ...state,
        isStarted: false,
        isStopping: false,
        stoppingBounceCount: 0,
    };
};

const stopIfNeeded = (state) => {
    if (!state.isStopping || state.stoppingBounceCount < 2) {
        return state;
    }

    const midpoint = state.maxMarginLeft / 2;
    const tolerance = state.maxMarginLeft * 0.02;
    const lowerTolerance = midpoint - (tolerance / 2);
    const upperTolerance = midpoint + (tolerance / 2);

    const isAtMidpoint = state.marginLeft > lowerTolerance && state.marginLeft < upperTolerance;

    if (isAtMidpoint) {
        return stop(state);
    }

    return state;
};

const moveLightbar = (state, delta) => {
    const pctDelta = delta * (state.maxMarginLeft / state.speed);
    const nextState = state.movementDirection === 'right'
        ? moveRight(state, pctDelta)
        : moveLeft(state, pctDelta);

    return stopIfNeeded(nextState);
};

const startStopping = (state) => ({
    ...state,
    isStarted: false,
    isStopping: true,
    stoppingBounceCount: 0,
});

const start = (state) => ({
    ...state,
    isStarted: true,
});

const initialState = {
    isStarted: false,
    isStopping: false,
    stoppingBounceCount: 0,
    speed: 1000,
    movementDirection: 'right',
    maxMarginLeft: 98,
    marginLeft: 0,
    width: 2
};

const reducer = (state, action) => {
    switch (action.type) {
        case REQUEST_ANIMATION_FRAME_DELTA: {
            if (state.isStarted || state.isStopping) {
                return moveLightbar(state, action.delta);
            }
            return state;
        }

        case SET_SPEED: {
            return {
                ...state,
                speed: action.speed,
            };
        }

        case SET_WIDTH: {
            return {
                ...state,
                width: action.width,
                maxMarginLeft: 100 - action.width,
            };
        }

        case TOGGLE_START: {
            return state.isStarted ? startStopping(state) : start(state);
        }

        case RECEIVE_API_STATE: {
            return {
                ...state,
                ...action.receivedState,
            }
        }

        default:
            return state;
    }
};

const useLightbarReducer = (isTherapist) => {
    const [state, dispatch] = useReducer(reducer, {...initialState, isTherapist});
    const sessionId = useSessionId();
    useApiState(sessionId, state, dispatch);
    return [state, dispatch];
};

export default useLightbarReducer;
