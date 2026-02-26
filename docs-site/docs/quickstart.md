# Quickstart

## 1. Inicializar contexto

```bash
node scripts/init-context.js
```

Se crea `.codex/project-context.md`.
Si `.codex` está restringida, se usa `project-context.md` en la raíz.

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
node scripts/verify-checklist.js apps/api
node scripts/verify-scaffold-templates.js
```

Para validación completa de templates Node y Angular initializer (incluye install/build/dry-run):

```bash
node scripts/verify-scaffold-templates.js --with-install
```

## 4. Mantener trazabilidad

- Actualizar contexto cuando cambie el alcance.
- Mantener ADR y notas técnicas.
- No cerrar tareas sin evidencia.
- Mantener frontend sin Bootstrap salvo excepción explícita.
- En templates backend, mantener migraciones y seed en versionamiento.
