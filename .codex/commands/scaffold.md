---
description: Crea base de proyecto por modalidad y tipo de proyecto. Soporta presets rapid/robust, backend stacks Fastify/NestJS/FastAPI/Go/Java, verticales y cloud IaC.
---

Usa `$project-scaffolding` y `$stack-selector`.

Entrada del usuario: `$ARGUMENTS`

Pasos:

1. Confirmar modalidad:
   - `rapid` (produccion rapida)
   - `robust` (seguro/robusto)
2. Confirmar tipo:
   - `frontend`
   - `backend`
   - `fullstack`
3. Confirmar preferencia frontend:
   - `react`
   - `angular`
4. Si aplica backend, confirmar stack:
   - `fastify`
   - `nestjs`
   - `fastapi`
   - `go`
   - `java`
5. Si aplica fullstack, confirmar vertical:
   - `saas`
   - `ecommerce`
   - `marketplace`
   - `ai-heavy`
6. Si aplica fullstack, confirmar cloud opcional:
   - `aws`
   - `gcp`
   - `azure`
7. Ejecutar script:
   - `node scripts/scaffold-webapp.js --preset <rapid|robust> --project-type <frontend|backend|fullstack> --frontend <react|angular> --backend-stack <fastify|nestjs|fastapi|go|java> --vertical <saas|ecommerce|marketplace|ai-heavy> --cloud <aws|gcp|azure> --target <path>`
8. Si usuario prefiere template directo, permitir:
   - `node scripts/scaffold-webapp.js --template <template> --target <path>`
9. Verificar archivos creados y mostrar pasos de arranque.

Regla:

- No usar Bootstrap salvo solicitud explicita del usuario.
