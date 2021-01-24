import React from 'react';

export default function ClientStartSessionPage() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const sessionId = event.target.elements.namedItem('session-id').value;
        window.location += `/${sessionId}`;
    };

    return (
        <>
            <h1>EMDR Lightbar</h1>
            <h2>Client: Get Started</h2>
            <p>
                Enter the session ID provided by your therapist below, then click "Join session" to connect to the virtual EMDR Lightbar. 
            </p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="session-id">
                    Session ID:
                    <input type="text" id="session-id" />
                </label>
                <button type="submit">Join session</button>
            </form>
        </>
    )
}
