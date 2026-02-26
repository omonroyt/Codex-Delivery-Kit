# Comandos Slash

Los comandos viven en `/.codex/commands`.

## Disponibles en V1

1. `/kickoff`: arranque guiado.
2. `/scaffold`: crear base por preset y tipo.
3. `/stack`: seleccion o ajuste de stack.
4. `/plan`: plan tecnico sin implementacion final.
5. `/build`: ejecucion por incrementos.
6. `/verify`: gates de calidad y seguridad.
7. `/release`: salida a produccion.
8. `/operate`: operacion y soporte.
9. `/ai-flow`: diseno de automatizaciones IA.

## Convencion

- Usar `$ARGUMENTS` para contexto especifico.
- Activar skills por nombre con formato `$skill-name`.
- Entregar salida con siguiente accion clara.

## Nota de `/scaffold`

Permite dos formas:

1. Template directo (`--template`).
2. Seleccion por preset/tipo (`--preset`, `--project-type`, `--frontend`, `--backend-stack`, `--vertical`, `--cloud`).
