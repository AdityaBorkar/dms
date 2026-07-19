# AGENTS.md

Bun workspace monorepo. Install with `bun install` (not pnpm/npm — the `pnpm.onlyBuiltDependencies` field in app `package.json` files is a scaffold leftover).

## Commands

Root scripts (run from repo root):

- `bun run check:lint` — Biome `check --fix` across the repo.
- `bun run check:types` — `tsc --noEmit` over the whole workspace (root `tsconfig.json` has no `include`, so it picks up every `.ts`/`.tsx`).
- `bun run update:deps` — `taze -rw --maturity-period 3` (only versions ≥3 months mature).

Per-app scripts live in each app's `package.json`. The two apps use **different script names for the same task** — don't assume one name works in both:

| Task        | `apps/management` | `apps/webapp`        |
| ----------- | ----------------- | -------------------- |
| Lint/format | `check:lint`      | `lint` / `format` / `check` (split) |
| Typecheck   | `check:types`     | — (use root)         |
| Test        | `test` (vitest run) | `test` (vitest run) |
| Route codegen | `gen:routes`    | `generate-routes`    |
| Dev server  | `dev`             | `dev`                |

Recommended order after edits: `check:lint` → `check:types` → `test`. No tests exist yet (vitest is wired but finds nothing).

## Layout

- `apps/webapp` (`@dms/webapp`) — public-facing TanStack Start app.
- `apps/management` (`@dms/management-webapp`) — admin/management TanStack Start app.
- `apps/infra` (`@dms/infra`) — empty placeholder.
- `packages/database` (`@dms/database`) — Drizzle + Postgres client; per-app submodules `src/management` and `src/webapp`.
- `scripts/seed/` — `index.ts`, `nuke.ts`, and `data/{aries,cpcb,mtdc}`.
- `docs/` — `CONTEXT.md`, `GLOSSARY.md`, `adr/`, `plans/`, `sow/` (for the `domain-modeling` and `grill-with-docs` skills).

**The `packages/database` source, `drizzle.config.ts`, `scripts/seed/*`, seed data, and all `docs/` files are currently empty (0-byte) placeholders.** Don't assume implementation exists — they're scaffolds.

## Routing codegen (TanStack Router)

Both apps use file-based routing. `src/routeTree.gen.ts` is **generated** by `tsr generate` (`gen:routes` / `generate-routes`). Never hand-edit it — Biome and the editor exclude it, and it regenerates when routes change. Add/edit files under `src/routes/` instead.

## Path aliases

`#/*` → `./src/*` (Node subpath `imports` in each app's `package.json` — canonical) and `@/*` → `./src/*` (tsconfig). Prefer `#/*`.

## TypeScript

- `verbatimModuleSyntax: true` — use `import type` for type-only imports.
- `noUncheckedIndexedAccess: true` (root) — indexed access returns `T | undefined`.
- App `tsconfig.json` files are standalone; they do **not** extend the root.

## Env & intended stack

Each app has a `.env` with `DATABASE_URL` (Postgres `localhost:5432/dms`, user `dms`), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=http://localhost:3000`. Drizzle + Postgres + Better Auth are the intended stack; no source consumes these env vars yet.

## Gotchas

- Both dev servers default to `--port 3000`; pass a different `--port` to run them at the same time.
- Biome config: tab indent, double quotes. `**/styles.css` and `**/routeTree.gen.ts` are excluded from lint/format.
- `codedb.snapshot` at root is the codedb index — a tool artifact, not source.
