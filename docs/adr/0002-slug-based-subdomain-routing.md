# Slug-based subdomain routing

Status: accepted

Each organization is addressed by its slug as a subdomain of the platform's apex domain (`PUBLIC_WEB_DOMAIN`) — for example `acme.<domain>/dashboard`. The tenant application derives which organization a request belongs to entirely from the request's `Host` header: it strips the apex domain suffix, validates the remaining label against a slug pattern, looks up the organization by that slug, and only then resolves the tenant's database to run the workflow. Requests on the apex domain itself (or an unknown subdomain) resolve to no organization.

We route by slug subdomain rather than a path segment or an `organizationId` parameter because the slug is the organization's public identity, gives every customer a stable branded URL, and keeps workspace URLs free of opaque route prefixes. The cost is that routing depends on the application knowing its own apex domain and on there being exactly one organization per subdomain.

## Considered Options

- Path-based routing (`/<org-slug>/dashboard`) — simpler to reverse-proxy, but cluttered URLs and no branded subdomain; rejected.
- Subdomain routing by a separate database/slug key — chosen for branded URLs and clean path space.

## Consequences

- The apex domain is a routing boundary, not a workspace: requests there are sign-in or organization-selection pages, never a workspace.
- Routing is one-way: a request's organization is derived from the subdomain, never passed in a body that could be forged.
- Enterprise features under consideration (custom domains, multiple workspaces) will have to extend this model.
