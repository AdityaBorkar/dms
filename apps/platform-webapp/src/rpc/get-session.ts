import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

// import { p } from "@/aspen/server";

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const { p } = await import("@/aspen/server");
    const headers = getRequestHeaders();
    const session = await p.auth.api.getSession({ headers });
    return session;
  },
);
