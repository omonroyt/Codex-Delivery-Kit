---
description: Inicia un proyecto de forma guiada con contexto, stack y plan base.
---

Usa `$codex-orchestrator` y `$stack-selector`.

Objetivo: dejar el proyecto listo para construir con decisiones iniciales claras.

Entrada del usuario: `$ARGUMENTS`

Pasos:

1. Revisar `.codex/project-context.md`.
2. Si no existe, revisar `project-context.md`.
3. Si ninguno existe, pedir al usuario ejecutar `node scripts/init-context.js` y usar ese resultado.
4. Resumir el objetivo del proyecto en 5 lineas maximo.
5. Confirmar stack: Scale Mode, Fast Develop Mode o Custom.
6. Confirmar modalidad backend:
   - `rapid` -> Fastify + Prisma + PostgreSQL
   - `robust` -> NestJS + Prisma + PostgreSQL
7. Confirmar tipo de proyecto:
   - `frontend`
   - `backend`
   - `fullstack`
8. Si no hay app base, proponer `/scaffold` con preset y tipo elegidos.
9. Crear backlog inicial con entregables por fase.
10. Proponer primer sprint de ejecucion.

Salida esperada:

- Resumen de contexto
- Stack confirmado
- Plan de trabajo inicial
- Riesgos iniciales y mitigaciones
