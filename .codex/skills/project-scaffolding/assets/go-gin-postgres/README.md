# Go Gin PostgreSQL Template

Backend Go productivo con Gin + JWT + PostgreSQL baseline.

Incluye modulos base:

- Auth con access/refresh tokens
- RBAC (endpoint admin)
- Pagos (checkout mock)
- Mensajeria (queue mock)
- Seed admin en memoria para arranque
- SQL de migracion + seed para PostgreSQL incluidos
- Test base de salud + auth flow e2e
- Pipeline CI/CD listo con preview image en GHCR

## Inicio

```bash
cp .env.example .env
docker compose up -d
go mod tidy
go run ./...
```

## Migracion y seed SQL

```bash
psql "$DATABASE_URL" -f migrations/001_init.sql
psql "$DATABASE_URL" -f seed/001_seed.sql
```

O usando Makefile:

```bash
make migrate
make seed
```

## Testing

```bash
go test ./...
```

## Seguridad

```bash
govulncheck ./...
```

## CI/CD por template

- Archivo: `.github/workflows/ci-cd.yml`
- Incluye:
  - build + test
  - scan de seguridad con govulncheck
  - preview deploy via container image en GHCR para PRs

## Endpoints base

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `GET /admin/users`
- `POST /payments/checkout`
- `POST /messages/send`
