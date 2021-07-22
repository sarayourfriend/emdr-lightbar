.PHONY: rundev
rundev:
	hypercorn --bind=0.0.0.0:5000 --workers=1 --reload app.app:app --access-log -
