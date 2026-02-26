---
name: codex-orchestrator
description: Orquestador de ciclo completo para desarrollo de software con Codex. Usar cuando la tarea cruza multiples fases (discovery, arquitectura, implementacion, QA, seguridad, release, operacion) y se necesita secuencia profesional con entregables verificables.
---

# Codex Orchestrator

Coordinar el trabajo de principio a fin con enfoque incremental y verificable.

## Flujo base

1. Clasificar la solicitud en fase activa.
2. Cargar la skill de fase correcta.
3. Definir entregables y criterio de aceptacion.
4. Ejecutar solo el incremento acordado.
5. Validar y reportar estado.

## Reglas de uso

- No mezclar discovery profundo con implementacion sin validar alcance.
- No cerrar tareas sin evidencia de validacion.
- Si hay riesgo alto, priorizar seguridad y rollback.

## Recursos

- Mapa de fases: leer `references/lifecycle-map.md` al inicio de tareas grandes.

