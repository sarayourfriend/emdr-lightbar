import React from 'react';
import './Lightbar.css';

const Lightbar = ({ width, marginLeft }) => {
    return (
        <div className="lightbar">
            <div
                className="light"
                style={{
                    width: `${width}%`,
                    marginLeft: `${marginLeft}%`
                }}
            />
        </div>
    );
};

export default Lightbar;
