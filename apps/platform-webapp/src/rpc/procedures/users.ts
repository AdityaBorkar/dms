import { CreatePlatformUserSchema } from "@/schemas/users";
import { authed } from "../middlewares/auth";

export const listUsers = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.users.list.run({}));
});

export const createUser = authed
  .input(CreatePlatformUserSchema)
  .handler(async ({ input }) => {
    const { p } = await import("@/aspen/server");
    return p.run("$global", () => p.management.users.create.run(input));
  });
