# AGENTS.md

Bun workspace monorepo (`bun.lock`, text format). Install with `bun install` — not pnpm/npm. The `pnpm.onlyBuiltDependencies` field in `apps/{manage-webapp,webapp,website}/package.json` is a scaffold leftover; ignore it.

## Commands

Root (run from repo root):

- `bun run check:lint` — Biome `check --fix` across the repo.
- `bun run check:types` — `tsc --noEmit` over the whole workspace (root `tsconfig.json` has no `include`, so it typechecks every `.ts`/`.tsx`).
- `bun run update:deps` — `taze -rw --maturity-period 3`.

Per-app script names differ across the 4 apps — **don't assume one name works in another**:

| Task          | `manage-webapp`          | `webapp`                 | `website`            | `documentation`                |
| ------------- | ------------------------ | ------------------------ | -------------------- | ------------------------------ |
| Lint/format   | `check:lint` (`--fix .`) | `lint` / `format` / `check` (split, no `--write`) | — (use root) | `lint` / `format` (`--write`)  |
| Typecheck     | `check:types`            | — (use root)             | — (use root)         | `types:check` (codegen + tsc)  |
| Test          | `test` (vitest run)      | `test` (vitest run)      | `test` (vitest run) | —                              |
| Route codegen | `gen:routes`             | `generate-routes`        | `generate-routes`   | — (fumadocs-mdx, see below)    |
| Dev server    | `dev` (`--port 3000`)    | `dev` (`--port 3000`)    | `dev` (`--port 3000`) | `dev` (port 3000 via `vite.config.ts`) |
| Deploy        | —                        | —                        | `deploy` (build + `wrangler deploy`) | —                  |

Recommended order after edits: `check:lint` → `check:types` → `test`. No test files exist yet (vitest is wired but finds nothing). No CI is configured.

## Layout

Apps (each is a TanStack Start app unless noted):

- `apps/webapp` (`@dms/webapp`) — public-facing app.
- `apps/manage-webapp` (`@dms/manage-webapp`) — admin/management app.
- `apps/website` (`website`, unscoped) — marketing site; deployed to **Cloudflare** (`@cloudflare/vite-plugin` in `vite.config.ts`, `wrangler.jsonc`). No `.env` — uses Cloudflare bindings.
- `apps/documentation` (`documentation`, unscoped) — **Fumadocs MDX** docs app with AI chat (`@ai-sdk/react` + OpenRouter). Prerendered, nitro `vercel` preset. Needs `OPENROUTER_API_KEY`.
- `apps/infra` (`@dms/infra`) — empty placeholder.

Packages:

- `packages/database` (`@dms/database`) — Drizzle + Postgres client; submodules `src/management/index.tsx`, `src/webapp/index.tsx`, `src/client.ts`. **All empty 0-byte placeholders**, including `drizzle.config.ts`. Intended stack (Drizzle + Postgres + Better Auth) is not wired up yet.
- `packages/customized-dms` — empty dir, no `package.json` yet.

Scripts: `scripts/seed/` has `index.ts`, `data/{aries,cpcb,mtdc}/`, `management/onboard.ts`, `organization/{nuke.ts,onboard.ts}` — all empty placeholders.

Docs: `docs/` has `CONTEXT.md`, `GLOSSARY.md`, `adr/`, `plans/`, `sow/` (used by the `domain-modeling` and `grill-with-docs` skills). All empty placeholders.

Don't assume implementation exists in `packages/database`, `scripts/seed/*`, seed data, or `docs/*` — they're scaffolds.

## Routing codegen

`webapp`, `manage-webapp`, `website` use TanStack file-based routing. `src/routeTree.gen.ts` is **generated** by `tsr generate` (`gen:routes` / `generate-routes`). Never hand-edit it — Biome excludes it and it regenerates when routes change. Edit files under `src/routes/` instead. (`.tanstack/` and `routeTree.gen.ts` are gitignored.)

`documentation` uses **Fumadocs MDX**, not TanStack Router codegen: content lives in `content/docs/*.mdx`; `fumadocs-mdx` codegens `.source/` (gitignored). It runs on `postinstall` and again inside `types:check` (`fumadocs-mdx && tsc --noEmit`).

## Path aliases

- `#/*` → `./src/*` (Node subpath `imports` in each app's `package.json` — canonical) and `@/*` → `./src/*` (tsconfig). Present in `webapp`, `manage-webapp`, `website`. Prefer `#/*`.
- `documentation` has **no `#/*`** — use `@/*` → `./src/*` and `collections/*` → `./source/*` (the codegen output).

## TypeScript

- `verbatimModuleSyntax: true` — use `import type` for type-only imports. Set in root + `webapp`/`manage-webapp`/`website`; **not** in `documentation`.
- `noUncheckedIndexedAccess: true` is set **only at root**. Root `check:types` applies it everywhere, but per-app `check:types` / `types:check` use each app's standalone tsconfig, which does **not** set it (apps enable `noUnusedLocals` / `noUnusedParameters` instead).
- App `tsconfig.json` files are standalone; they do **not** extend the root.

## Env

Env lives in `.env.local` (gitignored), per app:

- `apps/webapp/.env.local`, `apps/manage-webapp/.env.local`: `DATABASE_URL` (Postgres `localhost:5432/dms`, user `dms`), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=http://localhost:3000`. No source consumes these yet.
- `apps/documentation/.env.local`: `OPENROUTER_API_KEY` (used by the `api.chat` route).
- `apps/website`: no `.env` — Cloudflare bindings via `wrangler.jsonc`.
- `apps/infra`: none.

## Gotchas

- Four dev servers (`manage-webapp`, `webapp`, `website`, `documentation`) all default to port 3000. Pass a different `--port` to run concurrently — for `documentation`, port is hardcoded in `vite.config.ts` (`server.port: 3000`), not the CLI.
- Biome `includes` is `**/src/**/*`, `**/.vscode/**/*`, `**/index.html`, `**/vite.config.ts`. Files outside `src/` (e.g. `scripts/seed/**`, root `package.json`) are **not** linted. Excludes: `**/routeTree.gen.ts` and `**/src/styles.css`. Style: tab indent, double quotes.
- `codedb.snapshot` at root is the codedb index — a tool artifact, not source.
