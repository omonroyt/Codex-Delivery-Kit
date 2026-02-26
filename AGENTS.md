# AGENTS.md - Codex Develop Master

Este archivo define como debe trabajar Codex en este repositorio.

## Modo de idioma

- Idioma por defecto: español.
- Politica ASCII-safe: en entregables tecnicos evitar acentos y `n` para prevenir errores de codificacion.
- Si el usuario pide texto formal con ortografia completa, usarlo solo en la respuesta final visible, no en nombres de archivos ni claves tecnicas.

## Principios de trabajo

1. Priorizar claridad y ejecucion real sobre teoria.
2. No imponer stack fijo: ofrecer recomendacion y permitir override.
3. Validar antes de marcar una tarea como cerrada.
4. Mantener trazabilidad: cada fase debe dejar artefactos concretos.
5. Respetar contexto del proyecto en `.codex/project-context.md` o fallback `project-context.md`.
6. En frontend, evitar Bootstrap por defecto y priorizar Tailwind con React o Angular.

## Flujo operacional obligatorio

Para tareas de desarrollo, seguir este orden:

1. Discovery y requisitos
2. Seleccion/confirmacion de stack
3. Plan tecnico y de entrega
4. Implementacion incremental
5. Validacion (lint, tests, build, seguridad)
6. Release y operacion

Si la solicitud es solo consulta, responder sin ejecutar cambios.

## Politica de preguntas iniciales

Antes de implementar una feature nueva:

1. Confirmar objetivo de negocio.
2. Confirmar alcance de la iteracion.
3. Confirmar stack (Scale/Fast/Custom).
4. Confirmar criterio de exito.
5. Confirmar restricciones (tiempo, costo, compliance).

Si ya existen respuestas en `.codex/project-context.md` o `project-context.md`, no repetir preguntas.

## Uso de skills

Codex debe activar skills por contexto. Orden recomendado:

1. `$codex-orchestrator`
2. `$stack-selector`
3. Skill de fase activa (discovery, arquitectura, implementacion, QA, etc.)

## Definicion de terminado

Una tarea queda terminada solo si:

1. Cumple alcance acordado.
2. Tiene evidencia de validacion.
3. Tiene notas de impacto y rollback.
4. Tiene siguiente paso sugerido (si aplica).

## Estandar de artefactos

- Planes: `docs-site/docs/reference/plans/<slug>.md` (si existe la ruta)
- ADR: `docs-site/docs/reference/adr-<id>.md`
- Checklists: usar `scripts/verify-checklist.js`
- Contexto: `.codex/project-context.md` o `project-context.md`

## Integraciones IA

Si la tarea involucra IA o automatizaciones:

1. Aplicar `$ai-workflows-mcp-n8n`.
2. Definir limites de seguridad de datos.
3. Documentar contratos de entrada/salida del flujo.
4. Validar observabilidad del flujo.
