# DMS Repository Guide

## Layout

- This is a Bun workspace (`apps/*`, `packages/*`); use `bun`, not npm or pnpm. Workspace manifests declare `pnpm.onlyBuiltDependencies`, ignored by Bun. `packages/` is empty; the workspace is effectively just the five apps. The web apps are TanStack Start applications; `apps/infra` is Pulumi TypeScript.
- `apps/platform-webapp` (`@dms/manage-webapp`) is the authenticated platform/admin console. `apps/tenant-webapp` (`@dms/webapp`) is the tenant-facing application with subdomain-aware organization routing.
- `apps/website` is the Cloudflare-deployed marketing app. `apps/documentation` is the Fumadocs MDX app. Documentation source is under `apps/documentation/content/docs`.
- There is no in-repo database package or raw ORM layer. Database access is through the linked `@aspen-os` platform modules and their workflows.

## Setup And Commands

- Run `bun install` from the repository root. `bunfig.toml` sets `ignore-scripts=true`, so documentation codegen is not run by install; run `cd apps/documentation && bun run postinstall` before its dev server if `.source/` is missing.
- `scripts/seed/**` files are empty placeholders (tracked but unfilled), not a functional seeding path.
- `bun run check:types` uses `tsc --noEmit`; it is typecheck-only, does not build.
- The root has only `bun run check:lint` (`biome check --fix`); there is no root typecheck, test, or build command. Run scripts from the relevant app directory.
- Platform: `bun run dev` (port 4010), `bun run gen:routes`, `bun run check:lint`, `bun run check:types`, `bun run test`, `bun run build`.
- Tenant: `bun run dev` (port 4020), `bun run gen:routes`, `bun run check:lint`, `bun run check:types`, `bun run test`, `bun run build`.
- Website: `bun run dev` (port 3000), `bun run gen:routes`, `bun run check:lint`, `bun run check:types`, `bun run test`, `bun run build`; `bun run deploy` builds and runs `wrangler deploy`.
- Documentation: `bun run dev` (port 3000), `bun run check:lint`, `bun run check:types` (also runs `fumadocs-mdx`), `bun run build`.
- Infra, from `apps/infra`: `bun run preview`, `bun run infra:up`, and `bun run infra:down`. These invoke Pulumi with `--stack`, use the Docker provider/socket, and require the stack's database config. Treat `infra:down` as destructive.
- The three web apps have Vitest scripts, but there are currently no test files or Vitest configuration; expect `bun run test` to find nothing.

## Generated Files And Formatting

- Route files live under each app's `src/routes/`; route trees are generated. After adding or renaming routes, run `bun run gen:routes` and never hand-edit `src/routeTree.gen.ts`.
- Fumadocs generates `apps/documentation/.source/` from `content/docs`; do not edit generated files. Both route trees and `.source/` are gitignored.
- Biome is the only repository formatter/linter. It uses 2-space indentation, double quotes, 80-column lines, organized imports, and Tailwind class sorting. `check:lint` can modify files.
- TypeScript uses strict checking and `verbatimModuleSyntax`; use `import type` for type-only imports. App `tsconfig.json` files are standalone; do not assume a root `tsconfig.json` exists.
- The UI uses `@base-ui/react` composition. Use its `render={<Component />}` prop for polymorphism; do not introduce Radix-style `asChild`.

## Runtime Architecture

- `src/aspen/server.ts` creates the server-side `IsolatedTenantPlatform` with Better Auth, Postgres (`control_plane` plus `tenant_` databases), storage, and management/organization modules. `src/aspen/client.ts` exposes only client-safe platform services.
- `src/rpc/router.ts` is the client API. `src/lib/orpc.ts` calls the router directly during SSR and uses `/api/rpc` in the browser; the route handler is `src/routes/api/rpc.$.ts`.
- Protected oRPC procedures build on `src/rpc/middlewares/auth.ts`, which resolves the Better Auth session from request headers. Keep server-only Aspen imports dynamic (`await import("@/aspen/server")`) in RPC code that can be bundled for the browser.
- Management workflow calls must run in the platform context, normally `p.run("$global", () => p.management.<area>.<workflow>.run(input))`. Workflow getters expose `.run(input)`; they are not callable functions. Do not bypass this with direct database access.
- Platform authentication is enforced by the `(app)` route's `beforeLoad`; tenant authentication and organization selection are handled by the `(tenant)` and `account` route groups. Auth API requests go through `src/routes/api/auth.$.ts`.

## Environment And Operations

- `apps/platform-webapp` and `apps/tenant-webapp` validate `PUBLIC_WEB_*`, `AUTH_SECRET`, `DB_*`, and `STORAGE_*` variables in `src/env.ts`. Use per-app `.env.local` files; `.env*` and `*.local` are ignored. Vite only exposes variables with the `PUBLIC_` prefix.
- Documentation chat requires `OPENROUTER_API_KEY`; `OPENROUTER_MODEL` is optional and has a code-level default in `src/routes/api.chat.ts`.
- `apps/infra` provisions a Postgres 18 Alpine Docker container and reads `DB_PORT`, `DB_USER`, and `DB_PASSWORD` from Pulumi config. It does not run database migrations; `apps/infra/index.ts` still marks migrations as TODO.
- There is no CI workflow or active custom Husky hook. Commit message types are constrained by `.commitlintrc.json` (`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `test`, `wip`).
