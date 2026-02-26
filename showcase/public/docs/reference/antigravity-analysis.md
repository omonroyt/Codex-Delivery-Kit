# Analisis completo de antigravity-kit para migracion a Codex

## Resumen estructural detectado

- Agents: 20
- Skills: 37
- Workflows: 11
- Rules globales: 1 (`GEMINI.md`)
- Scripts maestros: 4

## Lo reutilizable

1. Estructura modular por capacidades (agentes/skills/workflows/scripts).
2. Enfoque de workflows con comandos slash.
3. Concepto de validacion centralizada por checklist.
4. Uso de skills con `SKILL.md` y recursos por carpeta.
5. Cobertura amplia de dominio (backend, frontend, QA, seguridad, deploy).

## Lo que no se debe migrar directo

1. Acoplamiento a `GEMINI.md` y protocolos propios de Gemini.
2. Reglas de enrutamiento de agentes no nativas de Codex.
3. Convenciones de archivo y comandos que no siguen estructura `.codex`.
4. Suposiciones de modos y sintaxis especifica del runtime original.

## Decisiones de refactor para Codex-Delivery-Kit

1. Reemplazar regla central `GEMINI.md` por `AGENTS.md` nativo.
2. Reescribir workflows a `.codex/commands/*.md`.
3. Reorganizar skills en `.codex/skills/<skill>/SKILL.md`.
4. Mantener validacion por script, pero con utilidades multiplataforma.
5. Mantener amplitud funcional en fases, no en personajes de agente.

## Mapeo funcional Antigravity -> Codex V1

- `/create` -> `/kickoff` + `/build`
- `/plan` -> `/plan`
- `/debug` -> `/build` + `/verify`
- `/deploy` -> `/release`
- `/status` -> `/operate`
- `app-builder` -> `codex-orchestrator` + `stack-selector`

## Riesgos de migracion

1. Sobreprompting y exceso de contexto.
2. Reglas ambiguas en idioma espanol no ASCII-safe.
3. Dependencia de scripts sin estandar de salida.
4. Falta de criterios de terminado por fase.

## Mitigaciones aplicadas en V1

1. Skills separadas por fase para carga selectiva.
2. Politica de idioma definida desde `AGENTS.md`.
3. Comandos slash con salida esperada y pasos concretos.
4. Checklist tecnico minimo por script.

