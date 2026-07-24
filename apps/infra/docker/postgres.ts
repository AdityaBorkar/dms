import * as docker from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export function postgres({
  network,
  provider,
}: {
  network: docker.Network;
  provider: docker.Provider;
}) {
  const volume = new docker.Volume("postgres-data", {}, { provider });

  const image = new docker.RemoteImage(
    "postgres-image",
    {
      keepLocally: true,
      name: "postgres:18-alpine",
    },
    { provider },
  );

  const container = new docker.Container(
    "postgres-container",
    {
      envs: [
        pulumi.interpolate`POSTGRES_USER=${config.require("DB_USER")}`,
        pulumi.interpolate`POSTGRES_PASSWORD=${config.requireSecret("DB_PASSWORD")}`,
        pulumi.interpolate`POSTGRES_DB=dms`,
      ],
      image: image.name,
      networksAdvanced: [{ name: network.name }],
      ports: [
        {
          external: config.requireNumber("DB_PORT"),
          internal: 5432,
        },
      ],
      restart: "unless-stopped",
      volumes: [
        {
          containerPath: "/var/lib/postgresql/18/data",
          volumeName: volume.name,
        },
      ],
    },
    { provider },
  );

  return { container };
}
