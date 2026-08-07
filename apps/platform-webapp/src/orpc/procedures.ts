import { base } from "./middleware";

/**
 * Authenticated base — resolves the session and rejects anonymous requests.
 * Build every protected procedure on this.
 */
const authed = base.use(async ({ context, next }) => {
  // Dynamic import keeps the aspen server module (env, pg, platform wiring)
  // out of the browser bundle — it only exists server-side.
  const { p } = await import("@/aspen/server");
  const session = await p.run("$global", () =>
    p.auth.service.api.getSession({ headers: context.headers }),
  );
  if (!session) {
    throw new Error("Unauthorized");
  }
  return next({ context: { ...context, session } });
});

/** Lists all platform users. */
export const listUsers = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.users.list.run({}));
});

/** Lists all tenants. */
export const listTenants = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.tenants.list.run({}));
});

/** Lists all service providers. */
export const listServiceProviders = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.serviceProviders.list.run({}));
});
