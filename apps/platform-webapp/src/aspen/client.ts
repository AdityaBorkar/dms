import type { LogConfig, RpcConfig } from "@aspen-os/framework/client";
import { Framework } from "@aspen-os/framework/client";

import { env } from "../env";
import { access_control, roles } from "./auth";

const auth = {
  access_control,
  baseURL: env.PUBLIC_APP_URL,
  roles,
};

const logs = {} satisfies LogConfig;
const rpc = {} satisfies RpcConfig;

export const f = Framework.create({ auth, logs, rpc }, {});
