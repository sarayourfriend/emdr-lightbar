import React from 'react';
import { FormGroup, Slider } from '@wp-g2/components';

const maxSpeed = 3000;
const minSpeed = 100;

const Speed = ({ speed, onChange }) => {
    return (
        <FormGroup label="Light speed">
            <Slider min={minSpeed} max={maxSpeed} value={speed} onChange={onChange} />
        </FormGroup>
    );
};

export default Speed;