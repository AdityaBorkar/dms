import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/db-cdc")({
  component: DbCdc,
});

function DbCdc() {
  return <TodoPage title="DB CDC" />;
}
