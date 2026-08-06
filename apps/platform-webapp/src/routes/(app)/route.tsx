import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useCallback } from "react";

import { p } from "@/aspen/client";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="border-b bg-white">
          <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
            <SidebarTrigger />
            <Separator className="h-6" orientation="vertical" />
            <span className="font-bold text-gray-900">Platform</span>
            <div className="ml-auto flex items-center gap-4">
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
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
