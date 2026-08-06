import { configDotenv } from "dotenv";

configDotenv({ path: [".env.local"] });

import {
  cancel,
  intro,
  isCancel,
  outro,
  password as passwordPrompt,
  select,
  spinner,
  text,
} from "@clack/prompts";

import { p } from "../src/aspen/server";

function exitOnCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
  return value;
}

intro("Platform User Seed");

const name = exitOnCancel(
  await text({
    message: "Enter the user's full name",
    validate(value) {
      if (!value || value.trim().length === 0) return "Name is required.";
      if (value.length > 255) return "Name must be at most 255 characters.";
    },
  }),
);

const email = exitOnCancel(
  await text({
    message: "Enter the user's email address",
    validate(value) {
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Must be a valid email address.";
    },
  }),
);

const password = exitOnCancel(
  await passwordPrompt({
    mask: "*",
    message: "Set a password for the user",
    validate(value) {
      if (!value || value.length < 8)
        return "Password must be at least 8 characters.";
    },
  }),
);

const role = exitOnCancel(
  await select({
    message: "Select a role for the user",
    options: [
      { label: "Platform Admin", value: "platform_admin" },
      { label: "Tenant Admin", value: "tenant_admin" },
      { label: "Tenant User", value: "tenant_user" },
      { label: "Service Provider User", value: "sp_user" },
    ],
  }),
);

let spId: string | null = null;
if (role === "sp_user") {
  spId = exitOnCancel(
    await text({
      message: "Enter the Service Provider ID to assign this user to",
      validate(value) {
        if (!value || value.trim().length === 0)
          return "Service Provider ID is required for sp_user role.";
      },
    }),
  );
}

const s = spinner();
s.start("Creating platform user");

try {
  await p.run("$global", async () => {
    const result = await p.management.users.create.run({
      email,
      name,
      password,
      role,
      spId,
    });
    s.stop("Platform user created successfully");
    outro(`User "${result.email}" (${result.id}) created with role "${role}".`);
  });
} catch (error) {
  s.stop("Failed to create platform user");
  console.log(error);
  cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
} finally {
  await p.$cleanup();
}
