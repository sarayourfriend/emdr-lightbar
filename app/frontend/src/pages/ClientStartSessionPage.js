import React, { useState, useCallback } from 'react';
import { Heading, Text, FormGroup, TextInput, Button, Flex, FlexItem } from '@wp-g2/components';
import Layout from '../components/Layout';

export default function ClientStartSessionPage() {
    const [sessionId, setSessionId] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const toAppend = window.location.href.endsWith('/') ? sessionId : `/${sessionId}`;
        window.location += toAppend;
    };

    return (
        <Layout>
            <Heading size={1}>EMDR Lightbar</Heading>
            <Heading size={2}>Client: Get Started</Heading>
            <Text>
                Enter the session ID provided by your therapist below, then click "Join session" to connect to the virtual EMDR Lightbar. 
            </Text>
            <Flex as="form" onSubmit={handleSubmit} direction="column" css={{ margin: '1rem 0' }}>
                <FlexItem as={FormGroup} label="Session ID" labelHidden css={{ width: '10rem' }}>
                    <TextInput placeholder="Session ID" value={sessionId} onChange={setSessionId}/>
                </FlexItem>
                <Button size="large" variant="primary" type="submit" css={{ width: '10rem' }}>Join session</Button>
            </Flex>
        </Layout>
    )
}
