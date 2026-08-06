import { createServerFn } from "@tanstack/react-start";

export const listServiceProviders = createServerFn({ method: "GET" }).handler(
  async () => {
    const { p } = await import("@/aspen/server");
    return p.run("$global", () => p.management.serviceProviders.list.run({}));
  },
);
