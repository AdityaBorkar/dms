import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(tenant)/settings/general")({
  component: GeneralPage,
});

function GeneralPage() {
  return <TodoPage title="General" />;
}
