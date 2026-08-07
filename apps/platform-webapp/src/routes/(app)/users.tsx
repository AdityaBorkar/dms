import { createFileRoute } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";

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
import { listUsers } from "@/rpc/list-users";

export const Route = createFileRoute("/(app)/users")({
  component: UsersPage,
  loader: async () => {
    try {
      return await listUsers();
    } catch (error) {
      console.error("Failed to load users", error);
      return null;
    }
  },
});

function UsersPage() {
  const users = Route.useLoaderData();
  const count = users?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<UsersRound className="size-5 text-muted-foreground" />}
        description="Platform users and their roles."
        title="Users"
      />
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>All users</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
              {count} {count === 1 ? "user" : "users"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="px-4">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!users || users.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="py-12 text-center text-muted-foreground"
                    colSpan={3}
                  >
                    <div className="mx-auto max-w-xs space-y-1">
                      <p className="font-medium text-foreground">No users</p>
                      <p className="text-xs">
                        Users will appear here once they are provisioned on the
                        platform.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow className="hover:bg-muted/30" key={u.id}>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <EntityAvatar name={u.name ?? u.email ?? "?"} />
                        <span className="font-medium text-foreground">
                          {u.name ?? "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.role} />
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
