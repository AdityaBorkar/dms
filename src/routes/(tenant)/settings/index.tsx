import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  History,
  Settings2,
  Shield,
  SlidersHorizontal,
  Ticket,
  Users,
  UsersRound,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/(tenant)/settings/")({
  component: SettingsPage,
});

const sections = [
  {
    items: [
      {
        description: "Organization profile, branding, and workspace defaults.",
        href: "/settings/general",
        icon: Settings2,
        label: "General",
      },
      {
        description: "Personal preferences and default behaviors.",
        href: "/settings/preferences",
        icon: SlidersHorizontal,
        label: "Preferences",
      },
    ],
    label: "Organization",
  },
  {
    items: [
      {
        description: "Manage the people who can access this workspace.",
        href: "/settings/users",
        icon: Users,
        label: "Users",
      },
      {
        description: "Create and assign permission roles.",
        href: "/settings/roles",
        icon: Shield,
        label: "Roles",
      },
      {
        description: "Model your organization's hierarchy and teams.",
        href: "/settings/branches",
        icon: UsersRound,
        label: "Organization Structure",
      },
    ],
    label: "Human Resources",
  },
  {
    items: [
      {
        description: "Review who signed in and when.",
        href: "/settings/access-history",
        icon: History,
        label: "Access History",
      },
      {
        description: "Track changes made across the workspace.",
        href: "/settings/audit-log",
        icon: ClipboardList,
        label: "Audit Log",
      },
      {
        description: "Generate and export workspace reports.",
        href: "/settings/reports",
        icon: FileBarChart,
        label: "Reports",
      },
    ],
    label: "Audit",
  },
  {
    items: [
      {
        description: "Manage support tickets from your users.",
        href: "/settings/tickets",
        icon: Ticket,
        label: "Tickets",
      },
      {
        description: "Author and organize help articles.",
        href: "/settings/knowledge-base",
        icon: BookOpen,
        label: "Knowledge Base",
      },
    ],
    label: "Support",
  },
] as const;

type Service = (typeof sections)[number]["items"][number];

function SettingsPage() {
  return (
    <main className="min-h-full bg-paper p-5 sm:p-32 lg:p-40">
      <div className="mx-auto max-w-6xl space-y-32">
        <PageHeader
          description="Manage your workspace services and configuration."
          title="Settings"
        />

        <div className="space-y-32">
          {sections.map((section) => (
            <section key={section.label}>
              <h2 className="mb-3 font-semibold text-[11px] text-electric-blue uppercase tracking-[0.02em]">
                {section.label}
              </h2>
              <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <ServiceCard item={item} key={item.href} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function ServiceCard({ item }: { item: Service }) {
  const Icon = item.icon;

  return (
    <Link className="group/card block rounded-2xl" to={item.href}>
      <Card className="h-full border-0 bg-snow transition-colors hover:bg-ice/50">
        <CardHeader>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-lavender text-iris">
            <Icon className="size-5" />
          </span>
          <CardTitle className="text-subheading">{item.label}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
          <CardAction>
            <ChevronRight className="size-4 text-smoke transition-transform group-hover/card:translate-x-0.5" />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
