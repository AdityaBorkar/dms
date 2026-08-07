import { authed } from "../middlewares/auth";

/** Lists all platform users. */
export const listUsers = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.users.list.run({}));
});
