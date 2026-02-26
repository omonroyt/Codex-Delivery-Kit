# Fastify Prisma PostgreSQL Template

Backend rapido para produccion con Fastify + Prisma + PostgreSQL.

Incluye modulos base:

- Auth con access/refresh tokens
- RBAC (endpoint admin)
- Pagos (checkout mock)
- Mensajeria (queue mock)
- Seed de usuario admin
- Migracion Prisma inicial incluida
- Test unitario + auth flow e2e (mocked prisma)
- Pipeline CI/CD listo con preview image en GHCR

## Inicio

1. Copiar variables:

```bash
cp .env.example .env
```

2. Levantar base local:

```bash
docker compose up -d
```

3. Instalar dependencias:

```bash
npm install
```

4. Generar cliente Prisma y aplicar migracion:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
```

5. Iniciar API:

```bash
npm run dev
```

## QA y seguridad

```bash
npm run test
npm run test:e2e
npm run security:audit
```

## CI/CD por template

- Archivo: `.github/workflows/ci-cd.yml`
- Incluye:
  - build + test
  - migracion + seed en CI
  - security audit
  - preview deploy via container image en GHCR para PRs

## Endpoints base

- `GET /health`
- `GET /health/db`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `GET /admin/users` (role admin)
- `POST /payments/checkout`
- `POST /messages/send`
