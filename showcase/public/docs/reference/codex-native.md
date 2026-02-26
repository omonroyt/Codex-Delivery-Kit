# Codex Native Reference

Este kit esta adaptado a mecanismos nativos de Codex.

## 1. Archivo de instrucciones del proyecto

- Codex usa `AGENTS.md` como documento principal del proyecto.
- Tambien soporta nombres de fallback configurables.

## 2. Comandos slash custom

- Se definen como archivos Markdown en `.codex/commands/`.
- El contenido del archivo es el prompt del comando.
- Se puede usar frontmatter con `description`.
- Se soporta variable `$ARGUMENTS`.

## 3. Skills nativas

- Se definen por carpeta y archivo `SKILL.md`.
- Ubicaciones comunes:
  - `~/.codex/skills`
  - `./.codex/skills`

## 4. Configuracion

- En `.codex/config.toml`.
- En V1 usamos:
  - `project_doc_max_bytes`
  - `project_doc_fallback_filenames`

## 5. MCP

- Codex soporta integraciones MCP configurables.
- Este kit incluye skill especifica para flujos MCP + n8n.

## Fuentes oficiales

- https://developers.openai.com/codex
- https://developers.openai.com/codex/config
- https://developers.openai.com/codex/slash-commands
- https://developers.openai.com/codex/skills
- https://developers.openai.com/codex/agents
- https://developers.openai.com/codex/mcp

