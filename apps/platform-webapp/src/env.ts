import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

declare const window: Window & typeof globalThis;

export const env = createEnv({
  client: {
    PUBLIC_APP_URL: z.string().min(1),
  },
  clientPrefix: "PUBLIC_",
  emptyStringAsUndefined: true,
  runtimeEnv: typeof window === "undefined" ? process.env : import.meta.env,
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_PORT: z.number().min(1),
    DATABASE_SSL: z.stringbool(),
    DATABASE_USER: z.string().min(1),
    STORAGE_ACCESS_KEY: z.string().min(1),
    STORAGE_BUCKET: z.string().min(1),
    STORAGE_ENDPOINT: z.string().min(1),
    STORAGE_FORCE_PATH_STYLE: z.stringbool(),
    STORAGE_REGION: z.string().min(1),
    STORAGE_SECRET_KEY: z.string().min(1),
  },
});
