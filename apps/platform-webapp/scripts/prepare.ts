import { configDotenv } from "dotenv";

import { p } from "../src/aspen/server";

// TODO: CREATE `control_plane` using Database
// import { $ } from "bun";
// $`docker exec 1856cbc12775a91438b0c75216181d6c0230ec6b26941d2d6ab4cea7e80a6028 psql -U dms -c "CREATE DATABASE control_plane;"`;
// There must be two users: `infra` and `platform`

configDotenv({ path: [".env.local"] });

await p
  .$prepareInfra()
  .then(() => {
    console.log("Infra prepared successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

await p
  .healthCheck()
  .then((result) => {
    console.log("HEALTHY", result);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
