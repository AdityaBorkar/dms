# Per-tenant isolated databases

Status: accepted

The platform provisions new organizations by giving each one its own tenant: one organization, one isolated Postgres database (named `tenant_*`), one workspace. The platform keeps a `control_plane` database for its own records (organizations, tenants, service providers, platform users). All domain workflows run inside the tenant's database context (`p.run("<tenantDb>", ...)`) and are reached through `management` workflow getters rather than direct SQL.

We chose database-per-tenant isolation over a shared-schema multi-tenant design because it gives hard data separation between customers, which matters for a document-management product handling sensitive files, and it matches how the underlying `@aspen-os` platform composes modules. The cost is that provisioning and routing become real operations: a request must first resolve its organization's tenant database before any workspace workflow can run.

## Considered Options

- Shared schema with a tenant discriminator column — cheapest to scale, but makes accidental cross-tenant data leaks a persistent class of bug and complicates per-customer retention.
- Database-per-tenant — strong isolation, but adds provisioning and per-request database resolution; chosen here.

## Consequences

- Tenant database resolution is a precondition of every workspace operation; see ADR-0002 for how a request is mapped to its tenant.
- Metadata shared across tenants (organizations, tenants, service providers, platform users) lives only in `control_plane`; workspace data never does.
