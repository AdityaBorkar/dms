# Repository Guidelines

Monorepo for the DMS platform. Bun workspace (lockfile `bun.lockb` binary — `bunfig.toml` sets `saveTextLockfile=false`). Install with `bun install` — never pnpm/npm. `bunfig.toml` sets `ignore-scripts=true` (lifecycle scripts skipped on install); `minimumReleaseAge` and `publicHoistPattern` are commented out. The `pnpm.onlyBuiltDependencies` fields in app `package.json` files are scaffold leftovers; ignore them.

## Project Overview

Five apps, one of which is load-bearing (the admin console); the rest are scaffolds or light apps.

- `apps/platform-webapp` (`@dms/manage-webapp`) — **primary, most developed**. Admin/management console: Better Auth login, an oRPC type-safe API layer bridged to `@aspen-os` platform workflows, shadcn/ui + Tailwind v4 UI, sidebar layout. Three real data pages (users, service providers, organizations) plus six stub routes.
- `apps/tenant-webapp` (`@dms/webapp`) — public-facing app; still the TanStack Start base-template starter landing page (home + about).
- `apps/website` (`website`, unscoped) — marketing site; minimal homepage, deployed to **Cloudflare** (`@cloudflare/vite-plugin` + `wrangler.jsonc`), no `.env`.
- `apps/documentation` (`documentation`) — **Fumadocs MDX** docs app (TanStack Start + `fumadocs-mdx`) with AI chat (`@ai-sdk/react` + OpenRouter). Prerendered, nitro `vercel` preset. Requires `OPENROUTER_API_KEY`.
- `apps/infra` (`@dms/infra`) — **real** Pulumi (TypeScript): provisions a Postgres 18 docker container (`docker/postgres.ts`). Not a placeholder.

`packages/` holds only empty directories `packages/dms/` and `packages/rms/` (no code, no `package.json`). There is **no** `packages/database` and no shared database package anywhere — DB access goes through `@aspen-os` platform workflows instead.

## Architecture & Data Flow

All web apps are TanStack Start (file-based routing via `tsr.config.json`; `src/routeTree.gen.ts` is generated). The interesting flow is in `platform-webapp`, which bridges three layers:

```mermaid
flowchart LR
  B[Browser React UI] -->|createServerFn| SF[RPC server fns  src/rpc/*]
  B -->|isomorphic oRPC client| ORPC[oRPC layer  src/orpc/*]
  ORPC -->|direct router call server-side / HTTP /api/rpc client-side| ROUTER[orpcRouter]
  SF -->|p.run '$global'| ASPEN[@aspen-os platform  src/aspen/server.ts]
  ROUTER -->|authed middleware + p.run '$global'| ASPEN
  ASPEN -->|management workflows .run input| PG[(control_plane / tenant_* Postgres)]
  B -->|/api/auth via p.auth| AUTH[Better Auth fetchHandler]
```

- **Server functions** (`src/rpc/*.ts`): `createServerFn({method:"GET"})` handlers that dynamically `import("@/aspen/server")` and run a workflow, e.g. `p.run("$global", () => p.management.users.list.run({}))`.
- **oRPC layer** (`src/orpc/*`): the typed router is the single source of truth for client-callable procedures. `src/orpc/client.ts` uses `createIsomorphicFn()` — direct `createRouterClient` call server-side (no HTTP hop during SSR), `RPCLink` to `/api/rpc` in the browser. Procedures build on an `authed` middleware (see Conventions) and call the same `p.run("$global", ...)` workflows.
- **aspen platform** (`src/aspen/server.ts`): `IsolatedTenantPlatform.create(...)` wires env config (auth, db `control_plane`, s3 storage) with module instances (`ManagementPlane.create`, `Organization.create({country:"INDIA"})`) and exports `p`. **Workflow getters return objects exposing `.run(input)`**, not callable functions. `p.run(tenantId, fn)` provides the AsyncLocalStorage context (db/audit/pubsub); use `"$global"` for control-plane/management workflows. Client `p` (`src/aspen/client.ts`) only exposes auth/logs/rpc — module workflows are **not** reachable client-side; bridge them via `createServerFn` or oRPC.

Data pages query Postgres via aspen workflows. Without a live DB they render empty states.

## Key Directories

