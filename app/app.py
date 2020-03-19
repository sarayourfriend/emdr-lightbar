from gevent import monkey
monkey.patch_all()

import os

import dotenv
from flask import Flask, escape, request, send_from_directory, session, render_template, url_for
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
    return send_from_directory('static', path)


@app.route('/')
def index():
    return render_template('index/index.html')


@app.route('/s/', methods=['GET', 'POST'])
def therapist_session():
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

    session_url = url_for('patient_session', session_id=session['session_id'], _external=True)

    return render_template(
        'therapist/session.html',
        session_url=session_url)


@app.route('/s/<session_id>/')
def patient_session(session_id):
    return render_template('patient/session.html')


@socketio.on('therapist-new-settings')
def handle_new_settings(new_settings):
    session_id = session['session_id']
    namespace = f'/s/{session_id}/'
    emit('patient-new-settings', new_settings, namespace=namespace, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
