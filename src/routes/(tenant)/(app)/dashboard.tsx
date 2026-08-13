import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Check,
  Clock3,
  FileText,
  LayoutDashboard,
  Plus,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/(tenant)/(app)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-full bg-paper p-5 sm:p-32 lg:p-40">
      <div className="mx-auto max-w-6xl space-y-32">
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

        <section className="grid gap-16 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="overflow-visible border-0 bg-snow">
            <CardContent className="grid gap-32 p-6 sm:p-32 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 font-semibold text-electric-blue text-eyebrow uppercase tracking-[0.02em]">
                  <Check className="size-3.5" />
                  Workspace ready
                </span>
                <h2 className="max-w-md font-semibold text-3xl text-ink tracking-[-0.03em] sm:text-heading-lg">
                  Keep every document moving forward.
                </h2>
                <p className="mt-4 max-w-md text-body-sm text-smoke">
                  Your workspace is ready for documents, approvals, and the
                  people who keep your business in motion.
                </p>
              </div>
              <div className="relative min-h-52 rounded-3xl bg-lavender p-16 sm:min-h-60">
                <div className="absolute -top-3 right-4 size-7 rounded-full bg-magenta" />
                <div className="absolute right-5 bottom-4 left-5 rounded-2xl bg-paper p-5 shadow-[var(--shadow-subtle)] sm:left-10">
                  <div className="flex items-center justify-between border-mist border-b pb-3">
                    <span className="font-semibold text-[10px] text-smoke uppercase tracking-[0.02em]">
                      Invoice no. 001
                    </span>
                    <FileText className="size-4 text-iris" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-12">
                    <div>
                      <span className="text-[10px] text-fog uppercase">
                        From
                      </span>
                      <p className="mt-1 font-semibold text-ink text-sm">
                        Your team
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-fog uppercase">
                        Status
                      </span>
                      <p className="mt-1 font-semibold text-leaf text-sm">
                        Ready
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-mist border-t pt-3">
                    <span className="text-smoke text-xs">Total</span>
                    <span className="font-semibold text-ink">$12,480.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-midnight text-paper">
            <CardContent className="flex h-full flex-col justify-between p-6 sm:p-32">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[11px] text-ice uppercase tracking-[0.02em]">
                  At a glance
                </span>
                <LayoutDashboard className="size-5 text-electric-blue" />
              </div>
              <div className="mt-12">
                <p className="font-semibold text-display tracking-[-0.03em]">
                  24
                </p>
                <p className="mt-1 text-body-sm text-mist">
                  documents in your workspace
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-ice text-sm">
                <Clock3 className="size-4 text-electric-blue" />
                Ready for your first review
                <ArrowUpRight className="ml-auto size-4" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-16 sm:grid-cols-3">
          <MetricCard label="Documents indexed" value="24" />
          <MetricCard label="Awaiting review" value="08" />
          <MetricCard label="Team members" value="12" />
        </section>
      </div>
    </main>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-0 bg-snow">
      <CardContent className="p-6">
        <p className="font-semibold text-3xl text-ink tracking-[-0.03em]">
          {value}
        </p>
        <p className="mt-2 text-body-sm text-smoke">{label}</p>
      </CardContent>
    </Card>
  );
}
