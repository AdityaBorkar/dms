import { base } from "../middlewares/auth";

/**
 * Resolves the current session (or null when anonymous). Unlike `authed`
 * procedures, this does NOT reject unauthenticated requests — the login page
 * relies on it returning null to decide whether to redirect.
 */
export const getSession = base.handler(async ({ context }) => {
  // Dynamic import keeps the aspen server module (env, pg, platform wiring)
  // out of the browser bundle — it only exists server-side.
  const { p } = await import("@/aspen/server");
  return p.run("$global", () =>
    p.auth.service.api.getSession({ headers: context.headers }),
  );
});
