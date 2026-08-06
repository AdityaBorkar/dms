import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  Database,
  FileText,
  Handshake,
  LayoutList,
  ScrollText,
  Sheet,
  Shield,
  UserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
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
      { href: "/users", icon: UserRound, title: "Users" },
    ],
    label: "Stakeholders",
  },
  {
    items: [{ href: "/reports", icon: FileText, stub: true, title: "Reports" }],
    label: "Administration",
  },
  {
    items: [
      {
        href: "/logger-logs",
        icon: ScrollText,
        stub: true,
        title: "Logger Logs",
      },
      {
        href: "/workflow-logs",
        icon: LayoutList,
        stub: true,
        title: "Workflow Logs",
      },
      {
        href: "/storage-explorer",
        icon: Database,
        stub: true,
        title: "Storage Explorer",
      },
      {
        href: "/pubsub-pipelines",
        icon: Sheet,
        stub: true,
        title: "Pubsub Pipelines",
      },
      { href: "/auth-users", icon: Shield, stub: true, title: "Auth Users" },
      { href: "/db-cdc", icon: BadgeCheck, stub: true, title: "DB CDC" },
    ],
    label: "Debugging",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <NavItemLink item={item} key={item.href} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function NavItemLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <SidebarMenuButton
      asChild
      className={cn(item.stub && "italic opacity-70")}
      tooltip={item.title}
    >
      <Link to={item.href}>
        <Icon />
        <span>{item.title}</span>
        {item.stub ? (
          <span className="ml-auto text-[10px] text-muted-foreground uppercase">
            TODO
          </span>
        ) : null}
      </Link>
    </SidebarMenuButton>
  );
}
