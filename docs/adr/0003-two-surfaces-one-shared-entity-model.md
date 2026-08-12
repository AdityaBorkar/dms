# Two surfaces, one shared entity model

Status: accepted

The product is one deployed instance serving two surfaces: the platform management console (`apps/platform-webapp`, the "P" console) and the tenant application (`apps/tenant-webapp`). They are separate Bun workspace apps with separate route trees and separate oRPC routers, but they load the same `@aspen-os` platform server (both create an `IsolatedTenantPlatform` from the same `ManagementPlane` and `Organization` modules) and share the same `Organization`, `Slug`, `Subdomain`, and `User` concepts.

We keep the two as separate applications rather than one unified app because their audiences, authentication models, and route trees differ fundamentally: the platform is governed by `Platform Admin` roles and acts globally, while the workspace is leased to an organization, authenticated per-tenant, and reached only through its subdomain. The glossary reflects this as two domain contexts (platform and workspace) sharing a small set of common terms.

## Considered Options

- One combined management+tenant application — fewer moving parts, but would mix global administration with per-tenant concerns in one route tree and one auth model.
- Two deployed applications — chosen: clear separation of concerns, independent deployment, and matching the two distinct audiences.

## Consequences

- Terms like "Organization" are intentionally overloaded across the two contexts; the glossary (CONTEXT-MAP.md + per-context glossaries) records which framing each app uses.
- Domain code (management and organization modules) is shared through the `@aspen-os` packages, not duplicated; the two apps differ only in presentation and routing.
