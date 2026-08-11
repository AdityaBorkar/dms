import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(tenant)/settings/")({
  beforeLoad: () => {
    throw redirect({ to: "/settings/general" });
  },
});
