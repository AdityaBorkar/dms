import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tenant)/settings/branches")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(tenant)/settings/branches"!</div>;
}
