import { authed } from "../middlewares/auth";

/** Lists all service providers. */
export const listServiceProviders = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.serviceProviders.list.run({}));
});
