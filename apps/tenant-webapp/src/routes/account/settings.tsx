import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>Profile</div>
      <div>Preferences</div>
      <div>Security</div>
      <div>Sessions</div>
    </div>
  );
}
