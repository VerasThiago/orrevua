all:
	docker-compose up

all_build:
	docker-compose up --build

start_api_local:
	cd api && ORREVUA_DEPLOY_ENV=local go run main.go

start_api_docker:
	docker-compose up api

start_login_local:
	cd login && ORREVUA_DEPLOY_ENV=local go run main.go

start_login_docker:
	docker-compose up login

start_db:
	docker-compose up -d database

ssh_db:
	docker exec -it database bash