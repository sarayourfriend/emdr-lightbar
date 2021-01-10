from gevent import monkey
monkey.patch_all()

import os
import json

import dotenv
from flask import Flask, escape, request, redirect, send_from_directory, session, render_template, url_for, abort, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin
from redis import Redis

from utils import new_session_id

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app, origins='*')
app.secret_key = os.getenv('FLASK_SECRET_KEY')
redis = Redis.from_url(os.getenv('REDIS_URL'), decode_responses=True)

socketio_kwargs = {
    'async_mode': 'threading',
    'message_queue': os.getenv('REDIS_URL'),
    'cors_allowed_origins': 'http://localhost:3000'
}

if os.getenv('FLASK_ENV') == 'production':
    socketio_kwargs = {
        'async_mode': 'gevent_uwsgi',
        'message_queue': os.getenv('REDIS_URL'),
        'cors_allowed_origins': 'emdr-lightbar.herokuapp.com',
    }


socketio = SocketIO(
    app,
    **socketio_kwargs
)

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
def index():
    return render_template(
        'index/index.html',
        new_therapist_session=url_for('therapist_session'),
        new_client_session=url_for('new_client_session'))


@app.route('/rest/session/', methods=['POST'])
@cross_origin()
def new_session():
    session_id = new_session_id()
    initial_settings = DEFAULT_SESSION_SETTINGS_SERIALIZED

    redis.set(session_id, initial_settings)

    return jsonify(session_id=session_id,
        initial_settings=initial_settings)


@app.route('/therapist/', methods=['GET', 'POST'])
def therapist_session():
    """
    Creates a new session for a therapist if one does not already exist.
    On POST, it forces the creation of a new session (this is how a
    therapist is able to refresh their session ID)
    """
    should_create_new_session = (
        (request.method == 'GET' and 'session_id' not in session)
        or request.method == 'POST'
    )

    initial_settings = None
    if should_create_new_session:
        if 'session_id' in session:
            # clear the existing session settings
            redis.delete(session['session_id'])

        session_id = new_session_id()
        session['session_id'] = session_id
    else:
        session_id = session['session_id']
        initial_settings = redis.get(session_id)

    if initial_settings is None:
        initial_settings = DEFAULT_SESSION_SETTINGS_SERIALIZED
        redis.set(session_id, initial_settings)

    session_url = url_for(
        'client_session',
        session_id=session_id,
        _external=True)

    return render_template(
        'therapist/session.html',
        session_url=session_url,
        session_id=session_id,
        initial_settings=initial_settings)


@app.route('/therapist/help/')
def therapist_help():
    return render_template('therapist/help.html')


@app.route('/session/')
def new_client_session():
    if 's' in request.args:
        return redirect(
            url_for('client_session', session_id=request.args['s']))

    return render_template('client/index.html')


@app.route('/session/<session_id>/')
def client_session(session_id):
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

    existing_settings = redis.get(session_id)

    if existing_settings is None:
        return abort(404)

    return render_template(
        'client/session.html',
        initial_settings=existing_settings)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error/404.html')


@socketio.on('therapist-new-settings')
def handle_new_settings(new_settings):
    namespace = session_id
    redis.set(session_id, json.dumps(new_settings))
    emit('client-new-settings', new_settings, namespace=namespace, broadcast=True)


if __name__ == '__main__':
    socketio.run(
        app,
        port=os.getenv('PORT', 5000))
