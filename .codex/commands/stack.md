---
description: Selecciona o ajusta stack de proyecto para Scale, Fast o Custom.
---

Usa `$stack-selector`.

Entrada del usuario: `$ARGUMENTS`

Pasos:

1. Determinar modo: `scale`, `fast` o `custom`.
2. Si falta contexto, preguntar por dominio, usuarios, SLA y presupuesto.
3. Determinar modalidad backend: `rapid` o `robust`.
4. Si se requiere override backend, elegir entre: `fastify`, `nestjs`, `fastapi`, `go`, `java`.
5. Para fullstack, decidir vertical: `saas`, `ecommerce`, `marketplace`, `ai-heavy`.
6. Para infraestructura, decidir cloud IaC opcional: `aws`, `gcp`, `azure`.
7. Determinar tipo de proyecto: `frontend`, `backend`, `fullstack`.
8. Entregar arquitectura minima viable del stack elegido.
9. Incluir trade-offs (velocidad, costo, complejidad, escalabilidad).
10. Definir siguiente accion tecnica.
