import { createFileRoute } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listServiceProviders } from "@/rpc/list-service-providers";

export const Route = createFileRoute("/(app)/service-providers")({
  component: ServiceProvidersPage,
  loader: async () => {
    try {
      return await listServiceProviders();
    } catch (error) {
      console.error("Failed to load service providers", error);
      return null;
    }
  },
});

function ServiceProvidersPage() {
  const providers = Route.useLoaderData();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-2xl">Service Providers</h2>
        <p className="text-muted-foreground text-sm">
          Service providers provisioned on the platform.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!providers || providers.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={3}
              >
                No service providers.
              </TableCell>
            </TableRow>
          ) : (
            providers.map((sp) => (
              <TableRow key={sp.id}>
                <TableCell>{sp.name}</TableCell>
                <TableCell>{sp.slug}</TableCell>
                <TableCell>{sp.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
