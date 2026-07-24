import * as docker from "@pulumi/docker";

import { postgres } from "./docker/postgres";

const host = "unix:///var/run/docker.sock";
const provider = new docker.Provider("docker-provider", { host });

const network = new docker.Network("dms-network", {}, { provider });

const { container } = postgres({ network, provider });

// TODO: RUN DATABASE MIGRATIONS

export { container };
