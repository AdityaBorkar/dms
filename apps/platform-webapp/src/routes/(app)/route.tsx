import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useCallback } from "react";

import { p } from "@/aspen/client";
import { getSession } from "@/rpc/get-session";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ location }) => {
    const data = await getSession();
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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <h1 className="font-bold text-gray-900 text-xl">Platform</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              {user.name ?? user.email}
            </span>
            <button
              className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-200"
              onClick={handleSignOut}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
