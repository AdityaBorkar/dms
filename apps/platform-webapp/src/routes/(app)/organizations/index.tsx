import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EntityAvatar, StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/(app)/organizations/")({
  component: OrganizationsPage,
  loader: async () => {
    try {
      return await orpc.management.tenants.list();
    } catch (error) {
      console.error("Failed to load organizations", error);
      return null;
    }
  },
});

function OrganizationsPage() {
  const tenants = Route.useLoaderData();
  const count = tenants?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex items-center gap-2">
            <Button
              nativeButton={false}
              render={<Link to="/organizations/new" />}
              variant="default"
            >
              <Plus /> New organization
            </Button>
            <Building2 className="size-5 text-muted-foreground" />
          </div>
        }
        description="Organizations (tenants) hosted on the platform."
        title="Organizations"
      />
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>All organizations</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
              {count} {count === 1 ? "organization" : "organizations"}
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
                <TableHead>Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!tenants || tenants.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="py-12 text-center text-muted-foreground"
                    colSpan={4}
                  >
                    <div className="mx-auto max-w-xs space-y-1">
                      <p className="font-medium text-foreground">
                        No organizations
                      </p>
                      <p className="text-xs">
                        Organizations will appear here once they are hosted on
                        the platform.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((t) => (
                  <TableRow className="hover:bg-muted/30" key={t.id}>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <EntityAvatar name={t.name} />
                        <span className="font-medium text-foreground">
                          {t.name ?? "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      {t.slug}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell>
                      <span className="rounded-md bg-primary/5 px-2 py-0.5 font-medium text-primary text-xs">
                        {t.plan}
                      </span>
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
