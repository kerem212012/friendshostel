
.PHONY: pnpm-reinstall
pnpm-reinstall:
	rm -rf ./node_modules
	rm -rf ./dist
	rm -rf ./.strapi
	rm .strapi-updater.json || true
	rm pnpm-lock.yaml || true
	pnpm store prune
	pnpm install --include=optional

.PHONY: container-recreate
container-recreate:
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "❌ Укажи имя сервиса: make container-recreate <name>"; \
		exit 1; \
	fi
	docker compose up -d --force-recreate $(filter-out $@,$(MAKECMDGOALS))

%:
	@:

# Получаем ID контейнера для сервиса postgres
POSTGRES_ID := $(shell docker compose ps -q postgres)

.PHONY: dump
dump:
	docker exec -t $(POSTGRES_ID) pg_dump -U friends -d friends --data-only --column-inserts > data_only.sql

dump_from_server:
	scp friendshostel@46.101.163.27:/home/friendshostel/app/cms/data_only.sql ./data_only.sql

.PHONY: dump-init
dump-init:
	cat data_only.sql | docker exec -i $(POSTGRES_ID) psql -U friends -d friends


download-screens:
	scp -r friendshostel@46.101.163.27:/home/friendshostel/app/var/screens/ ./public/screens