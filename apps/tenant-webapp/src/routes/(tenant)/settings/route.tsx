import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tenant)/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(tenant)/settings"!</div>;
}
