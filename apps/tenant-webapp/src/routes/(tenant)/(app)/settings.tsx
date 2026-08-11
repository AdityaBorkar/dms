import { createFileRoute } from "@tanstack/react-router";
import { Building2, CheckCircle2, ShieldCheck, UserRound } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/(app)/settings")({
  component: SettingsPage,
  loader: async () => {
    try {
      const data = await orpc.organizations.bySubdomain();
      return {
        organization: data.organization
          ? {
              logo: data.organization.logo,
              name: data.organization.name,
              slug: data.organization.slug,
            }
          : null,
      };
    } catch (error) {
      console.error("Failed to load organization settings", error);
      return { organization: null };
    }
  },
});

function SettingsPage() {
  const { organization } = Route.useLoaderData();
  const { session, user } = Route.useRouteContext();

  return (
    <main className="min-h-svh bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          description="Your profile, workspace, and authentication details from Aspen."
          title="Settings"
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <SettingsCard
            description="The account currently signed in to this workspace."
            icon={UserRound}
            title="Profile"
          >
            <InfoRow label="Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="User ID" mono value={user.id} />
            <InfoRow label="Role" value={user.role ?? "Not assigned"} />
          </SettingsCard>

          <SettingsCard
            description="The organization associated with this tenant domain."
            icon={Building2}
            title="Organization"
          >
            <InfoRow label="Name" value={organization?.name ?? "Unavailable"} />
            <InfoRow
              label="Slug"
              mono
              value={organization?.slug ?? "Unavailable"}
            />
            <InfoRow
              label="Logo"
              value={organization?.logo ? "Configured" : "Not configured"}
            />
          </SettingsCard>

          <SettingsCard
            description="Authentication protections reported by Aspen."
            icon={ShieldCheck}
            title="Security"
          >
            <StatusRow enabled={user.emailVerified} label="Email verified" />
            <StatusRow
              enabled={user.twoFactorEnabled === true}
              label="Two-factor authentication"
            />
            <StatusRow enabled={!user.banned} label="Account active" />
          </SettingsCard>

          <SettingsCard
            description="Details about the current authenticated session."
            icon={CheckCircle2}
            title="Current session"
          >
            <InfoRow label="Created" value={formatDate(session.createdAt)} />
            <InfoRow label="Expires" value={formatDate(session.expiresAt)} />
            <InfoRow
              label="IP address"
              value={session.ipAddress ?? "Not recorded"}
            />
            <InfoRow
              label="Client"
              value={session.userAgent ?? "Not recorded"}
            />
          </SettingsCard>
        </div>

        <p className="text-muted-foreground text-xs">
          These values are read from Aspen and are currently managed by your
          workspace administrator.
        </p>
      </div>
    </main>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function SettingsCard({
  children,
  description,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  description: string;
  icon: typeof Building2;
  title: string;
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="mt-1 text-muted-foreground text-xs">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0 pt-2">{children}</CardContent>
    </Card>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function InfoRow({
  label,
  mono = false,
  value,
}: {
  label: string;
  mono?: boolean;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-border/70 border-b py-3 last:border-0">
      <dt className="shrink-0 text-muted-foreground text-xs">{label}</dt>
      <dd
        className={`max-w-[65%] truncate text-right text-foreground text-xs ${mono ? "font-mono" : "font-medium"}`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function StatusRow({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-border/70 border-b py-3 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-xs ${enabled ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {enabled ? "Enabled" : "Not enabled"}
      </span>
    </div>
  );
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