- `apps/platform-webapp/src/routes/` — file-based routes. `(app)/route.tsx` = authenticated layout (sidebar + header + `Outlet`). `(app)/{dashboard,users,service-providers,organizations}.tsx` real; six others (`auth-users`, `db-cdc`, `logger-logs`, `pubsub-pipelines`, `reports`, `storage-explorer`, `workflow-logs`) are stubs rendering `TodoPage`. `api/auth.$.ts` (Better Auth handler) and `api/rpc.$.ts` (oRPC HTTP endpoint).
- `apps/platform-webapp/src/{aspen,orpc,rpc}/` — platform wiring, oRPC router/procedures/middleware/client, `createServerFn` bridges. `src/env.ts` — zod-validated env (`@t3-oss/env-core`).
- `apps/platform-webapp/src/components/` — `app-sidebar.tsx`, `page-header.tsx`, `status-badge.tsx`, `pages/{todo,error,loading,unauthorized}.tsx`, shadcn `ui/*`.
- `apps/platform-webapp/src/styles.css` — Tailwind v4 `@theme` tokens (+ dark navy sidebar tokens), Zalando Sans Variable font import.
- `apps/documentation/content/docs/*.mdx` — Fumadocs source content. `src/routes/api.chat.ts` — OpenRouter streaming chat with flexsearch `search` tool. `src/lib/source.ts` — Fumadocs loader from `collections/*` codegen.
- `apps/infra/` — Pulumi: `index.ts` (docker provider + network + `Postgres()`), `docker/{postgres,utils}.ts`.
- `docs/` — `TODO.md` only; `adr/`, `plans/`, `sow/` are empty. `scripts/seed/` — all files are empty placeholders.

## Development Commands

Root (run from repo root):

- `bun run check:lint` — Biome `check --fix` for the whole repo.
- `bun run clean` — remove `node_modules`, `.output`, `.local`, `.tanstack`, `bun.lockb`.
- `bun run update:deps` — `taze -rw --maturity-period 0`.
- `bun run prepare` — husky install.

**There is no root `check:types` script and no root `tsconfig.json`** — typecheck per app below. Per-app script names differ by app and directory names ≠ package names (`tenant-webapp`=`@dms/webapp`, `platform-webapp`=`@dms/manage-webapp`).

|Task|`platform-webapp`|`tenant-webapp`|`website`|`documentation`|`infra`|
|---|---|---|---|---|---|
|Lint/format|`check:lint` (`biome check --fix .`)|`check:lint`|`check:lint`|`check:lint`|—|
|Typecheck|`check:types` (`tsc --noEmit`)|`check:types`|`check:types`|`check:types` (`fumadocs-mdx && tsc --noEmit`)|—|
|Route codegen|`gen:routes` (`tsr generate`)|`gen:routes`|`gen:routes`|— (fumadocs-mdx, see below)|—|
|Test|`test` (`vitest run`)|`test`|`test`|—|—|
|Dev server|`dev` (`vite dev --port 3000`)|`dev` (`vite dev --port 3000`)|`dev` (`vite dev --port 3000`)|`dev` (`vite dev`, port 3000 via vite.config)|—|
|Build|`build` (`vite build`)|`build`|`build`|`build`|`preview` (pulumi)|
|Deploy|—|—|`deploy` (`bun run build && wrangler deploy`)|—|`infra:up` / `infra:down` / `preview` (`pulumi … --stack`)|

`documentation` runs `fumadocs-mdx` on `postinstall`; with `ignore-scripts=true` that is skipped on install, so after install run `bun run postinstall` (or `check:types`) in `apps/documentation` to generate `.source/`, or `dev` fails to resolve `collections/*`.

All four dev servers default to port 3000 — pass a different `--port` (e.g. `bun run dev --port 3001`) to run concurrently.

## Code Conventions & Common Patterns

