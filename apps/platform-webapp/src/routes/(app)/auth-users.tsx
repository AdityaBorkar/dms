import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/todo-page";

export const Route = createFileRoute("/(app)/auth-users")({
  component: AuthUsers,
});

function AuthUsers() {
  return <TodoPage title="Auth Users" />;
}
