# Stacks V1

## Scale Mode

- React + Tailwind + TypeScript
- Opcion web app: Next.js App Router
- Opcion SPA: Vite + React Router
- Backend robusto recomendado: NestJS + Prisma + PostgreSQL
- PostgreSQL + Prisma
- Redis
- Docker + GitHub Actions
- OpenTelemetry + logs + trazas

## Fast Develop Mode

- React + Tailwind + TypeScript
- Backend rapido recomendado: Fastify + Prisma + PostgreSQL
- Supabase (db, auth, storage)
- Tailwind + componentes base (sin Bootstrap)
- n8n para automatizaciones
- Vercel para despliegue rapido

## Angular Mode

- Angular + Tailwind + TypeScript
- Fastify o NestJS
- PostgreSQL o Supabase
- CI/CD en GitHub Actions
- Recomendado para equipos con standard Angular

## Criterio de seleccion

- Elegir Scale si hay alta incertidumbre de crecimiento y dominio complejo.
- Elegir Fast si la prioridad es validar negocio en horas o dias.
- Elegir Angular cuando el equipo ya trabaja con Angular como base.
- Elegir Custom solo con restricciones claras.

## Preset backend

### rapid

- Fastify + Prisma + PostgreSQL
- Menor friccion inicial y menor boilerplate

### robust

- NestJS + Prisma + PostgreSQL
- Mayor estructura y gobernanza para equipos

## Backends soportados (override)

- Fastify (Node)
- NestJS (Node)
- FastAPI (Python)
- Go (Gin)
- Java (Spring Boot)

## Cloud IaC soportado

- AWS (Terraform base)
- GCP (Terraform base)
- Azure (Terraform base)
