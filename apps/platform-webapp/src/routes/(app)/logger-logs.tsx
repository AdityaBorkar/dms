import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/todo-page";

export const Route = createFileRoute("/(app)/logger-logs")({
  component: LoggerLogs,
});

function LoggerLogs() {
  return <TodoPage title="Logger Logs" />;
}
