import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/(debugging)/pubsub")({
  component: PubsubPipelines,
});

function PubsubPipelines() {
  return <TodoPage title="Pubsub Pipelines" />;
}
