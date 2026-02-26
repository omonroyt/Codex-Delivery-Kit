# FastAPI PostgreSQL Template

Backend Python productivo con FastAPI + SQLAlchemy + PostgreSQL.

Incluye modulos base:

- Auth con access/refresh tokens
- RBAC (endpoint admin)
- Pagos (checkout mock)
- Mensajeria (queue mock)
- Seed de usuario admin
- Migraciones Alembic incluidas
- Test base de salud + auth flow e2e
- Pipeline CI/CD listo con preview image en GHCR

## Inicio

1. Crear entorno virtual:

```bash
python -m venv .venv
```

2. Activar:

```bash
# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate
```

3. Instalar:

```bash
pip install -r requirements.txt
```

4. Copiar variables:

```bash
cp .env.example .env
```

5. Levantar DB:

```bash
docker compose up -d
```

6. Aplicar migraciones:

```bash
alembic upgrade head
```

7. Seed admin:

```bash
python -m app.seed
```

8. Ejecutar API:

```bash
uvicorn app.main:app --reload
```

## QA y seguridad

```bash
pytest -q
pip-audit -r requirements.txt
```

## CI/CD por template

- Archivo: `.github/workflows/ci-cd.yml`
- Incluye:
  - migrate + seed + test en CI
  - audit de dependencias Python
  - preview deploy via container image en GHCR para PRs

## Endpoints base

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `GET /admin/users`
- `POST /payments/checkout`
- `POST /messages/send`
