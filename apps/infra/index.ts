import * as docker from "@pulumi/docker";

import { Postgres } from "./docker/postgres";

const host = "unix:///var/run/docker.sock";

const provider = new docker.Provider("docker-provider", { host });

const network = new docker.Network("docker-network", {}, { provider });

const postgres = Postgres({ network, provider });

export const postgres_server = postgres.server_url;

// TODO: RUN DATABASE MIGRATIONS
