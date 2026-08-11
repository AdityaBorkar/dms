import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, UserPlus, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/settings/users/")({
  component: UsersPage,
  loader: async () => {
    try {
      return await orpc.users.list();
    } catch (error) {
      console.error("Failed to load users", error);
      return null;
    }
  },
});

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  member: "Member",
  owner: "Owner",
};

function UsersPage() {
  const users = Route.useLoaderData();
  const count = users?.length ?? 0;

  return (
    <main className="bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          actions={
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-muted-foreground text-xs sm:flex">
                <UsersRound className="size-4" />
                {count} {count === 1 ? "user" : "users"}
              </span>
              <Button
                nativeButton={false}
                render={<Link to="/settings/users/new" />}
              >
                <Plus />
                Add user
              </Button>
            </div>
          }
          description="Manage the people who can access this workspace."
          title="Users"
        />

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Workspace users</CardTitle>
                <p className="mt-1 text-muted-foreground text-xs">
                  Roles and access are provisioned through Aspen.
                </p>
              </div>
              <UserPlus className="size-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {users === null ? (
              <EmptyState
                description="We could not load users from Aspen. Try refreshing the page."
                title="Users are unavailable"
              />
            ) : users.length === 0 ? (
              <EmptyState
                description="Users will appear here when they are provisioned for this workspace."
                title="No users yet"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-sm">
                  <thead className="bg-muted/40 text-left text-muted-foreground text-xs">
                    <tr>
                      <th className="px-5 py-3 font-medium">User</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Added</th>
                      <th className="px-5 py-3 text-right font-medium" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr
                        className="transition-colors hover:bg-muted/25"
                        key={user.id}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.name ?? user.email ?? "?"} />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {user.name ?? "Unnamed user"}
                              </p>
                              <p className="truncate text-muted-foreground text-xs">
                                {user.email ?? "No email"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary text-xs">
                            {roleLabels[user.role ?? ""] ??
                              user.role ??
                              "Unassigned"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground text-xs">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            className="font-medium text-primary text-xs hover:underline"
                            params={{ id: user.id }}
                            to="/settings/users/$id"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function EmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-medium text-foreground text-sm">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-muted-foreground text-xs">
        {description}
      </p>
    </div>
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary text-xs">
      {initials || "?"}
    </span>
  );
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
