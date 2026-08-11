import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/settings/users/$id/")({
  component: UserDetailsPage,
  loader: async ({ params }) => {
    try {
      return await orpc.users.get({ id: params.id });
    } catch (error) {
      console.error("Failed to load user", error);
      return null;
    }
  },
});

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  member: "Member",
  owner: "Owner",
};

function UserDetailsPage() {
  const user = Route.useLoaderData();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const handleRemove = useCallback(async () => {
    if (!user || !window.confirm(`Remove ${user.name} from this workspace?`)) {
      return;
    }

    setRemoveError(null);
    setIsRemoving(true);
    try {
      await orpc.users.remove({ id: user.id });
      await navigate({ to: "/settings/users" });
    } catch (error) {
      setRemoveError(
        error instanceof Error ? error.message : "Unable to remove user",
      );
      setIsRemoving(false);
    }
  }, [navigate, user]);

  if (!user) {
    return (
      <main className="bg-background p-4 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <PageHeader
            actions={
              <Button
                nativeButton={false}
                render={<Link to="/settings/users" />}
                variant="outline"
              >
                <ArrowLeft />
                Back to users
              </Button>
            }
            description="The user may have been removed or you may not have access to this workspace."
            title="User unavailable"
          />
          <Card>
            <CardContent className="py-16 text-center">
              <p className="font-medium text-foreground text-sm">
                We could not find this user
              </p>
              <p className="mt-2 text-muted-foreground text-xs">
                Return to the users list to see the current workspace members.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          actions={
            <div className="flex items-center gap-2">
              <Button
                nativeButton={false}
                render={
                  <Link
                    params={{ id: user.id }}
                    to="/settings/users/$id/edit"
                  />
                }
                variant="outline"
              >
                <Pencil />
                Edit user
              </Button>
            </div>
          }
          description="Workspace access, role, and account information."
          title={user.name}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Account details for this workspace member.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
              <UserAvatar name={user.name} />
              <div className="min-w-0 space-y-3">
                <div>
                  <p className="font-semibold text-base text-foreground">
                    {user.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 break-all text-muted-foreground text-sm">
                    <Mail className="size-3.5 shrink-0" />
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary text-xs">
                    <ShieldCheck className="size-3.5" />
                    {roleLabels[user.role] ?? user.role}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground text-xs">
                    Added {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle>Remove access</CardTitle>
              <CardDescription>
                This removes the user from this workspace. Their account is not
                deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {removeError ? (
                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-xs">
                  {removeError}
                </p>
              ) : null}
              <Button
                className="w-full"
                disabled={isRemoving}
                onClick={handleRemove}
                variant="destructive"
              >
                <Trash2 />
                {isRemoving ? "Removing..." : "Remove from workspace"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="grid gap-2 px-6 py-4 text-xs sm:grid-cols-[auto_1fr]">
            <span className="font-medium text-muted-foreground">User ID</span>
            <code className="break-all text-foreground">{user.userId}</code>
          </CardContent>
        </Card>
      </div>
    </main>
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
    <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-semibold text-primary text-xl">
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
