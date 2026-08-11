import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { p } from "@/aspen/client";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { Route as BaseRoute } from "../route";

export const Route = createFileRoute("/(tenant)/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { organization, user } = BaseRoute.useRouteContext();

  const handleSignOut = useCallback(async () => {
    await p.auth.client.signOut();
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <div className="flex min-h-svh flex-col bg-background md:flex-row">
      <SettingsSidebar
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
