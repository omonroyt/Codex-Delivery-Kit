# SaaS Vertical Blueprint

## Core features

1. Multi-tenant workspace model
2. Subscription and billing lifecycle
3. RBAC and audit trail
4. Usage metering
5. Admin portal and customer portal

## Suggested milestones

1. Tenant and auth baseline
2. Plan management and billing webhooks
3. Usage tracking and enforcement
4. Observability and SLO dashboard

## Data notes

- Isolate tenant data by tenant_id.
- Enforce tenant scoping in every query.

