import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/auth-users")({
  component: AuthUsers,
});

function AuthUsers() {
  return <TodoPage title="Auth Users" />;
}
