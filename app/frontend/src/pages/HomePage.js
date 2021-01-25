import React from 'react';
import { Link } from 'react-router-dom';
import { Heading, Text } from '@wp-g2/components';
import Layout from '../components/Layout';

export default function HomePage() {
    return (
        <Layout>
            <Heading size={1}>Welcome to Lightbar</Heading>
            <Heading size={3} lineHeight={2}>A remote EMDR tool for these curious times</Heading>
            <Text>
                <p>
                    Therapist? <Link to="/therapist/">Click here to initiate a new session for your client</Link>.
                </p>
                <p>
                    Client? <Link to="/session/">Click here to get started</Link>.
                </p>
            </Text>
        </Layout>
    )
}
