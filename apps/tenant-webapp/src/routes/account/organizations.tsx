import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/account/workspaces"!</div>;
}
