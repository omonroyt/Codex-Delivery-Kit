# Stacks Recomendados

## Presets base

### rapid

- Objetivo: velocidad maxima para entregar rapido.
- Frontend recomendado: React + Tailwind.
- Backend recomendado: Fastify + Prisma + PostgreSQL.

### robust

- Objetivo: control, gobierno tecnico y escalado.
- Frontend recomendado: React o Angular + Tailwind.
- Backend recomendado: NestJS + Prisma + PostgreSQL.

## Overrides backend disponibles

- `fastify`
- `nestjs`
- `fastapi`
- `go`
- `java`

## Infra cloud disponible

- `aws` -> `terraform-aws-base`
- `gcp` -> `terraform-gcp-base`
- `azure` -> `terraform-azure-base`

## Verticales de producto

- `saas`
- `ecommerce`
- `marketplace`
- `ai-heavy`

## Seleccion practica

1. `rapid + fastify` para MVP en horas.
2. `robust + nestjs` para producto core y equipos que escalan.
3. `robust + java` para entornos enterprise.
4. `rapid/robust + fastapi` cuando el equipo domina Python/IA.
5. `rapid/robust + go` para APIs de bajo overhead y buena latencia.

## Regla de frontend

- Sin Bootstrap por defecto en este kit.
