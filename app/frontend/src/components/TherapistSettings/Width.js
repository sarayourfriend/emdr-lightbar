import React from 'react';
import { FormGroup, Slider } from '@wp-g2/components';

const Width = ({ width, onChange }) => {
    return (
        <FormGroup label="Light width">
            <Slider min="2" max="60" value={width} onChange={onChange} />
        </FormGroup>
    );
}

export default Width;
