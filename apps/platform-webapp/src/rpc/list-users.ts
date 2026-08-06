import { createServerFn } from "@tanstack/react-start";

export const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.users.list.run({}));
});
