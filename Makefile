.PHONY: rundev
rundev:
	hypercorn --bind=0.0.0.0:5000 --workers=1 app.app:app --reload --access-log -


.PHONY: reloadprod
reloadprod:
	docker-compose build
	docker-compose up -d
	caddy reload


.PHONY: install
install:
	pip install -r requirements.txt


.env:
	cp .env.example .env
