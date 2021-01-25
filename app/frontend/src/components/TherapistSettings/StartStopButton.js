import React from 'react';
import { Button, HStack } from '@wp-g2/components';

const StartStopButton = ({ isStopping, isStarted, onClick }) =>
    <HStack alignment="center">
        <Button size="large" css={{ margin: '1rem 0', width: '50%' }} variant="primary" type="button" onClick={onClick} disabled={isStopping}>
            {isStarted ? 'Stop' : 'Start'}
        </Button>
    </HStack>;

export default StartStopButton;
