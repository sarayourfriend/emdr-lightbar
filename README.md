# EMDR Lightbar

A simple EMDR lightbar app for therapists to be able to do EMDR therapy with remote clients.

This was inspired by my own therapist's remarks during our first therapy session at the start of the 2020 Coronavirus lockdown in the US and my own desire to be able to continue EMDR therapy during the quarantine.

![emdr-lightbar-demo](https://user-images.githubusercontent.com/24264157/76837761-54c17d00-67f0-11ea-80a4-0e1de85b4dcf.gif)

<small><strong>Note:</strong> the animated demo above is choppy due to frames being dropped in the GIF. When the app is actually running, the animation is smooth and appropriate for EMDR therapy.</small>

## What's the problem with video chat?

No matter how good a video chat is, almost all of them have some degree of latency, and many clients may have low-bandwidth connections, making lag on video chats pretty distracting for finger or remote-lightbar EMDR. Even when there isn't lag, most webcams introduce some amount of blurring with rapid movement, which EMDR obviously requires. This can also be distracting to the client, making it difficult to focus on the already hard work of trauma therapy.

## How does this solve that problem?

This app solves the problem by allowing a therapist to share a short link with a client that opens a lightbar in the client's web browser. For example, the therapist may generate a link for a client's session that looks something like: `www.example.com/s/ABC-123`. These content of these links can only be controlled from the therapists session. On the client side, all that is visible is the configured lightbar. We store neither the therapists nor the client's name and the configuration of the lightbar is not PPI. Because no PPI is stored in any way, there is no risk of the link being brute forced or anything like that, as the only information that could ever be revealed is lightbar's configuration, which again is not PPI. The only information that is stored is a small cookie on the therapists session to identify their browser as the owner of the generated link (which will show them the controls on the page).

## What currently works?

You can create a session as a therapist and connect as a client. Once you have access to the app, follow the instructions on the index page to set up a therapist and client session.

Start the light's movement as a therapist by clicking the "Start" button. If you open the session URL in another browser window, and change the settings in the therapist window, you should see them immediately reflected in the client window.

## Feature Roadmap

1.  The therapist is able to control the background color of the page as well as the color of the lightbar outline and light itself
    *   When displaying the current "theme" to the therapist, the controls on the page should not be affected. This will cut the scope of the theming ability so we don't need to worry about the contrast of the controls' text—they'll simply always be black text on a white background
2.  The therapist is able to control the width of the lightbar itself
3.  Make the site prettier in general
4.  Allow client to control audio volume and pitch? And speed?

## Technology used

*   Quart for the backend
    *   The backend for this is so simple there's no real reason to use anything heavier. Even if we keep adding more controls for the therapist, that will only increase the complexity of the front-end as we can continue to use the same generic "<actor>-new-settings" events to send and receive any arbitrary new settings we want.
    *   Quart is used over Flask due to its superior support for SSEs
*   Vanilla JS, HTML and CSS for the frontend
    *   Even though this is going to make theming a little bit of a drag, the functionality of the frontend is so simple that there's really no call for any kind of UI, state, or style management library
    *   I think that if the application became complex enough such that it would benefit greatly from the usage of such technologies, we might be adding too many features to it
*   Server Sent Events
    * The therapist makes a POST request each time the settings change and the client receives the new settings via an EventSource.

## Running

Install Docker, and then a simple `docker-compose up` will run the application on port 5000 with four workers and redis included.

# Development

To run locally:

1.  Install python3.9
1.  Clone the repo
1.  Install Redis
1.  Create a venv: `python3.9 -m venv venv`
1.  Initialize the venv: `source venv/bin/activate`
1.  Install dependencies: `make install`
1.  Generate the `.env` file and fill it in: `make .env`
1.  Run the development server: `make rundev`

# Production

To deploy the application:

1. On your server, run `docker-compose build && docker-compose up -d`
1. Use some sort of reverse proxy like nginx or caddy to point to the service. A `Caddyfile` is provided as an example.

# Tech TODOs

*   [ ] Add step-by-step guide to therapist help page
