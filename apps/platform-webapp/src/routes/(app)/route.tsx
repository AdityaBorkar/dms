import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useCallback } from "react";

import { p } from "@/aspen/client";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <SidebarTrigger />
            <Separator className="h-5" orientation="vertical" />
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-[10px] text-primary uppercase">
                Console
              </span>
              <span className="font-semibold text-foreground">Platform</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden flex-col items-end sm:flex">
                <span className="font-medium text-foreground text-xs">
                  {user.name ?? "User"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
              </div>
              <Button onClick={handleSignOut} size="icon-sm" variant="ghost">
                <LogOut />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-slate-50/50 p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
