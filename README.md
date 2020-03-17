# EMDR Lightbar

A simple EMDR lightbar app for therapists to be able to do EMDR therapy with remote clients

## What's the problem with video chat?

No matter how good a video chat is, almost all of them have some degree of latency, and many clients may have low-bandwidth connections, making lag on video chats pretty distracting for finger or remote-lightbar EMDR. Even when there isn't lag, most webcams introduce some amount of blurring with rapid movement, which EMDR obviously requires. This can also be distracting to the client, making it difficult to focus on the already hard work of trauma therapy.

## How does this solve that problem?

This app solves the problem by allowing a therapist to share a short link with a client that opens a lightbar in the client's web browser. For example, the therapist may generate a link for a client's session that looks something like: `www.example.com/ABC123`. These content of these links can only be controlled from the therapists session. On the client side, all that is visible is the configured lightbar. We store neither the therapists nor the client's name and the configuration of the lightbar is not PPI. Because no PPI is stored in any way, there is no risk of the link being brute forced or anything like that, as the only information that could ever be revealed is lightbar's configuration, which again is not PPI. The only information that is stored is a small cookie on the therapists session to identify their browser as the owner of the generated link (which will show them the controls on the page).

## What currently works?

Right now the app is just a proof of concept of a lightbar configurable across speed and light width. The width of the bar itself is configurable in a round-about way by changing the width of the browser.

## Roadmap

1.  Generating a client link and saving it as the current link in the therapist's session
2.  Connecting a websocket from the client's browser to the therapist so that:
3.  The therapist is able to see and control the width of the light bar replicated on their screen
4.  The therapist is able to see and control the light's width and speed
5.  The therpaist's changes to the width of the bar and the lights width and speed are immediately reflected on the client's screen
6.  The therapist is able to control the background color of the page as well as the color of the lightbar outline and light itself
    * When displaying the current "theme" to the therapist, the controls on the page should not be affected. This will cut the scope of the theming ability so we don't need to worry about the contrast of the controls' text—they'll simply always be black text on a white background
    * We should be able to implement a dark-mode setting in the future to accomodate OS/browser level dark-mode settings
7.  The therapist is able to start and stop the movement of the light

### Future ideas

* Add a sound option so that therapists are able to offer audio-based bi-lateral stimulation

## Technology used

* Flask for the backend
  * This was chosen over Django simply because the app is so minimal, there's no real reason to use anything heavier. We only have two endpoints, one to serve the frontend and one to connect the websockets. Session management is simple in flask.
* Vanilla JS, HTML and CSS for the frontend
  * Even though this is going to make theming a little bit of a drag, the functionality of the frontend is so simple that there's really no call for any kind of UI, state, or style management library
  * I think that if the application became complex enough such that it would benefit greatly from the usage of such technologies, we might be adding too many features to it
