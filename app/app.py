from gevent import monkey
monkey.patch_all()

import os

import dotenv
from flask import Flask, escape, request, send_from_directory, session
from flask_socketio import SocketIO, send, emit

from utils import new_session_id

dotenv.load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

socketio_kwargs = {
    'async_mode': 'threading',
}

if os.getenv('FLASK_ENV') == 'production':
    socketio_kwargs = {
        'async_mode': 'gevent_uwsgi',
        'message_queue': os.getenv('REDIS_SERVER_URL'),
    }


socketio = SocketIO(
    app,
    **socketio_kwargs
)


@app.route('/static/<path:path>')
def send_static(path):
    return send_from_director('static', path)


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/s/', methods=['GET', 'POST'])
def new_session():
    """
    Creates a new session for a therapist if one does not already exist.
    On POST, it forces the creation of a new session (this is how a
    therapist is able to refresh their session ID)
    """
    should_create_session_id = (
        (request.method == 'GET' and 'session_id' not in session)
        or request.method == 'POST'
    )

    if should_create_session_id:
        session['session_id'] = new_session_id()

    return send_from_directory('static', 'new-session.html')


@app.route('/s/<session_id>/')
def join_session(session_id):
    return send_from_directory('static', 'client-session.html')


@socketio.on('therapist-session-init')
def handle_therapist_connect():
    """
    Shares the therapists current session ID with the therapists browser.
    This allows us to emit client-new-settings only to clients connected
    to the therapists current session URL.
    """
    emit('therapist-session-id', session['session_id'])


@socketio.on('therapist-new-settings')
def handle_new_settings(new_settings):
    session_id = session['session_id']
    namespace = f'/s/{session_id}/'
    emit('client-new-settings', new_settings, namespace=namespace, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
