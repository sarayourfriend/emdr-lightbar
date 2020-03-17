import random

from flask import Flask, escape, request, send_from_directory, session
from flask_socketio import SocketIO, send, emit

from utils import new_session_id

app = Flask(__name__)
app.secret_key = b'replace-me-later'
socketio = SocketIO(app)


@app.route('/static/<path:path>')
def send_static(path):
    return send_from_director('static', path)


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/s/')
def new_session():
    if 'session_id' not in session:
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
