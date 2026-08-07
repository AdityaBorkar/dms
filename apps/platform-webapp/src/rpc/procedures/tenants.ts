import { authed } from "../middlewares/auth";

/** Lists all tenants. */
export const listTenants = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.tenants.list.run({}));
});
