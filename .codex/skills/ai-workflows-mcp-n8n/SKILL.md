---
name: ai-workflows-mcp-n8n
description: Diseno y operacion de flujos IA usando MCP y n8n con buenas practicas de seguridad, observabilidad y control de costos. Usar para agentes, herramientas externas y automatizaciones de extremo a extremo.
---

# AI Workflows MCP N8N

Disenar flujos IA robustos para uso real en produccion.

## Alcance

1. Definicion de objetivo del flujo.
2. Contrato de inputs y outputs.
3. Integracion MCP con herramientas externas.
4. Orquestacion en n8n.
5. Guardrails de seguridad y costo.

## Reglas

- Definir timeout, retry y fallback en cada nodo critico.
- Trazar cada ejecucion para debugging.
- Evitar exponer secretos en prompts o logs.

## Recursos

- Plantilla de flujo: `references/flow-template.md`.

