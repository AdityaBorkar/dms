import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";

import { orpcRouter } from "@/orpc/router";

const handler = new RPCHandler(orpcRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          context: {
            headers: request.headers,
          },
        });

        return response ?? new Response("Not Found", { status: 404 });
      },
    },
  },
});
