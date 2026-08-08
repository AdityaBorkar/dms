import {
  createServiceProvider,
  listServiceProviders,
} from "./procedures/service-providers";
import { listTenants, onboardTenant } from "./procedures/tenants";
import { createUser, listUsers } from "./procedures/users";

export const router = {
  management: {
    serviceProviders: {
      create: createServiceProvider,
      list: listServiceProviders,
    },
    tenants: {
      list: listTenants,
      onboard: onboardTenant,
    },
    users: {
      create: createUser,
      list: listUsers,
    },
  },
};
