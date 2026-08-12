# Context Map

The DMS is a single deployed instance running two product surfaces. Each surface is a separate context with its own language.

## Contexts

- [Shared](./docs/shared/CONTEXT.md) — concepts common to both surfaces: Organization, Slug, Subdomain, User
- [Platform (Management Console)](./docs/platform/CONTEXT.md) — where operators provision and govern customer organizations, service providers, and platform users
- [Workspace (Tenant Application)](./docs/workspace/CONTEXT.md) — the per-organization surface where an organization's users manage documents, contacts, and settings

## Relationships

- **Platform → Workspace**: Provisioning a tenant on the platform (Onboarding) brings up the workspace that organization's users work inside; the two view the same Organization from opposite sides.
- **Shared → Platform**: Shared `Organization` is framed as a `Tenant` to be provisioned and governed; `User` is framed as `Platform Admin` / `Platform User`.
- **Shared → Workspace**: Shared `Organization` is framed as the current workspace and `User` as a `Member` carrying a role; `Subdomain` is what routes a request into a specific workspace.

## Decisions

Architectural decisions are recorded under [`docs/adr/`](./docs/adr/).
