# Comandos Slash

Los comandos viven en `/.codex/commands`.

## Disponibles en V1

1. `/kickoff`: arranque guiado.
2. `/scaffold`: crear base por preset y tipo.
3. `/stack`: selección o ajuste de stack.
4. `/plan`: plan técnico sin implementación final.
5. `/build`: ejecución por incrementos.
6. `/verify`: gates de calidad y seguridad.
7. `/release`: salida a producción.
8. `/operate`: operación y soporte.
9. `/ai-flow`: diseño de automatizaciones IA.

## Convención

- Usar `$ARGUMENTS` para contexto específico.
- Activar skills por nombre con formato `$skill-name`.
- Entregar salida con siguiente acción clara.

## Nota de `/scaffold`

Permite dos formas:

1. Template directo (`--template`).
2. Selección por preset/tipo (`--preset`, `--project-type`, `--frontend`, `--backend-stack`, `--vertical`, `--cloud`).
