import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useCallback } from "react";

import { p } from "@/aspen/client";
import { TenantSidebar } from "@/components/tenant-sidebar";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)")({
  beforeLoad: async ({ location }) => {
    const data = await orpc.auth.getSession();
    if (!data) {
      throw redirect({
        search: { redirect: location.href },
        to: "/",
      });
    }

    const organizationData = await orpc.organizations
      .bySubdomain()
      .catch(() => ({ organization: null }));

    return {
      ...data,
      organization: organizationData.organization
        ? {
            logo: organizationData.organization.logo,
            name: organizationData.organization.name,
          }
        : null,
    };
  },
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { organization, user } = Route.useRouteContext();

  const handleSignOut = useCallback(async () => {
    await p.auth.client.signOut();
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <div className="flex min-h-svh flex-col bg-background md:flex-row">
      <TenantSidebar
        onSignOut={handleSignOut}
        organization={organization}
        user={user}
      />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
