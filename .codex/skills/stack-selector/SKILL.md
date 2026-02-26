---
name: stack-selector
description: Selector de stack para Codex Develop Master. Usar para elegir entre Scale Mode, Fast Develop Mode o stack custom al iniciar proyecto o cuando se redefine arquitectura.
---

# Stack Selector

Elegir stack segun velocidad, costo, complejidad y escalabilidad.

## Protocolo

1. Revisar `.codex/project-context.md`.
2. Si falta contexto, preguntar por dominio, carga esperada y plazo.
3. Proponer stack recomendado y una alternativa.
4. Explicar trade-offs y riesgo de lock-in.
5. Confirmar preferencia frontend: React o Angular.
6. Confirmar uso de Tailwind y evitar Bootstrap por defecto.
7. Confirmar modalidad backend:
   - `rapid` -> Fastify + Prisma + PostgreSQL
   - `robust` -> NestJS + Prisma + PostgreSQL
8. Confirmar tipo de proyecto:
   - `frontend`
   - `backend`
   - `fullstack`

## Regla de salida

Entregar decision final con:

- stack elegido
- razones
- componentes minimos
- siguiente paso tecnico

## Recursos

- Leer `references/stacks.md` para la matriz de decision.
