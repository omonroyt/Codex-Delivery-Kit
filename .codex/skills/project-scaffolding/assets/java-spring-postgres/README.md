# Java Spring PostgreSQL Template

Backend enterprise con Spring Boot + JPA + PostgreSQL.

Incluye modulos base:

- Auth con access/refresh tokens
- RBAC (endpoint admin)
- Pagos (checkout mock)
- Mensajeria (queue mock)
- Seed admin al inicio
- Migraciones Flyway incluidas
- Test base de salud + auth flow
- Pipeline CI/CD listo con preview image en GHCR

## Inicio

```bash
cp .env.example .env
docker compose up -d
mvn flyway:migrate
mvn spring-boot:run
```

## Testing

```bash
mvn test
```

## Seguridad

```bash
mvn -B -DskipTests org.owasp:dependency-check-maven:check
```

## CI/CD por template

- Archivo: `.github/workflows/ci-cd.yml`
- Incluye:
  - build + test
  - security scan con OWASP dependency-check
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
