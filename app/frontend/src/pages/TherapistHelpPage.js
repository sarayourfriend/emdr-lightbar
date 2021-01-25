import React from 'react';
import { Link } from 'react-router-dom';
import { Heading, Text } from '@wp-g2/components';
import Layout from '../components/Layout';

export default function TherapistHelpPage() {
    return (
        <Layout>
            <Heading size={1}>EMDR Lightbar</Heading>
            <Heading size={2} lineHeight="2">Therapist Help</Heading>
            <Text size="body">
                <p>
                    Clicking the start/stop button will start or stop the lightbar's movement on both your sceen and your client's screen. Likewise, changes to the speed and width of the light will automatically be reflected on your client's screen.
                </p>

                <p>
                    To create a new session, simply refresh the page. You may do this as many times as you'd like. You will only be able to control one session at a time.
                </p>

                <p>
                    To get a feel for what your client will experience, open the app in a separate browser tab and go to <Link to="/session/">the client start page</Link> and enter your session ID.
                </p>

                <p>
                    If you still need help, please email <a href="mailto:emdr_lightbar@fastmail.com">emdr_lightbar (at) fastmail.com</a> for assistance.
                </p>
            </Text>
        </Layout>
    )
}
