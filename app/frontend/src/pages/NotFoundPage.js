import React from 'react';
import { Heading, Text } from '@wp-g2/components';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFoundPage() {
    return (
        <Layout>
            <Heading size={1}>Whoops!</Heading>
            <Text>
                <p>Something went wrong and I couldn't find what you were looking for.</p>

                <p><Link to="/">Click here</Link> to go back to the homepage.</p>
            </Text>
        </Layout>
    );
}
