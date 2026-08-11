import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
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
      { href: "/settings/branches", icon: Settings2, label: "Branches" },
    ],
    label: "Organization",
  },
  {
    items: [
      { href: "/settings/users", icon: Users, label: "Users" },
      { href: "/settings/roles", icon: Shield, label: "Roles" },
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
    <aside className="flex w-full shrink-0 flex-col border-ash border-b bg-paper-white text-graphite md:sticky md:top-0 md:h-svh md:w-64 md:border-r md:border-b-0">
      <div className="border-ash border-b px-4 py-4">
        <WorkspaceSelector organization={organization} />
      </div>

      <div className="border-ash border-b px-4 py-3">
        <Link
          className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm text-steel transition-colors hover:bg-bone hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-pulse/30"
          to="/dashboard"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="truncate">Back</span>
        </Link>
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

      <div className="border-ash border-t px-4 py-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bone font-medium text-steel text-xs uppercase">
            {user.name.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-graphite text-sm">
              {user.name}
            </span>
            <span className="block truncate text-smoke text-xs">Signed in</span>
          </span>
          <button
            aria-label="Sign out"
            className="flex size-8 items-center justify-center rounded-md text-smoke transition-colors hover:bg-bone hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-pulse/30"
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
      <h2 className="mb-2 px-3 font-semibold text-[10px] text-steel uppercase tracking-[0.14em]">
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
      className={`flex h-9 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-pulse/30 ${active ? "bg-lavender-wash font-medium text-violet-pulse" : "text-steel hover:bg-bone hover:text-graphite"}`}
      to={href}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
