# Quickstart

## 1. Inicializar contexto

```bash
node scripts/init-context.js
```

Se crea `.codex/project-context.md`.
Si `.codex` esta restringida, se usa `project-context.md` en la raiz.

## 2. Iniciar flujo en Codex

Usar comandos slash:

- `/kickoff`
- `/scaffold` (rapid/robust + frontend/backend/fullstack)
- `/stack`
- `/plan`
- `/build`
- `/verify`
- `/release`

Ejemplos directos:

```bash
node scripts/scaffold-webapp.js --preset rapid --project-type fullstack --frontend react --target apps/my-app
node scripts/scaffold-webapp.js --preset robust --project-type backend --backend-stack java --target apps/api
node scripts/scaffold-webapp.js --preset rapid --project-type fullstack --frontend angular --backend-stack fastapi --vertical ai-heavy --cloud gcp --target apps/ai-suite
```

## 3. Ejecutar validaciones

```bash
node scripts/verify-checklist.js
node scripts/verify-scaffold-templates.js
```

Para validacion completa del template React/Fastify/Nest (incluye install y build):

```bash
node scripts/verify-scaffold-templates.js --with-install
```

## 4. Mantener trazabilidad

- Actualizar contexto cuando cambie alcance.
- Mantener ADR y notas tecnicas.
- No cerrar tareas sin evidencia.
- Mantener frontend sin Bootstrap salvo excepcion explicita.
- En templates backend, mantener migraciones y seed en versionamiento.
