import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { type OrpcRouter, orpcRouter } from "./router";

const getOrpcClient = createIsomorphicFn()
  // Server-side: call the router directly, no HTTP hop. Keeps DB/tenant access
  // scoped to the request and avoids a network round trip during SSR.
  .server(() =>
    createRouterClient(orpcRouter, {
      context: async () => ({ headers: getRequestHeaders() }),
    }),
  )
  // Browser-side: reach the router through the `/api/rpc` HTTP endpoint.
  .client((): RouterClient<OrpcRouter> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export const orpc: RouterClient<OrpcRouter> = getOrpcClient();
