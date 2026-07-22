# AGENTS.md

Bun workspace monorepo (`bun.lockb` binary lockfile — `bunfig.toml` sets `saveTextLockfile=false`). Install with `bun install` — not pnpm/npm. `bunfig.toml` sets `ignore-scripts=true` (lifecycle scripts skipped on install) and `minimumReleaseAge=259200` (3 days — freshly published packages are unavailable until 3 days old). The `pnpm.onlyBuiltDependencies` field in `apps/{tenant-webapp,platform-webapp,website}/package.json` is a scaffold leftover; ignore it.

## Commands

Root (run from repo root):

- `bun run check:lint` — Biome `check --fix` across the repo.
- `bun run check:types` — `tsc --noEmit` over the whole workspace (root `tsconfig.json` has no `include`, so it typechecks every `.ts`/`.tsx`).
- `bun run update:deps` — `taze -rw --maturity-period 3`.

Per-app script names differ across apps — **don't assume one name works in another**. Directory names ≠ package names: `tenant-webapp` is `@dms/webapp`, `platform-webapp` is `@dms/manage-webapp`.

| Task          | `platform-webapp`          | `tenant-webapp`                       | `website`            | `documentation`                |
| ------------- | -------------------------- | ------------------------------------- | -------------------- | ------------------------------ |
| Lint/format   | `check:lint` (`--fix .`)   | `lint` / `format` / `check` (split, no `--write`) | — (use root) | `lint` / `format` (`--write`)  |
| Typecheck     | `check:types`              | — (use root)                          | — (use root)         | `types:check` (codegen + tsc)  |
| Test          | `test` (vitest run)        | `test` (vitest run)                   | `test` (vitest run) | —                              |
| Route codegen | `gen:routes`               | `generate-routes`                     | `generate-routes`   | — (fumadocs-mdx, see below)    |
| Dev server    | `dev` (`--port 3000`)      | `dev` (`--port 3000`)                 | `dev` (`--port 3000`) | `dev` (port 3000 via `vite.config.ts`) |
| Deploy        | —                          | —                                     | `deploy` (build + `wrangler deploy`) | —                  |

Recommended order after edits: `check:lint` → `check:types` → `test`. No test files exist yet (vitest is wired but finds nothing). No CI is configured; no README.

## Layout

Apps (each is a TanStack Start app unless noted):

- `apps/tenant-webapp` (`@dms/webapp`) — public-facing app. (Was `apps/webapp`.)
- `apps/platform-webapp` (`@dms/manage-webapp`) — admin/management app. (Was `apps/manage-webapp`.)
- `apps/website` (`website`, unscoped) — marketing site; deployed to **Cloudflare** (`@cloudflare/vite-plugin` in `vite.config.ts`, `wrangler.jsonc`). No `.env` — uses Cloudflare bindings.
- `apps/documentation` (`documentation`, unscoped) — **Fumadocs MDX** docs app (TanStack Start + `fumadocs-mdx`) with AI chat (`@ai-sdk/react` + OpenRouter). Prerendered, nitro `vercel` preset. Needs `OPENROUTER_API_KEY`.
- `apps/infra` (`@dms/infra`) — empty placeholder (`package.json` has only `name`).

Packages:

- `packages/database` (`@dms/database`) — Drizzle + Postgres client; submodules `src/management/index.tsx`, `src/webapp/index.tsx`, `src/client.ts`. **All empty 0-byte placeholders**, including `drizzle.config.ts`. Intended stack (Drizzle + Postgres + Better Auth) is not wired up yet. (The `src/webapp/` dir name predates the `tenant-webapp` rename.) Only package under `packages/`.

Scripts: `scripts/seed/` has `index.ts`, `data/{aries,cpcb,mtdc}/`, `management/onboard.ts`, `organization/{nuke.ts,onboard.ts}` — all empty placeholders.

Docs: `docs/` has `adr/`, `plans/`, `sow/` (used by the `domain-modeling` and `grill-with-docs` skills). All empty placeholders.

