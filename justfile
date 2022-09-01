rundev:
	yarn watch | hypercorn --bind=0.0.0.0:5000 --workers=1 app.app:app --reload --access-log -


reloadprod:
	docker-compose build
	docker-compose up -d


install:
	pip install -r requirements.txt


dotenv:
	cp .env.example .env
