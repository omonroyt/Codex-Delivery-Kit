---
description: Ejecuta control de calidad tecnico antes de merge o release.
---

Usa `$quality-assurance`, `$security-compliance`, `$performance-maintenance`.

Entrada del usuario: `$ARGUMENTS`

Pasos:

1. Ejecutar `node scripts/verify-checklist.js`.
2. Reportar fallos por severidad.
3. Proponer plan corto de correccion.
4. Confirmar estado final: bloqueado o listo.

