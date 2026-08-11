import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ClipboardList,
  FileBarChart,
  History,
  LogOut,
  Settings2,
  Shield,
  SlidersHorizontal,
  Ticket,
  Users,
  UsersRound,
} from "lucide-react";

import { WorkspaceSelector } from "@/components/workspace-selector";

type Organization = {
  logo: string | null;
  name: string;
};

type User = {
  name: string;
};

const sections = [
  {
    items: [
      { href: "/settings/general", icon: Settings2, label: "General" },
      {
        href: "/settings/preferences",
        icon: SlidersHorizontal,
        label: "Preferences",
      },
    ],
    label: "Organization",
  },
  {
    items: [
      { href: "/settings/users", icon: Users, label: "Users" },
      { href: "/settings/roles", icon: Shield, label: "Roles" },
      {
        href: "/settings/user-groups",
        icon: UsersRound,
        label: "User Groups",
      },
    ],
    label: "Human Resources",
  },
  {
    items: [
      {
        href: "/settings/access-history",
        icon: History,
        label: "Access History",
      },
      { href: "/settings/audit-log", icon: ClipboardList, label: "Audit Log" },
      { href: "/settings/reports", icon: FileBarChart, label: "Reports" },
    ],
    label: "Audit",
  },
  {
    items: [
      { href: "/settings/tickets", icon: Ticket, label: "Tickets" },
      {
        href: "/settings/knowledge-base",
        icon: BookOpen,
        label: "Knowledge Base",
      },
    ],
    label: "Support",
  },
] as const;

export function SettingsSidebar({
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

      <div className="border-sidebar-border border-b px-6 py-4">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <Settings2 className="size-4 text-sidebar-primary" />
          <span className="font-semibold text-sm">Settings</span>
        </div>
        <p className="mt-1 text-sidebar-foreground/50 text-xs">
          Workspace administration
        </p>
      </div>

      <nav
        aria-label="Settings navigation"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
      >
        {sections.map((section) => (
          <SidebarSection key={section.label} label={section.label}>
            {section.items.map((item) => (
              <SettingsSidebarItem
                href={item.href}
                icon={item.icon}
                key={item.href}
                label={item.label}
              />
            ))}
          </SidebarSection>
        ))}
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
  label: string;
}) {
  return (
    <section className="mb-5 last:mb-0">
      <h2 className="mb-2 px-3 font-semibold text-[10px] text-sidebar-foreground/45 uppercase tracking-[0.14em]">
        {label}
      </h2>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

function SettingsSidebarItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  const location = useLocation();
  const active = location.pathname === href;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
      to={href}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
