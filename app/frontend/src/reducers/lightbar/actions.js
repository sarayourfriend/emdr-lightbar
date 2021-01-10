export const REQUEST_ANIMATION_FRAME_DELTA = 'REQUEST_ANIMATION_FRAME_DELTA';
export const TOGGLE_START = 'TOGGLE_START';
export const SET_WIDTH = 'SET_WIDTH';
export const SET_SPEED = 'SET_SPEED';
export const RECEIVE_API_STATE = 'RECEIVE_API_STATE';

export const requestAnimationFrameDelta = (delta) => ({
    type: REQUEST_ANIMATION_FRAME_DELTA,
    delta,
});

export const toggleStart = () => ({
    type: TOGGLE_START,
});

export const setWidth = (width) => ({
    type: SET_WIDTH,
    width,
});

export const setSpeed = (speed) => ({
    type: SET_SPEED,
    speed,
});

export const receiveApiState = ({ isStarted, width, speed, isStopping, stoppingBounceCount }) => ({
    type: RECEIVE_API_STATE,
    receivedState: {
        isStarted,
        width,
        speed,
        isStopping,
        stoppingBounceCount,
    },
});
