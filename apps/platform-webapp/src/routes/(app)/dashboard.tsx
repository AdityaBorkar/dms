import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Building2,
  FileText,
  Handshake,
  UserRound,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardPage,
});

const overview = [
  {
    href: "/service-providers",
    icon: Handshake,
    label: "Service Providers",
    tint: "from-indigo-500 to-violet-600",
    value: "—",
  },
  {
    href: "/organizations",
    icon: Building2,
    label: "Organizations",
    tint: "from-emerald-500 to-teal-600",
    value: "—",
  },
  {
    href: "/users",
    icon: UserRound,
    label: "Users",
    tint: "from-amber-500 to-orange-600",
    value: "—",
  },
  {
    href: "/reports",
    icon: FileText,
    label: "Reports",
    tint: "from-rose-500 to-pink-600",
    value: "Soon",
  },
];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Overview of your platform at a glance."
        title="Dashboard"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overview.map(({ icon: Icon, label, value }) => (
          <Card
            className="border-slate-200 shadow-sm transition-shadow hover:shadow-md"
            key={label}
          >
            <CardContent className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-muted-foreground text-xs">
                  {label}
                </p>
                <p className="mt-2 font-semibold text-3xl text-foreground tracking-tight">
                  {value}
                </p>
              </div>
              <Icon className="size-5 shrink-0 text-muted-foreground/70" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Quick access</CardTitle>
            <CardDescription>
              Jump into the core management areas of the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {overview.slice(0, 3).map(({ href, icon: Icon, label, tint }) => (
              <a
                className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/60"
                href={href}
                key={href}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tint} text-white shadow-sm`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 font-medium text-foreground text-sm">
                  {label}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground text-sm">
            <p>
              The DMS Platform console lets you manage the stakeholders that
              operate on your tenant infrastructure.
            </p>
            <p>
              Reports and debugging tooling are rolling out in upcoming
              releases.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
