import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useCallback } from "react";

import { p } from "@/aspen/client";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ location }) => {
    const data = await orpc.auth.getSession();
    if (!data) {
      throw redirect({
        search: { redirect: location.href },
        to: "/",
      });
    }
    return data;
  },
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();

  const handleSignOut = useCallback(async () => {
    await p.auth.client.signOut();
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <div>
      <div>Hello World: {user.name}</div>
      <button onClick={handleSignOut} type="button">
        Sign Out
      </button>
      <Outlet />
    </div>
  );
}
