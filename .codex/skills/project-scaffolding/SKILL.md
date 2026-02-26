---
name: project-scaffolding
description: Scaffolding de proyectos base para Codex-Delivery-Kit. Usar cuando se necesite inicializar frontend, backend o fullstack con stacks multi-lenguaje, verticales y cloud IaC.
---

# Project Scaffolding

Inicializar estructura de proyecto reutilizable y coherente con el kit.

## Templates soportados

1. `react-tailwind-vite`
2. `angular-tailwind-cli`
3. `fastify-prisma-postgres`
4. `nestjs-prisma-postgres`
5. `fastapi-postgres`
6. `go-gin-postgres`
7. `java-spring-postgres`
8. `terraform-aws-base`
9. `terraform-gcp-base`
10. `terraform-azure-base`

## Flujo

1. Confirmar preset (`rapid` o `robust`).
2. Confirmar tipo (`frontend`, `backend`, `fullstack`).
3. Confirmar frontend (`react` o `angular`) cuando aplique.
4. Confirmar backend stack (`fastify|nestjs|fastapi|go|java`) cuando aplique.
5. Confirmar vertical (`saas|ecommerce|marketplace|ai-heavy`) para `fullstack`.
6. Confirmar cloud opcional (`aws|gcp|azure`) para `fullstack`.
7. Ejecutar script `scripts/scaffold-webapp.js`.
8. Validar salida y dependencias.
9. Entregar comandos de arranque.

## Reglas

- Mantener salida sin Bootstrap.
- Mantener identificadores técnicos en inglés.
- Mantener documentación y mensajes orientados a usuarios en español con ortografía correcta.
- Si el template no aplica, sugerir el más cercano y pedir confirmación.

## Recursos

- Mapa de templates en `references/templates.md`.
- Assets de template en `assets/`.
