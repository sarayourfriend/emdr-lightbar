import os
import json

import dotenv
from quart import Quart, request, redirect, send_from_directory, session, render_template, url_for, abort, make_response
from quart_redis import RedisHandler, get_redis
from asyncio import sleep

from .utils import new_session_id

dotenv.load_dotenv()

app = Quart(__name__)
app.secret_key = os.getenv('QUART_SECRET_KEY')
app.config['REDIS_URI'] = os.getenv('REDIS_URL')
RedisHandler(app)


DEFAULT_SESSION_SETTINGS = {
    'type': 'lightbar',
    'isStarted': False,
    'speed': 1000,
    'lightWidth': '2%',
}


DEFAULT_SESSION_SETTINGS_SERIALIZED = json.dumps(DEFAULT_SESSION_SETTINGS)


@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


@app.route('/')
async def index():
    return await render_template(
        'index/index.html',
        new_therapist_session=url_for('therapist_session'),
        new_client_session=url_for('new_client_session'))


@app.route('/therapist/', methods=['GET', 'POST'])
async def therapist_session():
    """
    Creates a new session for a therapist if one does not already exist.
    On POST, it forces the creation of a new session (this is how a
    therapist is able to refresh their session ID)
    """
    should_create_new_session = (
        (request.method == 'GET' and 'session_id' not in session)
        or request.method == 'POST'
    )

    redis = get_redis()

    initial_settings = None
    if should_create_new_session:
        if 'session_id' in session:
            # clear the existing session settings
            await redis.delete(session['session_id'])

        session_id = new_session_id()
        session['session_id'] = session_id
    else:
        session_id = session['session_id']
        initial_settings = await redis.get(session_id)

    if initial_settings is None:
        initial_settings = DEFAULT_SESSION_SETTINGS_SERIALIZED
        redis.set(session_id, initial_settings)
    else:
        initial_settings = bytes.decode(initial_settings)

    session_url = url_for(
        'client_session',
        session_id=session_id,
        _external=True)

    return await render_template(
        'therapist/session.html',
        session_url=session_url,
        session_id=session_id,
        initial_settings=initial_settings)


@app.route('/therapist/settings/', methods=['POST'])
async def therapist_settings():
    session_id = session['session_id']
    redis = get_redis()
    redis.set(session_id, await request.data)
    return '', 200


@app.route('/therapist/help/')
async def therapist_help():
    return await render_template('therapist/help.html')


@app.route('/session/<session_id>/')
async def client_session(session_id):
    session_id_needs_help = (
        not session_id.isupper()
        or '-' not in session_id
        or len(session_id) != 7    
    )
    if session_id_needs_help:
        session_id = session_id.upper().replace(' ', '-')
        if len(session_id) != 7:
            session_id = f'{session_id[:3]}-{session_id[3:]}'

        return redirect(url_for('client_session', session_id=session_id))

    redis = get_redis()
    encoded_existing_settings = await redis.get(session_id)

    existing_settings = encoded_existing_settings and bytes.decode(encoded_existing_settings)

    if existing_settings is None:
        return abort(404)

    return await render_template(
        'client/session.html',
        session_id=session_id,
        initial_settings=existing_settings)


@app.errorhandler(404)
async def page_not_found(e):
    return await render_template('error/404.html')


@app.route('/session/')
async def new_client_session():
    if 's' in request.args:
        return redirect(
            url_for('client_session', session_id=request.args['s']))

    return await render_template('client/index.html')


@app.route('/client/settings/<session_id>')
async def client_settings(session_id):
    async def send_settings():
        redis = get_redis()
        while encoded_settings := await redis.get(session_id):
            settings = bytes.decode(encoded_settings)
            message = f"data: {settings}\nevent: \nid: \nretry: \n\r\n\r\n"
            yield message.encode('utf-8')
            await sleep(0.25)

    response = await make_response(
        send_settings(),
        {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Transfer-Encoding': 'chunked',
        }
    )    
    response.timeout = None
    return response
