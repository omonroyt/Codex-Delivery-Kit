---
name: cicd-release
description: Integracion continua, despliegue y release management para entornos de produccion. Usar para pipelines, estrategias de deploy, rollback, versionado y estabilizacion post-release.
---

# CI CD Release

Entregar cambios con bajo riesgo operativo.

## Entregables

1. Pipeline CI con checks obligatorios.
2. Estrategia de despliegue (rolling, blue/green o canary).
3. Plan de rollback probado.
4. Checklist post-deploy.

## Reglas

- No desplegar sin gates de calidad.
- Definir owner de release y ventana de observacion.

## Recursos

- Blueprint de release: `references/release-blueprint.md`.

