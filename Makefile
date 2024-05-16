#!/usr/bin/make -f

MAKEFLAGS += --silent

env ?= development
$(shell cp .config/environments/.env.$(env) .env)
include .env
export $(shell sed 's/=.*//' .env)


GitRepo = panda-placement-apps

Services := gateway
Frontends := website

noop =
comma := ,
space = $(noop) $(noop)

OS := $(shell uname)

nprocs := 2

ifeq ($(OS), Linux)
    nprocs = $(shell nproc)
endif
ifeq ($(OS), Darwin)
    nprocs = $(shell sysctl -n hw.ncpu)
endif

install: FORCE

updateDeps:
	pnpm install
	$(MAKE) updatePythonDeps

updatePythonDeps:
	pnpm run updatePythonDeps

deploy:
	${MAKE} build
	${MAKE} pm2.start

build:
	$(MAKE) build.services
	$(MAKE) build.apps
	$(MAKE) env.set

env.set:
	cp .config/environments/.env.$(env) .env
	for service in $(Services) ; do \
		mkdir -p ./apps/gateway/ >/dev/null 2>&1 ; \
		cp .env ./apps/gateway/.env ; \
	done

	@echo "$(env) environment variables for services are set"

build.apps: env.set
	nx run-many --target=build --projects=$(subst $(space),$(comma),$(AllAppsNx)) --parallel=$(nprocs) --configuration=$(env) --exclude='workspace'

build.services: env.set
	nx run-many --target=build --projects=$(subst $(space),$(comma),$(AllServicesNx)) --parallel=$(nprocs) --configuration=$(env) --exclude='workspace'

dev: env.set updateDeps
	nx run-many --target=serve --projects=$(subst $(space),$(comma),$(AllServicesNx),$(AllAppsNx)) --parallel=$(nprocs) --configuration=$(env) --exclude='workspace' ; \
	$(MAKE) env.set

dev.website: env.set updateDeps
	nx run website:serve

dev.gateway: env.set updateDeps
	nx run gateway:serve

format:
	nx format:write

release.patch:
	nx run workspace:version --releaseAs=patch

release.minor:
	nx run workspace:version --releaseAs=minor

release.major:
	nx run workspace:version --releaseAs=major

release.premajor:
	nx run workspace:version --releaseAs=premajor --preid=beta

release.prerelease.beta:
	nx run workspace:version --releaseAs=prerelease --preid=beta

release.prerelease.alpha:
	nx run workspace:version --releaseAs=prerelease --preid=alpha

cpus:
	@echo "Number of CPUs: $(nprocs)"

pm2.start:
	env-cmd -f ./dist/apps/gateway/.env pm2 start ./dist/apps/gateway/main.js --name smartcontracts-nestjs-api-$(env)
	pm2 start --name smartcontracts-python-effici-api-$(env) "apps/effici-score/jira_score_api.py" --interpreter python3
	pm2 start --name smartcontracts-python-estima-api-$(env) "apps/estima-engine/src/api.py" --interpreter python3

pm2.stop:
	pm2 stop smartcontracts-nestjs-api-$(env)
	pm2 stop smartcontracts-python-effici-api-$(env)
	pm2 stop smartcontracts-python-estima-api-$(env)

pm2.restart:
	env-cmd -f ./dist/apps/gateway/.env pm2 restart smartcontracts-nestjs-api-$(env) --update-env
	pm2 restart smartcontracts-python-effici-api-$(env) --update-env
	pm2 restart smartcontracts-python-estima-api-$(env) --update-env

pm2.delete:
	pm2 delete smartcontracts-nestjs-api-$(env)
	pm2 delete smartcontracts-python-effici-api-$(env)
	pm2 delete smartcontracts-python-estima-api-$(env)

nginx.config:
	sudo cat /var/www/smart-contract-apps/.config/nginx/pandaplacement.conf | sudo tee /etc/nginx/conf.d/pandaplacement.conf > /dev/null

nginx.restart:
	sudo service nginx restart

nginx.test:
	sudo nginx -t

nginx.reload:
	sudo service nginx reload
