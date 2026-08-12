# Workspace (Tenant Application)

The product surface for a single organization's users: documents, contacts, tasks, and organization administration. A workspace is reached through its organization's slug-based subdomain.

## Language

**Organization (workspace)**:
The organization the signed-in user currently works within, shown in the workspace selector and editable from its General settings. Carries profile, company details, and branding.
_Avoid_: workspace (as a domain term — it is a UI label for the current organization)

**Member**:
A user's participation in an organization, carrying a membership role (owner, admin, or member). The workspace's Users page manages members, not raw user identities.
_Avoid_: user (when you mean the membership), participant

**Account**:
A user's personal, cross-workspace area: profile, preferences, security, sessions. Independent of any single organization.
_Avoid_: user settings, personal settings

**Branch**:
A structural unit of the organization — a location, team, or other grouping used to model its hierarchy. (Exposed as Branches and as Organization Structure.)
_Avoid_: department, site (as a strict synonym)

**Permission Role**:
A named bundle of capabilities that can be created and assigned within the workspace. Distinct from the fixed membership roles (owner, admin, member) that govern what a member may do with the workspace itself.
_Avoid_: role group, access role

**Document**:
A file managed within a workspace. Documents are categorized, filtered through views, shared with contacts, processed by workflows, and removed to the recycle bin when deleted or expired.
_Avoid_: file, artifact, asset

**Document Class**:
A categorization applied to documents (contracts, invoices, policies, and so on), used to organize and filter the document library.
_Avoid_: category, folder, type

**Document View**:
A saved way of looking at documents (for example "recently updated", "my documents", "shared with me"), pinned in the sidebar for quick access.
_Avoid_: filter, saved search, query

**Contact**:
An external person — identified by name, email, phone, and company — with whom files are shared. Removed when no longer needed; removal revokes all sharing with that person and, in the workspace flow, requires a reason.
_Avoid_: external user, sharer, recipient

**Recycle Bin**:
The holding area for deleted or expired documents. Documents there can be restored (recovering the document to the library) or permanently erased, the latter restricted to administrators.
_Avoid_: trash, deleted items

**Workflow**:
An automated process that acts on documents — an arrangement supported in the workspace and supervised from the platform.
_Avoid_: automation, pipeline, process

**Task**:
A to-do item in a user's work tracking area, organized into diary, tasks, reminders, and requests.
_Avoid_: todo, reminder, item

**Audit Trail**:
The combined history of a workspace — who signed in and when (access history) and what changed across the workspace (audit log). Built for reviewability and accountability.
_Avoid_: activity, log, history (singular terms are components, not the whole)
