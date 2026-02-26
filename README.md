# Codex Develop Master

Kit open source para desarrollar software con Codex de punta a punta: discovery, arquitectura, build, QA, seguridad, despliegue y operacion.

## Objetivo

- Estructura nativa Codex (`AGENTS.md`, `/.codex/commands`, `/.codex/skills`).
- Flujo profesional completo, pero configurable.
- V1 en espanol con reglas ASCII-safe para minimizar problemas con acentos y letra n.
- Soporte de integraciones IA (MCP + n8n) y despliegue cloud.

## Lo que ya incluye

- Presets de trabajo:
  - `rapid`
  - `robust`
- Tipos de proyecto:
  - `frontend`
  - `backend`
  - `fullstack`
- Frontend:
  - `react-tailwind-vite`
  - `angular-tailwind-cli`
- Backend:
  - `fastify-prisma-postgres`
  - `nestjs-prisma-postgres`
  - `fastapi-postgres`
  - `go-gin-postgres`
  - `java-spring-postgres`
- Cloud IaC:
  - `terraform-aws-base`
  - `terraform-gcp-base`
  - `terraform-azure-base`
- Verticales:
  - `saas`
  - `ecommerce`
  - `marketplace`
  - `ai-heavy`

## Capacidades de producto viable

- Auth + RBAC + refresh tokens en stacks backend.
- Modulos de pagos y mensajeria listos como baseline.
- Seed y migraciones base:
  - Prisma (Fastify/NestJS)
  - Alembic (FastAPI)
  - SQL migration files (Go)
  - Flyway (Java)
- Tests base + auth flow e2e por template backend.
- Seguridad automatizada por template:
  - `npm audit`
  - `pip-audit`
  - `govulncheck`
  - `OWASP dependency-check` (Java)
- CI/CD por template con preview deploy de PR via imagen en GHCR.

## Comandos principales

Inicializar contexto:

```bash
node scripts/init-context.js
```

Scaffold directo:

```bash
node scripts/scaffold-webapp.js --template fastapi-postgres --target apps/api
```

Scaffold por preset/tipo:

```bash
node scripts/scaffold-webapp.js --preset robust --project-type fullstack --frontend react --backend-stack java --vertical saas --cloud aws --target apps/my-product
```

## Verificacion

Checklist del proyecto actual:

```bash
node scripts/verify-checklist.js
```

Verificacion estructural de templates:

```bash
node scripts/verify-scaffold-templates.js
node scripts/verify-scaffold-templates.js --with-install
```

## Portal docs

```bash
cd docs-site
npm install
npm run docs:dev
```

## CI del repo

- `.github/workflows/template-ci.yml`
- `.github/workflows/template-cicd.yml`
- `.github/workflows/template-security.yml`
- `.github/workflows/docs-release.yml`

## Nota UI

- Bootstrap queda fuera por defecto.
- Base recomendada: React/Angular + Tailwind.
