import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ContactRound,
  Files,
  LayoutList,
  ListChecks,
  LogOut,
  MessageSquare,
  Pin,
  Plus,
  Search,
  Tags,
  Trash2,
  Workflow,
} from "lucide-react";

import { WorkspaceSelector } from "@/components/workspace-selector";

type Organization = {
  logo: string | null;
  name: string;
};

type User = {
  name: string;
};

const pinnedDocumentClasses = ["Contracts", "Invoices", "Policies"];
const pinnedDocumentViews = [
  "Recently Updated",
  "My Documents",
  "Shared with Me",
];

export function TenantSidebar({
  onSignOut,
  organization,
  user,
}: {
  onSignOut: () => void | Promise<void>;
  organization: Organization | null;
  user: User;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-border border-b bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-svh md:w-64 md:border-r md:border-b-0">
      <div className="border-sidebar-border border-b px-4 py-4">
        <WorkspaceSelector organization={organization} />
      </div>

      <div className="space-y-2 px-4 py-4">
        <button
          className="flex h-9 w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent/60 px-3 text-sidebar-foreground/75 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          type="button"
        >
          <Search className="size-4" />
          <span>Search</span>
          <kbd className="ml-auto rounded border border-sidebar-border px-1.5 py-0.5 text-[10px] text-sidebar-foreground/45">
            Ctrl K
          </kbd>
        </button>
        <button
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-sidebar-primary px-3 font-medium text-sidebar-primary-foreground text-sm shadow-sm transition-colors hover:bg-sidebar-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          type="button"
        >
          <Plus className="size-4" />
          New
        </button>
      </div>

      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 overflow-y-auto px-4 pb-4"
      >
        <SidebarSection>
          <SidebarItem
            href="/notifications"
            icon={Bell}
            label="Notifications"
          />
          <SidebarItem href="/tasks" icon={ListChecks} label="Tasks" />
          <SidebarItem href="/workflows" icon={Workflow} label="Workflows" />
          <SidebarItem href="/documents" icon={Files} label="All Documents" />
          <SidebarItem
            href="/document-classes"
            icon={Tags}
            label="Document Classes"
          />
          <div className="space-y-0.5">
            {pinnedDocumentClasses.map((documentClass) => (
              <SidebarItem
                href="/document-classes"
                icon={Pin}
                key={documentClass}
                label={documentClass}
                nested
              />
            ))}
          </div>
          <SidebarItem
            href="/document-views"
            icon={LayoutList}
            label="Document Views"
          />
          <div className="space-y-0.5">
            {pinnedDocumentViews.map((documentView) => (
              <SidebarItem
                href="/document-views"
                icon={Pin}
                key={documentView}
                label={documentView}
                nested
              />
            ))}
          </div>
          <SidebarItem
            href="/discussions"
            icon={MessageSquare}
            label="Discussions"
          />
          <SidebarItem href="/contacts" icon={ContactRound} label="Contacts" />
          <SidebarItem href="/recycle-bin" icon={Trash2} label="Recycle Bin" />
        </SidebarSection>
      </nav>

      <div className="border-sidebar-border border-t px-4 py-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent font-medium text-sidebar-foreground text-xs uppercase">
            {user.name.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-sm">
              {user.name}
            </span>
            <span className="block truncate text-sidebar-foreground/55 text-xs">
              Signed in
            </span>
          </span>
          <button
            aria-label="Sign out"
            className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            onClick={onSignOut}
            title="Sign out"
            type="button"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <section className="mb-6 last:mb-0">
      {label ? (
        <h2 className="mb-2 px-3 font-semibold text-[10px] text-sidebar-foreground/45 uppercase tracking-[0.14em]">
          {label}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  nested = false,
}: {
  href?:
    | "/contacts"
    | "/document-classes"
    | "/document-views"
    | "/documents"
    | "/discussions"
    | "/notifications"
    | "/recycle-bin"
    | "/settings"
    | "/tasks"
    | "/users"
    | "/workflows";
  icon: LucideIcon;
  label: string;
  nested?: boolean;
}) {
  const className = `flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${nested ? "pl-6 text-sidebar-foreground/70" : "text-sidebar-foreground/85"}`;
  const content = (
    <>
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </>
  );

  return href ? (
    <Link className={className} to={href}>
      {content}
    </Link>
  ) : (
    <button className={className} type="button">
      {content}
    </button>
  );
}
