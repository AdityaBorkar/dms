import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getSession = createServerFn().handler(async () => {
  const { p } = await import("@/aspen/server");
  const headers = getRequestHeaders();
  return p.run("$global", () => p.auth.service.api.getSession({ headers }));
});
