import { ProvisionTenantSchema } from "@/schemas/tenants";
import { authed } from "../middlewares/auth";

export const listTenants = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  const list = await p.run("$global", () => p.management.tenants.list.run({}));
  console.log({ list });
  return list;
});

export const onboardTenant = authed
  .input(ProvisionTenantSchema)
  .handler(async ({ context, input }) => {
    const { p } = await import("@/aspen/server");
    return p.run("$global", () =>
      p.management.tenants.onboard.run({
        tenant: input,
        userId: context.session.user.id,
      }),
    );
  });
