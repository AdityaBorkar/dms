import { os } from "@orpc/server";

import type { RpcContext } from "../context";

/**
 * Base builder with RpcContext bound. Handlers built on this receive
 * `{ headers }` from the HTTP layer.
 */
export const base = os.$context<RpcContext>();

/**
 * Resolves the authenticated user for a request, or null when there is no
 * valid session.
 */
/**
 * Authenticated base — resolves the session and rejects anonymous requests.
 * Build every protected procedure on this.
 */
export const authed = base.use(async ({ context, next }) => {
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

/**
 * Resolves the authenticated user for a request, or null when there is no
 * valid session.
 */
export async function resolveUser(headers: Headers) {
  // Dynamic import keeps the aspen server module (env, pg, platform wiring)
  // out of the browser bundle — it only exists server-side.
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.auth.service.api.getSession({ headers }));
}
