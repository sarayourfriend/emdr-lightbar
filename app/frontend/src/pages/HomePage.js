import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <>
            <h1>Welcome to Lightbar</h1>
            <h2>A remote EMDR tool for these curious times</h2>
            <p>
                Therapist? <Link to="/therapist/">Click here to initiate a new session for your client</Link>.
            </p>
            <p>
                Client? <Link to="/session/">Click here to get started</Link>.
            </p>
        </>
    )
}
