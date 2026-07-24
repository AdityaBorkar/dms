import { ManagementPlane } from "@aspen-os/management-plane";
import { Organization } from "@aspen-os/organization";
import type { IsolatedTenantConfig } from "@aspen-os/platform/server";
import { IsolatedTenantPlatform } from "@aspen-os/platform/server";

import { env } from "../env";

// Common

const BASE_URL = `${env.PUBLIC_WEB_SSL ? "https" : "http"}://${env.PUBLIC_WEB_DOMAIN}:${env.PUBLIC_WEB_PORT}`;

// Units

const auth = {
  baseURL: BASE_URL,
  secret: env.AUTH_SECRET,
  session: { expiresIn: 60 * 60 * 24 * 7 },
} satisfies IsolatedTenantConfig["auth"];

const kvStore = {} satisfies IsolatedTenantConfig["kvStore"];

const logs = {} satisfies IsolatedTenantConfig["logs"];

const pubsub = {} satisfies IsolatedTenantConfig["pubsub"];

const rpc = {} satisfies IsolatedTenantConfig["rpc"];

const storage = {
  bucket: env.STORAGE_BUCKET,
  provider: {
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY,
      secretAccessKey: env.STORAGE_SECRET_KEY,
    },
    endpoint: env.STORAGE_ENDPOINT,
    forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
    region: env.STORAGE_REGION,
    type: "s3",
  },
} satisfies IsolatedTenantConfig["storage"];

const db = {
  connection: {
    host: env.DB_HOST,
    password: env.DB_PASSWORD,
    port: Number(env.DB_PORT),
    ssl: env.DB_SSL,
    user: env.DB_USER,
  },
  controlDbName: "control_plane",
  tenantDbPrefix: "tenant_",
} satisfies IsolatedTenantConfig["db"];

// Modules

const management_plane = ManagementPlane.create(undefined);

const organization = Organization.create({ country: "INDIA" });

// const hr = HumanResources.create();

// const inventory = Inventory.create({
//   service_name: "Pharmacy"
// });

// Platform

export const p = IsolatedTenantPlatform.create(
  { auth, db, kvStore, logs, pubsub, rpc, storage },
  [management_plane, organization],
);

// p.management_plane.
