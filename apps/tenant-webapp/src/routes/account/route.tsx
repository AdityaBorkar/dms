import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div>Hello "/account"!</div>
      <Outlet />
    </div>
  );
}
