# EMDR Lightbar

A simple EMDR lightbar app for therapists to be able to do EMDR therapy with remote clients.

This was inspired by my own therapist's remarks during our first therapy session at the start of the 2020 Coronavirus lockdown in the US and my own desire to be able to continue EMDR therapy during the quarantine.

## What's the problem with video chat?

No matter how good a video chat is, almost all of them have some degree of latency, and many clients may have low-bandwidth connections, making lag on video chats pretty distracting for finger or remote-lightbar EMDR. Even when there isn't lag, most webcams introduce some amount of blurring with rapid movement, which EMDR obviously requires. This can also be distracting to the client, making it difficult to focus on the already hard work of trauma therapy.

## How does this solve that problem?

This app solves the problem by allowing a therapist to share a short link with a client that opens a lightbar in the client's web browser. For example, the therapist may generate a link for a client's session that looks something like: `www.example.com/ABC123`. These content of these links can only be controlled from the therapists session. On the client side, all that is visible is the configured lightbar. We store neither the therapists nor the client's name and the configuration of the lightbar is not PPI. Because no PPI is stored in any way, there is no risk of the link being brute forced or anything like that, as the only information that could ever be revealed is lightbar's configuration, which again is not PPI. The only information that is stored is a small cookie on the therapists session to identify their browser as the owner of the generated link (which will show them the controls on the page).

## What currently works?

You can create a session as a therapist and connect as a client. Once you have access to the app, follow the instructions on the index page to set up a therapist and client session.

Start the light's movement as a therapist by clicking the "Start" button. If you open the session URL in a private tab, and change the settings in the therapist tab, you should see them immediately reflected in the client tab.

**Note:** Both tabs must be open before the therapist begins modifying the lightbar behavior or else the settings will potentially start out of sync. Changing the settings just one time once both the therapist and the client are connected will sync the settings. After the first time, they will continue to stay in sync.

## Feature Roadmap

1.  The therapist is able to control the background color of the page as well as the color of the lightbar outline and light itself
    *   When displaying the current "theme" to the therapist, the controls on the page should not be affected. This will cut the scope of the theming ability so we don't need to worry about the contrast of the controls' text—they'll simply always be black text on a white background
    *   We should be able to implement a dark-mode setting in the future to accomodate OS/browser level dark-mode settings
2.  The therapist is able to start and stop the movement of the light
3.  The therapist is able to control the width of the lightbar itself
4.  Make the site prettier in general
5.  Save and load settings out of local storage so the therapist can persist settings across sessions

### Future ideas

*   Add a sound option so that therapists are able to offer audio-based bi-lateral stimulation

## Technology used

*   Flask for the backend
    *   The backend for this is so simple there's no real reason to use anything heavier. Even if we keep adding more controls for the therapist, that will only increase the complexity of the front-end as we can continue to use the same generic "<actor>-new-settings" events to send and receive any arbitrary new settings we want.
*   Vanilla JS, HTML and CSS for the frontend
    *   Even though this is going to make theming a little bit of a drag, the functionality of the frontend is so simple that there's really no call for any kind of UI, state, or style management library
    *   I think that if the application became complex enough such that it would benefit greatly from the usage of such technologies, we might be adding too many features to it
*   SocketIO because it's not necessary to invent a new websocket protocol for this

# Development

To run locally:

1.  Install python3
2.  Clone the repo
3.  Create a venv: `python3 -m venv venv`
4.  Initialize the venv: `. venv/bin/activate`
5.  Install dependencies: `pip install -r requirements.txt`
6.  Run the server: `env FLASK_ENV=development venv/bin/python app.py`

## Tech TODOs

*   [ ] Dockerize the app
*   [ ] Add deployment instructions
*   [ ] Grab the secret key from the environment instead of hard-coding it
*   [ ] Minify/mangle JS and CSS
