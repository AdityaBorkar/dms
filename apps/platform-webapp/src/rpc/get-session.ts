import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getMockSession, isAuthMock } from "@/aspen/mock-auth";

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    if (isAuthMock()) {
      return getMockSession();
    }

    const { p } = await import("@/aspen/server");
    const headers = getRequestHeaders();
    const session = await p.auth.service.api.getSession({ headers });
    return session;
  },
);
