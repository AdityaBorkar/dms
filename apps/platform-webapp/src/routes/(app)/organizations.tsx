import { createFileRoute } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listTenants } from "@/rpc/list-tenants";

export const Route = createFileRoute("/(app)/organizations")({
  component: OrganizationsPage,
  loader: async () => {
    try {
      return await listTenants();
    } catch (error) {
      console.error("Failed to load organizations", error);
      return null;
    }
  },
});

function OrganizationsPage() {
  const tenants = Route.useLoaderData();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-2xl">Organizations</h2>
        <p className="text-muted-foreground text-sm">
          Organizations (tenants) hosted on the platform.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!tenants || tenants.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={4}
              >
                No organizations.
              </TableCell>
            </TableRow>
          ) : (
            tenants.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.slug}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{t.plan}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
