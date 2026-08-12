# Shared

Terms that mean the same thing on both sides of the platform. The two contexts frame these entities differently (see the platform and workspace glossaries) — these are the neutral, perspective-free definitions.

## Language

**Organization**:
A customer of the platform that operates its own workspace. An organization has a profile (name, slug, contact and registration details, branding) and a lifecycle status. The same entity is viewed from two perspectives: as a tenant to be provisioned and governed in the platform, and as the current workspace a user works inside.
_Avoid_: company, customer, client, account

**Slug**:
The URL-safe identifier of an organization (or service provider). An organization's slug becomes the subdomain of its workspace.
_Avoid_: handle, shortname

**Subdomain**:
The slug-based address of an organization's workspace, derived from the requested host. It is how a request is associated with a specific organization.
_Avoid_: site, host, tenant url

**User**:
A person identity that can sign in, with a name and an email. A user is global to the platform and may belong to many organizations.
_Avoid_: account, person, person record