- **TypeScript:** `verbatimModuleSyntax: true` — use `import type` for type-only imports. Apps set `strict`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`, JSX `react-jsx`, `moduleResolution: bundler`, `target ES2022`, `noEmit`. `noUncheckedIndexedAccess` is set only in `tsconfig.base.json` (bare apps do **not** enable it). App `tsconfig.json` files are standalone — do **not** extend the (nonexistent) root.
- **Biome** (root `biome.json`, only config): 2-space indent, double quotes, `arrowParentheses: "always"`, `jsxQuoteStyle: "double"`, `lineWidth 80`. `organizeImports` assist on (groups: URL → node/bun/protocol → packages → aliases/paths). `useSortedClasses` (nursery, error, safe fix) auto-sorts Tailwind classes in `class`, `classList`, and `clsx`/`cva`/`tw*` calls — don't hand-order them. Lint domains `react`, `tailwind`, `types` all enabled. Gitignore-aware via `vcs.useIgnoreFile` — `*.gen.ts`, `.tanstack/`, `.source/`, `node_modules/`, `*.local` are excluded through `.gitignore`. Linting is disabled in `**/src/components/ui/**` and `apps/documentation/src/components/**` via `overrides`.
- **Routing:** kebab-case route files under `src/routes/`; route-path `(group)` for layout groups; `route.tsx` = layout with `Outlet`; `__root.tsx` = root shell; `api/name.$.ts` for API routes. Never hand-edit `routeTree.gen.ts` (generated, gitignored).
- **Auth (platform-webapp):** the only gate is the `getSession` `createServerFn`. `(app)/route.tsx` `beforeLoad` calls `getSession()` and `redirect`s to `/` when null; `index.tsx` (login) redirects authed users into the app. Sign-in is `p.auth.client.signIn.email`; sign-out `p.auth.client.signOut()`. `AUTH_MOCK` is declared in `src/env.ts` (`z.stringbool()`) but is **currently unused** — no mock-auth module exists; auth flows through real Better Auth.
- **oRPC procedures:** build on an `authed` base middleware = `base.use(async ({context,next}) => …)` that resolves the session via `p.auth.service.api.getSession({headers: context.headers})` and throws `new Error("Unauthorized")` when absent. Keep aspen/platform imports behind dynamic `import("@/aspen/server")` so server-only modules never enter the browser bundle.
- **Env:** `src/env.ts` uses `@t3-oss/env-core` `createEnv` with zod. Server vars (`DB_*`, `AUTH_SECRET`, `STORAGE_*`) validated with `z.string().min(1)`, ports `z.coerce.number()`, booleans `z.stringbool()`. Client vars use `PUBLIC_` prefix; set via `envPrefix: ["PUBLIC_"]` in `vite.config.ts`.
- **Styling / composition:** Tailwind v4 with CSS custom properties in `@theme`; shadcn/ui built on `@base-ui/react`'s `useRender`, so slot composition uses the `render={<Link … />}` prop — **not** radix-style `asChild` (unused, causes type errors). Example: `SidebarMenuButton render={<Link to={item.href} />}`.
- **Data fetching:** routes use `loader` + `Route.useLoaderData()`; loaders `try/catch` and return `null` on failure, and pages render empty-state tables ("No users", etc.). Workflow calls go through `p.run("$global", () => workflow.getter.list.run({}))`.
- **Error handling:** oRPC has an `onError` console.error interceptor (`api/rpc.$.ts`); the `authed` middleware throws on anonymous requests. Shell components (`pages/{error,loading,unauthorized}.tsx`) render failure states.

## Important Files

|Path|Purpose|
|---|---|
|`apps/platform-webapp/src/routes/(app)/route.tsx`|Authenticated layout + auth `beforeLoad` gate|
|`apps/platform-webapp/src/aspen/server.ts`|`IsolatedTenantPlatform` wiring, exports `p`|
|`apps/platform-webapp/src/orpc/{router,procedures,middleware,client,context}.ts`|Typed RPC API layer|
|`apps/platform-webapp/src/rpc/get-session.ts`|Auth gate server fn|
|`apps/platform-webapp/src/env.ts`|Zod-validated env schema|
|`apps/platform-webapp/src/components/app-sidebar.tsx`|Nav (render-prop polymorphism example)|
|`apps/platform-webapp/src/components/pages/todo.tsx`|Stub page used by 6 unimplemented routes|
|`apps/documentation/src/routes/api.chat.ts`|OpenRouter AI chat + flexsearch tool|
|`apps/documentation/source.config.ts`|Fumadocs `defineDocs` (dir `content/docs`)|
|`apps/infra/index.ts` / `apps/infra/docker/postgres.ts`|Pulumi Postgres provisioning|
|`biome.json`, `bunfig.toml`, `tsconfig.base.json`, `package.json`|Root tooling config|

## Runtime & Tooling Preferences

- **Runtime:** Bun (all dev/build/scripts run via `bun`). Package manager: bun.
- **TypeScript:** `~7.0.2` (`typescript` in root + apps).
- **Linter/formatter:** Biome `2.5.x` (root `bun run check:lint`).
- **Build tool:** Vite `8.2.1` + `@tanstack/react-start` + `nitro` (each app's `vite.config.ts`; `website` uses `@cloudflare/vite-plugin`).
- **CSS:** Tailwind v4 + shadcn/ui (`components.json`: style `base-mira`, baseColor `neutral`, icon lib `tabler`).
- **DB / backend:** Postgres via `@aspen-os` platform workflows (no raw drizzle/orm in-app code). **No CI is configured;** commit hooks are husky/lint-staged scaffolds (no active custom hooks) with `commitlint` (`@commitlint/config-conventional`, custom type-enum including `wip`).
- **Env files:** `.env.local` per app (gitignored via `*.local`). `platform-webapp` needs `DB_*`, `AUTH_SECRET`, `STORAGE_*`, `PUBLIC_WEB_*`; `documentation` needs `OPENROUTER_API_KEY` (+ optional `OPENROUTER_MODEL`, default `anthropic/claude-3.5-sonnet`); `tenant-webapp` `DATABASE_URL`/`BETTER_AUTH_*` intended but unconsumed. `website` and `infra` have no `.env`.

## Testing & QA

- **Framework:** Vitest `^4.1.10` wired as a devDependency of `platform-webapp`, `tenant-webapp`, `website` (with `@testing-library/react`, `@testing-library/dom`, `jsdom`). `documentation` and `infra` have no test setup.
- **Commands:** `bun run test` (i.e. `vitest run`) inside those three apps.
- **Current state (honest):** testing is wired but **finds nothing** — there are zero test files, no `vitest.config.ts`, no `test` block in any `vite.config.ts`, no setup file, and no coverage config anywhere. `package.json` `test` scripts would discover zero tests. No CI, no coverage expectations. `.gitignore` has leftover Playwright artifact entries (`test-results/`, `playwright-report/`, `blob-report/`) but Playwright is not configured.
