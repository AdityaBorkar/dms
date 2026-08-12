# Platform (Management Console)

The administrator's view of all organizations hosted on the platform, the parties they partner with, and the people who administer the platform itself. One deployed instance serves the whole product.

## Language

**Tenant**:
The operating unit behind an organization: one organization, one isolated database, one workspace. Provisioning a tenant is how a new organization comes to exist.
_Avoid_: organization (when you mean the isolation unit), site, instance

**Onboarding**:
The workflow that provisions a new organization: creates its tenant with a service provider and plan, then brings up its workspace.
_Avoid_: creation, enrollment, setup

**Service Provider**:
An external party registered on the platform that organizations can be associated with (for ownership, billing, or partnership). A service provider has its own profile: name, slug, website, email, description.
_Avoid_: vendor, partner (as a strict synonym), company

**Platform Admin**:
A user who operates the management console and governs organizations, service providers, and platform access. (Distinct from workspace-side roles.)
_Avoid_: superadmin, operator

**Platform User**:
A person provisioned on the platform with a platform-level role (admin, service-provider user, or tenant-level role). The management console's Users page manages these.
_Avoid_: system user, internal user

**Plan**:
The subscription tier a tenant is provisioned with during onboarding. (Currently a free-form label on the tenant record, not yet a first-class catalog.)
_Avoid_: package, tier (as a strict synonym)

**Workspace**:
The product surface that a tenant's organization users work inside. Provisioning a workspace is the second step of Onboarding, after its tenant exists.
_Avoid_: app, instance, tenant-url
