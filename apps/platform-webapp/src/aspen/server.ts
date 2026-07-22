import type {
  AuthConfig,
  IsolatedTenantConfig,
} from "@aspen-os/framework/server";
import { IsolatedTenantPlatform } from "@aspen-os/framework/server";

import { env } from "../env";
import { access_control, roles } from "./auth";

const auth = {
  access_control,
  baseURL: env.BETTER_AUTH_URL,
  roles,
  secret: env.BETTER_AUTH_SECRET,
  session: { expiresIn: 60 * 60 * 24 * 7 },
} satisfies AuthConfig;

const kvStore = {} satisfies IsolatedTenantConfig["kvStore"];

const logs = {} satisfies IsolatedTenantConfig["log"];

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
    host: env.DATABASE_HOST,
    password: env.DATABASE_PASSWORD,
    port: Number(env.DATABASE_PORT),
    ssl: env.DATABASE_SSL,
    user: env.DATABASE_USER,
  },
  controlDbName: "control_plane",
  tenantDbPrefix: "tenant_",
} satisfies IsolatedTenantConfig["db"];

export const platform = IsolatedTenantPlatform.create(
  { auth, db, kvStore, logs, pubsub, rpc, storage },
  [organization, hr],
);

// platform.$prepare()

// platform.$initialize()