Don't assume implementation exists in `packages/database`, `scripts/seed/*`, seed data, `apps/infra`, or `docs/*` — they're scaffolds.

## Routing codegen

`tenant-webapp`, `platform-webapp`, `website` use TanStack file-based routing (`tsr.config.json` in each). `src/routeTree.gen.ts` is **generated** by `tsr generate` (`gen:routes` / `generate-routes`). Never hand-edit it — it's gitignored (`*.gen.ts`) and regenerates when routes change. Edit files under `src/routes/` instead. (`.tanstack/` is also gitignored.)

`documentation` uses **Fumadocs MDX**, not TanStack Router codegen: content lives in `content/docs/*.mdx`; `fumadocs-mdx` codegens `.source/` (gitignored). It runs on `postinstall` and again inside `types:check` (`fumadocs-mdx && tsc --noEmit`).

## Path aliases

- `#/*` → `./src/*` (Node subpath `imports` in each app's `package.json` — canonical) and `@/*` → `./src/*` (tsconfig). Present in `tenant-webapp`, `platform-webapp`, `website`. Prefer `#/*`.
- `documentation` has **no `#/*`** — use `@/*` → `./src/*` and `collections/*` → `./.source/*` (the codegen output).

## TypeScript

- `verbatimModuleSyntax: true` — use `import type` for type-only imports. Set in root + `tenant-webapp`/`platform-webapp`/`website`; **not** in `documentation`.
- `noUncheckedIndexedAccess: true` is set **only at root**. Root `check:types` applies it everywhere, but per-app `check:types` / `types:check` use each app's standalone tsconfig, which does **not** set it (apps enable `noUnusedLocals` / `noUnusedParameters` instead).
- App `tsconfig.json` files are standalone; they do **not** extend the root.

## Env

Env lives in `.env.local` (gitignored via `*.local`), per app:

- `apps/tenant-webapp/.env.local`, `apps/platform-webapp/.env.local`: intended for `DATABASE_URL` (Postgres `localhost:5432/dms`, user `dms`), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=http://localhost:3000`. **No source consumes these yet** (database package is an empty placeholder).
- `apps/documentation/.env.local`: `OPENROUTER_API_KEY` (required, consumed in `src/routes/api.chat.ts`); `OPENROUTER_MODEL` optional (defaults to `anthropic/claude-3.5-sonnet`).
- `apps/website`: no `.env` — Cloudflare bindings via `wrangler.jsonc`.
- `apps/infra`: none.

## Biome

Root `biome.json` is the only Biome config (no nested configs). Key facts:

- `files.includes: ["**"]` with `vcs.useIgnoreFile: true` — lints everything **except** gitignored files. So `*.gen.ts` (routeTree.gen), `.tanstack/`, `.source/`, `node_modules/`, `*.local` are excluded via `.gitignore`, not via Biome excludes.
- **2-space indent, double quotes** (not tabs). `jsxQuoteStyle: "double"`, `arrowParentheses: "always"`.
- `useSortedClasses` (nursery, error, safe fix) auto-sorts Tailwind classes in `class`, `classList`, and `clsx`/`cva`/`tw*` calls — don't hand-order Tailwind classes.
- `organizeImports` assist is on, with import grouping (URL → node/bun/protocol packages → packages → aliases/paths).
- `linter.domains`: `react`, `tailwind`, `types` all enabled.

## Gotchas

- `bunfig.toml` `ignore-scripts=true` skips lifecycle scripts on `bun install` — including `documentation`'s `postinstall: fumadocs-mdx`. After install, run `bun run postinstall` (or `types:check`) in `apps/documentation` to generate `.source/`, or `bun run dev` will fail to resolve `collections/*`.
- Four dev servers (`platform-webapp`, `tenant-webapp`, `website`, `documentation`) all default to port 3000. Pass a different `--port` (e.g. `bun run dev --port 3001`) to run concurrently.
- Directory names ≠ package names (see Layout). `grep`/`glob` by directory; `import` by package name.
- `codedb.snapshot` at root is the codedb index — a tool artifact, not source.
