import { listServiceProviders, listTenants, listUsers } from "./procedures";

/**
 * The oRPC router — the single source of truth for every procedure the client
 * can call. Keys become procedure paths on the wire.
 */
export const orpcRouter = {
  management: {
    serviceProviders: {
      list: listServiceProviders,
    },
    tenants: {
      list: listTenants,
    },
    users: {
      list: listUsers,
    },
  },
};

export type OrpcRouter = typeof orpcRouter;
