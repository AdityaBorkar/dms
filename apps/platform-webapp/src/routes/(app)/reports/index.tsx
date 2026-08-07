import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/reports/")({
  component: ReportsIndex,
});

function ReportsIndex() {
  return <TodoPage title="Reports" />;
}
