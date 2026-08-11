import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/users")({
  component: SettingsUsersPage,
});

function SettingsUsersPage() {
  return <TodoPage title="Users" />;
}
