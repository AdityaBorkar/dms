import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tenant)/(app)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Dashboard</div>;
}
