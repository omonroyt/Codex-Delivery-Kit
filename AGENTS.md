# AGENTS.md - Codex-Delivery-Kit

Este archivo define cómo debe trabajar Codex en este repositorio.

## Modo de idioma

- Idioma por defecto: español.
- Documentación y textos visibles: usar español con ortografía completa.
- Disciplina técnica: usar inglés en identificadores técnicos (nombres de archivos, claves, variables, funciones, tipos, rutas técnicas y comandos).
- Regla de codificación: usar UTF-8 en documentos visibles; aplicar ASCII solo cuando una restricción técnica del entorno lo requiera.

## Principios de trabajo

1. Priorizar claridad y ejecución real sobre teoría.
2. No imponer stack fijo: ofrecer recomendación y permitir override.
3. Validar antes de marcar una tarea como cerrada.
4. Mantener trazabilidad: cada fase debe dejar artefactos concretos.
5. Respetar contexto del proyecto en `.codex/project-context.md` o fallback `project-context.md`.
6. En frontend, evitar Bootstrap por defecto y priorizar Tailwind con React o Angular.

## Flujo operacional obligatorio

Para tareas de desarrollo, seguir este orden:

1. Discovery y requisitos
2. Selección/confirmación de stack
3. Plan técnico y de entrega
4. Implementación incremental
5. Validación (lint, tests, build, seguridad)
6. Release y operación

Si la solicitud es solo consulta, responder sin ejecutar cambios.

## Política de preguntas iniciales

Antes de implementar una feature nueva:

1. Confirmar objetivo de negocio.
2. Confirmar alcance de la iteración.
3. Confirmar stack (Scale/Fast/Custom).
4. Confirmar criterio de éxito.
5. Confirmar restricciones (tiempo, costo, compliance).

Si ya existen respuestas en `.codex/project-context.md` o `project-context.md`, no repetir preguntas.

## Uso de skills

Codex debe activar skills por contexto. Orden recomendado:

1. `$codex-orchestrator`
2. `$stack-selector`
3. Skill de fase activa (discovery, arquitectura, implementación, QA, etc.)

## Definición de terminado

Una tarea queda terminada solo si:

1. Cumple alcance acordado.
2. Tiene evidencia de validación.
3. Tiene notas de impacto y rollback.
4. Tiene siguiente paso sugerido (si aplica).

## Estándar de artefactos

- Planes: `docs-site/docs/reference/plans/<slug>.md` (si existe la ruta)
- ADR: `docs-site/docs/reference/adr-<id>.md`
- Checklists: usar `scripts/verify-checklist.js`
- Contexto: `.codex/project-context.md` o `project-context.md`

## Integraciones IA

Si la tarea involucra IA o automatizaciones:

1. Aplicar `$ai-workflows-mcp-n8n`.
2. Definir límites de seguridad de datos.
3. Documentar contratos de entrada/salida del flujo.
4. Validar observabilidad del flujo.
