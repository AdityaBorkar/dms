import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/(tenant)/(app)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-paper-white p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          actions={
            <Button>
              <Plus />
              New document
            </Button>
          }
          description="Overview of your workspace activity."
          title="Dashboard"
        />

        <Card className="bg-bone/40">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-lavender-wash">
              <LayoutDashboard className="size-6 text-violet-pulse" />
            </span>
            <CardTitle className="text-graphite text-lg">
              Dashboard coming soon
            </CardTitle>
            <p className="max-w-sm text-sm text-steel">
              Workspace activity, recent documents, and pending approvals will
              appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
