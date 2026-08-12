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
import { LayoutGroup } from "motion/react";

import { SidebarHoverItem } from "@/components/sidebar-hover-item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    <aside className="flex w-full shrink-0 flex-col border-mist border-b bg-snow/70 text-ink md:sticky md:top-0 md:h-svh md:w-72 md:border-r md:border-b-0">
      <div className="border-mist border-b px-5 py-5">
        <WorkspaceSelector organization={organization} />
      </div>

      <div className="border-mist border-b px-5 py-3">
        <Button
          className="w-full justify-start rounded-2xl px-3 text-smoke"
          nativeButton={false}
          render={<Link to="/dashboard" />}
          size="default"
          variant="ghost"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="truncate">Back</span>
        </Button>
      </div>

      <nav
        aria-label="Settings navigation"
        className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
      >
        <LayoutGroup>
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
        </LayoutGroup>
      </nav>

      <div className="border-mist border-t px-5 py-16">
        <div className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2.5 shadow-[var(--shadow-subtle)]">
          <Avatar className="bg-ice">
            <AvatarFallback className="bg-ice font-semibold text-ink text-xs uppercase">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-ink text-sm">
              {user.name}
            </span>
            <span className="block truncate text-fog text-xs">Signed in</span>
          </span>
          <Button
            aria-label="Sign out"
            onClick={onSignOut}
            size="icon-sm"
            title="Sign out"
            variant="ghost"
          >
            <LogOut className="size-4" />
          </Button>
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
      <h2 className="mb-2 px-3 font-semibold text-[11px] text-fog uppercase tracking-[0.02em]">
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
    <SidebarHoverItem>
      <Button
        aria-current={active ? "page" : undefined}
        className={`w-full justify-start rounded-2xl bg-transparent px-3 text-left hover:bg-transparent ${active ? "bg-ice font-semibold text-ink" : "text-smoke"}`}
        nativeButton={false}
        render={<Link aria-current={active ? "page" : undefined} to={href} />}
        size="default"
        variant={active ? "secondary" : "ghost"}
      >
        <Icon className="size-4 shrink-0" />
        <span className="truncate">{label}</span>
      </Button>
    </SidebarHoverItem>
  );
}
