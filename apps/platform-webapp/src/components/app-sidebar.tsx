import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  Database,
  FileText,
  Handshake,
  LayoutList,
  ScrollText,
  Settings,
  Sheet,
  Shield,
  UserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  stub?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    items: [
      {
        href: "/service-providers",
        icon: Handshake,
        title: "Service Providers",
      },
      { href: "/organizations", icon: Building2, title: "Organizations" },
    ],
    label: "Stakeholders",
  },
  {
    items: [
      { href: "/reports", icon: FileText, title: "Reports" },
      { href: "/users", icon: UserRound, title: "Users" },
    ],
    label: "Administration",
  },
  {
    items: [
      { href: "/logger-logs", icon: ScrollText, title: "Logger Logs" },
      { href: "/workflow-logs", icon: LayoutList, title: "Workflow Logs" },
      { href: "/storage-explorer", icon: Database, title: "Storage Explorer" },
      { href: "/pubsub-pipelines", icon: Sheet, title: "Pubsub Pipelines" },
      { href: "/auth-users", icon: Shield, title: "Auth Users" },
      { href: "/db-cdc", icon: BadgeCheck, title: "DB CDC" },
    ],
    label: "Debugging",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4">
        <Link
          className="flex items-center gap-2.5 rounded-md px-2 outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          to="/dashboard"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-sm">
            P
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sidebar-foreground">
              DMS Platform
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              Management Console
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3">
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="px-2 font-semibold text-[11px] text-sidebar-foreground/50 uppercase tracking-wider">
              {section.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <NavItemLink item={item} key={item.href} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuButton
            className="px-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            render={<Link to="/reports" />}
            tooltip={"Settings"}
          >
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavItemLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <SidebarMenuButton
      className={cn(
        "gap-3 rounded-md px-2.5 data-active:bg-sidebar-accent data-active:text-sidebar-primary-foreground",
      )}
      render={<Link to={item.href} />}
      tooltip={item.title}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{item.title}</span>
      {item.stub ? (
        <SidebarMenuBadge className="ml-auto rounded-full bg-sidebar-primary/15 px-1.5 font-semibold text-[9px] text-sidebar-primary uppercase">
          Soon
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuButton>
  );
}
