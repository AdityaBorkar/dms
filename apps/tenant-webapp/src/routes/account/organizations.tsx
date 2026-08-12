import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2 } from "lucide-react";
import { object, optional, string } from "valibot";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/env";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/account/organizations")({
  component: RouteComponent,
  loader: async () => {
    try {
      return await orpc.organizations.list();
    } catch {
      return { organizations: [] };
    }
  },
  validateSearch: object({ redirect: optional(string()) }),
});

function RouteComponent() {
  const { organizations } = Route.useLoaderData();

  const getOrganizationUrl = (slug: string) => {
    const protocol = env.PUBLIC_WEB_SSL ? "https" : "http";
    const port = env.PUBLIC_WEB_PORT ? `:${env.PUBLIC_WEB_PORT}` : "";
    const url = new URL(
      `${protocol}://${slug}.${env.PUBLIC_WEB_DOMAIN}${port}/dashboard`,
    );

    return url.toString();
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-snow px-16 py-12 font-sans text-ink">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-midnight text-paper">
            <Building2 className="size-5" />
          </span>
          <p className="mt-6 font-semibold text-electric-blue text-eyebrow uppercase tracking-[0.02em]">
            Tenant Application
          </p>
          <h1 className="mt-3 font-semibold text-heading text-ink tracking-[-0.03em]">
            Choose your organization
          </h1>
          <p className="mt-2 max-w-sm text-body-sm text-smoke">
            Select an organization to continue to its sign-in page.
          </p>
        </div>

        {organizations.length > 0 ? (
          <div className="space-y-3">
            {organizations.map((organization) => (
              <Card
                className="border-0 shadow-[var(--shadow-subtle)]"
                key={organization.id}
                render={
                  <a
                    className="group flex min-h-64 items-center justify-between rounded-2xl px-5 py-16 transition-colors hover:bg-snow"
                    href={getOrganizationUrl(organization.slug)}
                  />
                }
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink text-sm">
                    {organization.name}
                  </span>
                  <span className="mt-1 block truncate text-fog text-xs">
                    {organization.slug}
                  </span>
                </span>
                <ArrowRight className="ml-4 size-4 shrink-0 text-fog transition-transform group-hover:translate-x-0.5 group-hover:text-electric-blue" />
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-[var(--shadow-subtle)]">
            <CardHeader className="items-center pt-8 text-center">
              <CardTitle className="text-sm">
                No organizations available
              </CardTitle>
              <p className="mt-1 text-body-sm text-smoke">
                Contact your administrator if you need access to an
                organization.
              </p>
            </CardHeader>
          </Card>
        )}
      </div>
    </main>
  );
}
