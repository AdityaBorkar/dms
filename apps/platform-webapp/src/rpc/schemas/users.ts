import { nullable, object, optional, picklist, string } from "valibot";

import { NameSchema } from "./common";

const ROLE_VALUES = [
  "platform_admin",
  "sp_user",
  "tenant_admin",
  "tenant_user",
] as const;

export const CreatePlatformUserSchema = object({
  email: string(),
  name: NameSchema,
  password: string(),
  role: picklist(ROLE_VALUES),
  spId: optional(nullable(string())),
});
