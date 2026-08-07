import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/storage-explorer")({
  component: StorageExplorer,
});

function StorageExplorer() {
  return <TodoPage title="Storage Explorer" />;
}
