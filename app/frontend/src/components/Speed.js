import React, { useCallback } from 'react';

const maxSpeed = 3000;
const minSpeed = 100;

const Speed = ({ speed, onChange }) => {
    const handleChange = useCallback((event) => {
        const value = event.target.value;
        onChange(value);
    }, [onChange]);

    return (
        <label>
            Light speed:
            <input type="range" min={minSpeed} max={maxSpeed} value={speed} onChange={handleChange} />
        </label>
    );
};

export default Speed;