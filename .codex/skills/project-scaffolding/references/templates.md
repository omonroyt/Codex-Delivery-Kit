# Templates

## react-tailwind-vite

- App React con Vite + TypeScript + Tailwind.
- Lista para `npm install` y `npm run dev`.

## angular-tailwind-cli

- Initializer guiado de Angular + Tailwind vía Angular CLI.
- Incluye `npm run setup` con soporte `--dry-run` y sin Bootstrap.

## fastify-prisma-postgres

- Backend rápido con Fastify + Prisma + PostgreSQL.
- Incluye docker-compose para Postgres + Redis.
- Incluye migraciones, seed, auth flow e2e y workflow CI/CD.
- Recomendado para modalidad `rapid`.

## nestjs-prisma-postgres

- Backend robusto con NestJS + Prisma + PostgreSQL.
- Incluye docker-compose para Postgres + Redis.
- Incluye migraciones, seed, auth flow e2e y workflow CI/CD.
- Recomendado para modalidad `robust`.

## fastapi-postgres

- Backend Python con FastAPI + SQLAlchemy + PostgreSQL.
- Incluye auth/rbac/refresh + pagos + mensajería.
- Incluye Alembic + tests + workflow CI/CD.

## go-gin-postgres

- Backend Go con Gin + JWT + PostgreSQL baseline.
- Incluye auth/rbac/refresh + pagos + mensajería.
- Incluye SQL de migración/seed + tests + workflow CI/CD.

## java-spring-postgres

- Backend Java con Spring Boot + JPA + PostgreSQL.
- Incluye auth/rbac/refresh + pagos + mensajería.
- Incluye Flyway + tests + workflow CI/CD.

## terraform-aws-base / terraform-gcp-base / terraform-azure-base

- Bases IaC listas para cloud por proveedor.
- Se aplican como templates directos.

## Selección por preset

### rapid

- backend: `fastify-prisma-postgres`
- frontend: `react-tailwind-vite` (o `angular-tailwind-cli` si el usuario lo pide)

### robust

- backend: `nestjs-prisma-postgres`
- frontend: `react-tailwind-vite` (o `angular-tailwind-cli` si el usuario lo pide)

## Backend stack override

Puedes elegir stack de backend explícitamente:

- `--backend-stack fastify`
- `--backend-stack nestjs`
- `--backend-stack fastapi`
- `--backend-stack go`
- `--backend-stack java`

## Vertical blueprints (fullstack)

Para proyectos fullstack se puede aplicar blueprint:

- `--vertical saas`
- `--vertical ecommerce`
- `--vertical marketplace`
- `--vertical ai-heavy`

## Cloud en fullstack (opcional)

- `--cloud aws`
- `--cloud gcp`
- `--cloud azure`

## Selección recomendada

1. MVP web rápido: `react-tailwind-vite`
2. Equipo con estándar Angular: `angular-tailwind-cli`
3. Backend rápido para salir a producción en horas: `fastify-prisma-postgres`
4. Backend robusto para equipos con mayor gobernanza: `nestjs-prisma-postgres`
5. Backend Python productivo: `fastapi-postgres`
6. Backend Go para performance/control: `go-gin-postgres`
7. Backend Java enterprise: `java-spring-postgres`
