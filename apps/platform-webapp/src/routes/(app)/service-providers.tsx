import { createFileRoute } from "@tanstack/react-router";
import { Handshake } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EntityAvatar, StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(app)/service-providers")({
  component: ServiceProvidersPage,
  loader: async () => {
    try {
      return await orpc.management.serviceProviders.list();
    } catch (error) {
      console.error("Failed to load service providers", error);
      return null;
    }
  },
});

function ServiceProvidersPage() {
  const providers = Route.useLoaderData();
  const count = providers?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Handshake className="size-5 text-muted-foreground" />}
        description="Service providers provisioned on the platform."
        title="Service Providers"
      />
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>All providers</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
              {count} {count === 1 ? "provider" : "providers"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="px-4">Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!providers || providers.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="py-12 text-center text-muted-foreground"
                    colSpan={3}
                  >
                    <div className="mx-auto max-w-xs space-y-1">
                      <p className="font-medium text-foreground">
                        No service providers
                      </p>
                      <p className="text-xs">
                        Providers will appear here once they are provisioned on
                        the platform.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                providers.map((sp) => (
                  <TableRow className="hover:bg-muted/30" key={sp.id}>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <EntityAvatar name={sp.name} />
                        <span className="font-medium text-foreground">
                          {sp.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      {sp.slug}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sp.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
