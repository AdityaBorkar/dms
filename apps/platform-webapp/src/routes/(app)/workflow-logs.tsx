import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/workflow-logs")({
  component: WorkflowLogs,
});

function WorkflowLogs() {
  return <TodoPage title="Workflow Logs" />;
}
