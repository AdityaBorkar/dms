import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/pubsub-pipelines")({
  component: PubsubPipelines,
});

function PubsubPipelines() {
  return <TodoPage title="Pubsub Pipelines" />;
}
