import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/user-groups")({
  component: UserGroupsPage,
});

function UserGroupsPage() {
  return <TodoPage title="User Groups" />;
}
