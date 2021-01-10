import React, { useCallback } from 'react';

const Width = ({ width, onChange }) => {
    const handleChange = useCallback((event) => {
        const value = event.target.value;
        onChange(value);
    }, [onChange]);

    return (
        <label>
            Light width:
            <input type="range" min="2" max="60" value={width} onChange={handleChange} />
        </label>
    );
}

export default Width;
