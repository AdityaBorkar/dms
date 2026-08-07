import { createFileRoute } from "@tanstack/react-router";

import { TodoPage } from "@/components/pages/todo";

export const Route = createFileRoute("/(app)/(debugging)/db")({
  component: DbCdc,
});

function DbCdc() {
  return <TodoPage title="DB CDC" />;
}
