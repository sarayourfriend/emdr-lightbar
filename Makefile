.PHONY: rundev
rundev:
	gunicorn --bind=0.0.0.0:5000 --workers=1 --worker-class eventlet --reload app.app:app

