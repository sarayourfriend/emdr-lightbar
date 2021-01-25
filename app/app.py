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

app = Flask(__name__, static_url_path='/frontend/build')
CORS(app, origins='*')
app.secret_key = os.getenv('FLASK_SECRET_KEY')
redis = Redis.from_url(os.getenv('REDIS_URL'), decode_responses=True)

socketio_kwargs = {
    'async_mode': 'threading',
    'message_queue': os.getenv('REDIS_URL'),
    'cors_allowed_origins': '*'
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


@app.route('/')
def index():
    return send_from_directory('frontend/build', 'index.html')


@app.route('/<path:path>')
def any_other_path(path):
    return send_from_directory('frontend/build', 'index.html')


@app.route('/static/<path:path>')
def serve_frontend(path):
    return send_from_directory('frontend/build/static', path)


@app.route('/rest/session/', methods=['GET', 'POST'])
@cross_origin()
def new_session():
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

    return jsonify(session_id=session_id,
        initial_settings=initial_settings)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error/404.html')


@socketio.on('therapist-new-settings')
def handle_new_settings(new_settings, session_id):
    namespace = f'/{session_id}'
    redis.set(session_id, json.dumps(new_settings))
    emit('client-new-settings', new_settings, namespace=namespace, broadcast=True)


if __name__ == '__main__':
    socketio.run(
        app,
        port=os.getenv('PORT', 5000))
