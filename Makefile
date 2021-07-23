.PHONY: rundev
rundev:
	hypercorn --bind=0.0.0.0:5000 --workers=1 app.app:app --reload --access-log -


runprod:
	docker-compose build
	docker-compose up -d
	caddy reload
