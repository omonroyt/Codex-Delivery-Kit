APP_PORT ?= 8080

.PHONY: run test build security migrate seed

run:
	go run ./...

test:
	go test ./...

build:
	go build ./...

security:
	govulncheck ./...

migrate:
	psql "$$DATABASE_URL" -f migrations/001_init.sql

seed:
	psql "$$DATABASE_URL" -f seed/001_seed.sql
