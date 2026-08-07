import { getSession } from "./procedures/auth";
import { listServiceProviders } from "./procedures/service-providers";
import { listTenants } from "./procedures/tenants";
import { listUsers } from "./procedures/users";

export const router = {
  getSession,
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
