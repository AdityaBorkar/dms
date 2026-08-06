import { createFileRoute } from "@tanstack/react-router";

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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-2xl">Users</h2>
        <p className="text-muted-foreground text-sm">
          Platform users and their roles.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!users || users.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={3}
              >
                No users.
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
