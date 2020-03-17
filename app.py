from flask import Flask, escape, request, send_from_directory

app = Flask(__name__)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_director('static', path)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    app.run()
