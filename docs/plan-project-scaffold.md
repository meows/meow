# Project Scaffold Plan

## Goal

I've been sketching / scaffolding out the monorepo structure I'd like but I still need shortlists / options / advice on how to proceed with the things left undone. This doc records the Vite+ evaluation, the decisions made, and the remaining open choices.

## Vite+ evaluation — adopt it, all-in

[Vite+](https://viteplus.dev/guide/) is VoidZero's unified toolchain: one `vp` CLI wrapping Vite (dev/build), Vitest (test), Oxlint (lint), Oxfmt (format), Rolldown (bundler), tsdown (library packing), and a monorepo-aware task runner with caching. It also manages the runtime and package manager.

**Why the timing is right:**

- **Beta as of 2026-07-02** ([announcement](https://voidzero.dev/posts/announcing-vite-plus-beta)) — 12+ versions and 500+ PRs since alpha; 1,300+ public repos already depend on it (Dify, BlockNote, npmx).
- **Fully MIT-licensed.** The earlier source-available/paid-tier plan was dropped after [Cloudflare acquired VoidZero](https://voidzero.dev/posts/voidzero-cloudflare) (2026-06-04). Funding concern and license concern both resolved.
- **It fills every hole this scaffold has left open** with one config surface:

| Hole                               | Vite+ answer                                       | Would otherwise need      |
| ---------------------------------- | -------------------------------------------------- | ------------------------- |
| Monorepo task runner + caching     | `vp run` (cached by default, `dependsOn`, filters) | Turborepo / Nx            |
| Test runner                        | `vp test` (Vitest)                                 | Vitest config per package |
| Lint + format + typecheck          | `vp check` (Oxlint + Oxfmt + tsc)                  | Biome or ESLint+Prettier  |
| Library builds (if ever published) | `vp pack` (tsdown)                                 | tsup/tsdown setup         |
| Scaffolding new packages           | `vp create vite:library` etc.                      | hand-rolling              |

**Risk assessment:** the `vp` wrapper is two days into beta, but every layer under it (pnpm, Vite/rolldown-vite, Vitest, Oxlint, Oxfmt, tsdown) is stable, standalone, MIT tooling. Worst-case rollback: replace `vp run` with package scripts and lose only caching/task-graph. (Version policy: evergreen caret ranges — see Gotchas #1.)

Note: there is no `vp new` — scaffolding is **`vp create`** (templates: `vite:monorepo`, `vite:application`, `vite:library`, `vite:generator`); migration docs live at [/guide/migrate](https://viteplus.dev/guide/migrate).

## Decisions

1. **All-in on Vite+** — `vp` owns dev / build / test / lint / format / typecheck / task running / packing.
2. **Oxlint + Oxfmt** for lint/format. Drop Biome (`biome.json` references in `web-app/agents.md` should be removed).
3. **`common` is one workspace package `@kit/common`** with `lib/`, `constant/`, `validation/` folders under `src/` and a wildcard exports map — no build step; consumers import TypeScript source directly.
4. **pnpm workspaces**, hand-rolled scaffold (not `vp create vite:monorepo` — its `apps/`+`packages/` output would need renaming to fit our flat layout; optionally run it in a throwaway dir to crib the generated `vite.config.ts` shape).

## Architecture

### Workspaces & layout

- Vite+ does not ship a package manager; it detects one via the `packageManager` field (then `devEngines`, then lockfiles) and **falls back to pnpm** ([/guide/install](https://viteplus.dev/guide/install)). (Superseded: Bun chosen, detected via `bun.lock`; no `packageManager` pin per the evergreen policy — see Scaffold-day outcomes.)
- Keep the flat top-level layout (`web-app/`, `server-api/`, `common/`, `database/`). Nothing in Vite+ mandates `apps/`+`packages/` — `vp run` targets by path (`vp dev web-app`), pnpm-style `--filter`, or recursive `-r` in dependency order. Only cost: lint/fmt `overrides` globs name folders explicitly.
- `vp add --filter web-app react` / `vp install --filter <pattern>` scope installs to a package.

### Root `vite.config.ts` — shared checks + cached tasks

Vite+ uses the root config for shared lint/format settings and workspace task definitions ([/guide/monorepo](https://viteplus.dev/guide/monorepo), [/guide/run](https://viteplus.dev/guide/run)):

- `lint`/`fmt` defaults at root with `overrides: [{ files: ['web-app/**'], plugins: ['typescript', 'react'], ... }]`.
- `run.tasks`: `check`, `test`, `lint`, `fmt` — tasks defined here are **cached by default** (fingerprint = args + declared env vars + input files; `{ auto: true }` input tracking supported). Cache is local at `node_modules/.vite/task-cache`; clear with `vp cache clean`. Remote caching arrives at 1.0.
- A task name may come from `run.tasks` **or** a `package.json` script, not both. Side-effectful DB commands (`db:generate`, `db:migrate`, `db:studio`) therefore live as **scripts** in `database/package.json` — scripts are uncached by default, which is exactly right for commands that write migrations or mutate the DB. (`db:generate` could later be promoted to a cached task with `input: ['src/schema/**']`, `output: ['migrations/**']`; `db:migrate` must never be cached.)
- `dev`/`build` come from each app's own `vite.config.ts` via `vp dev` / `vp build`; run both dev servers with `vp run -r --parallel dev` (verify flag interplay when scaffolding).

### TypeScript — base config, source imports, no project references

- Root `tsconfig.base.json`: `strict`, `moduleResolution: "bundler"`, `noEmit`, and **`allowImportingTsExtensions: true`**. The last one is load-bearing: imports like `@kit/common/constant/specific-file.ts` end in `.ts`, which TypeScript rejects (TS5097) without it. It requires `noEmit` — fine, Vite/tsdown do all emitting.
- Each package's `tsconfig.json` extends the base. **No project references** — internal packages are consumed as source, there are no declaration builds, so `tsc -b` ceremony buys nothing.
- `@kit/common/package.json` exports map:
  ```json
  { "name": "@kit/common", "exports": { "./*": "./src/*" } }
  ```
  so `@kit/common/constant/specific-file.ts` → `common/src/constant/specific-file.ts`. Same pattern for `@kit/database`.

### Aliases — hybrid: `~` within an app, `#` between packages, `@` for components

| Sigil      | Means                                                   | Lives in                                      |
| ---------- | ------------------------------------------------------- | --------------------------------------------- |
| `~/…`      | this app's `src/`                                       | web-app, server-api only — never in libraries |
| `#<pkg>/…` | that package (identical spelling inside and outside it) | everywhere                                    |
| `@/…`      | web-app `src/component/`                                | web-app only                                  |
| `@kit/*`   | underlying exports plumbing                             | package.json maps; rarely in code             |

**`~` — app-internal.** `"~/*": ["./src/*"]` in tsconfig `paths` + a plain string `resolve.alias` in each app's `vite.config.ts`. A global string alias is safe here _only because_ libraries never use `~`: `common`/`database` are bundled as source by the apps, so a library-internal `~` would be captured by the consuming app's alias and resolve into the wrong `src/`. The scheme is self-enforcing as long as that rule holds.

**`#<pkg>` — package references,** via Node's native [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) (`imports` field). Consumers map the siblings they use to bare specifiers; each library also self-maps its own name:

```jsonc
// server-api/package.json (web-app declares the same two)
{ "imports": {
    "#common/*":   "@kit/common/*",     // chains through common's exports → ./src/*
    "#database/*": "@kit/database/*"
} }
// common/package.json — self-map, used for its own internal imports
{ "imports": { "#common/*": "./src/*" } }
// database/package.json
{ "imports": { "#database/*": "./src/*", "#common/*": "@kit/common/*" } }
```

```ts
// server-api/src/route/profile.ts
import { UserProfileSchema } from "#common/validation/user.ts" // between-package
import { schema } from "#database/schema/index.ts"
import { auth } from "~/auth.ts" // app-internal

// common/src/validation/user.ts
import { SLUG_MAX } from "#common/constant/limits.ts" // library-internal — NOT ~
```

The elegant property: `#common/validation/user.ts` means the same thing from any file in the repo, inside or outside `common`. Subpath imports are importer-scoped by spec, so Node, TypeScript (`moduleResolution: "bundler"`, TS ≥ 5.4), and Vite/rolldown resolve them with zero alias machinery — no resolver plugin, no `paths` entries for packages.

**`@` — web-app-only**, `@/*` → `./src/component/*` via tsconfig `paths` + string alias. Keeps shadcn CLI on conventional aliases. `components.json`: `"components": "@"`, `"ui": "@/ui"`, `"utils": "~/lib/utils"`.

**Notes:**

- `@kit/*` `exports` maps (`"./*": "./src/*"`) remain the plumbing that `#` targets chain through, and satisfy the original `@kit/common/constant/specific-file.ts` importability requirement — day-to-day code just spells it `#common/constant/specific-file.ts`.
- Each consumer maintains a small `imports` map for the siblings it uses; drift is loud (unmapped `#database/...` fails to resolve immediately).
- The `#common/* → @kit/common/* → ./src/*` double-wildcard chain is spec-legal; **smoke-test it under rolldown-vite on scaffold day** before building on it.
- Accepted asymmetry: "my own file" is `~/x` in an app but `#common/x` in a library — the price of no resolver plugin.
- `#`, `~`, `@/`, and `@kit/*` can't collide (`#` is invalid in package names; `~`/`@/` aren't valid package-name prefixes).
- Skip `vite-tsconfig-paths` — nothing needs it.

### server-api dev workflow

- **`@hono/vite-dev-server`** in `server-api/vite.config.ts`, entry `src/index.ts` — keeps the API under `vp dev` with reload via Vite's SSR module runner, and its runtime adapters (Node, Bun, Cloudflare) keep the Workers door open. Still the standard for Vite-centric Hono repos as of mid-2026. Escape hatch if it misbehaves under rolldown-vite: `tsx watch src/index.ts` (one script swap).
- Known wart: the plugin doesn't inherit Vite's env loading cleanly — read server env from `process.env` through a Valibot-validated `src/env.ts`, not `import.meta.env`.
- web-app dev server proxies `/api` → `http://localhost:3000` via `server.proxy`. Same-origin in dev means better-auth cookies work with zero CORS config; keep SPA and API same-origin in production too (or configure `trustedOrigins`).

### better-auth

- `server-api/src/auth.ts`: `betterAuth({ database: drizzleAdapter(db, { schema }), ... })`, mounted as
  `app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))`.
- Auth tables are **generated** into `database/src/schema/auth.ts`:
  ```sh
  pnpm dlx @better-auth/cli generate --config ../server-api/src/auth.ts --output ../database/src/schema/auth.ts
  ```
  Mild circularity (auth config imports `@kit/database`, generator writes into it) is benign because generation is a manual, occasional step — but record this regen command wherever auth plugins change.

### @kit/database

- Exports the Drizzle schema barrel (`src/schema/index.ts` re-exporting `auth.ts` + `app.ts`) and a `createDb(env)` client factory; consumed as source like `@kit/common`.
- `drizzle.config.ts`, `migrations/`, and the `drizzle-kit` devDependency all live in `database/` only.

### Valibot

- Shared schemas in `common/src/validation/`; Valibot is a dependency of `@kit/common` (declare it too in any app importing it directly).
- Hono routes validate with `@hono/valibot-validator`.
- Both apps validate env with Valibot: web-app against `import.meta.env` in `src/env.ts`, server-api against `process.env`.
- Don't wrap better-auth's own I/O in Valibot — it validates internally.

## Gotchas

1. **Evergreen versioning** (policy set 2026-07-05): caret ranges everywhere, no `packageManager` pin — `bun.lock` provides reproducibility; refresh with `bun update` / `vp upgrade` as routine maintenance. Watch 0.x minors (`vite-plus`, drizzle) — semver treats them as breaking.
2. **rolldown-vite + TanStack Router**: known degraded-HMR issue for files under the routes directory (`route/` here) ([TanStack/router #5100](https://github.com/TanStack/router/issues/5100)). Use **`@vitejs/plugin-react-oxc`**, not `@vitejs/plugin-react` (double-declare issue, [discussion #4436](https://github.com/TanStack/router/discussions/4436)), and don't add `unplugin-auto-import` ([#5653](https://github.com/TanStack/router/issues/5653)).
3. **Tailwind v4** via `@tailwindcss/vite` is fine on rolldown-vite; theme stays in `global.css`.
4. **shadcn + singular `component` folder**: `components.json` aliases are fully configurable and the CLI rewrites registry imports from them — but spot-check the first few `shadcn add` outputs for stray hardcoded `@/components` paths. Select the **Base UI** registry variant at `shadcn init`.
5. **Oxfmt is young**: expect occasional formatting churn across upgrades; commit fmt-only passes separately from logic changes.
6. **Task cache is local-only until 1.0**: in CI, `actions/cache` the `node_modules/.vite/task-cache` directory.
7. **`public/` location**: `web-app/agents.md` sketches `public/` under `src/` — Vite's default is project-root `public/`. Either move it to `web-app/public/` (recommended) or set `publicDir: 'src/public'`.

## Open holes — shortlists

**Deployment** (defer, but design for (a)):

- (a) **Cloudflare Workers** — strongest synergy (VoidZero is now Cloudflare; Hono dev-server has a CF adapter; static assets serve the SPA). Keep the Hono app fetch-based and env access injectable so this stays cheap.
- (b) Single Node box/container via `@hono/node-server` — simplest.
- (c) Split static CDN + Node API.

**DB engine** — ✅ DECIDED (2026-07-05): **(a) Postgres** (postgres.js driver, dialect `postgresql`, default casing with explicit column names, single Valibot-validated `DATABASE_URL`). Local dev: Homebrew Postgres or root `docker-compose.yaml` (postgres:18-alpine). Rejected: (b) SQLite/libsql, (c) D1.

**e2e testing**: Playwright, as a separate **uncached** root task run against `vp preview` + the API server — not under `vp test` (that's Vitest/unit).

**CI**: GitHub Actions — `vp install` (frozen lockfile) → `vp run -r check lint test build`, with `actions/cache` on the task-cache dir keyed on lockfile + source hash.

## Target file tree

```
/
├── package.json                  # private; workspaces; devDep: vite-plus (caret range)
├── pnpm-workspace.yaml           # packages: [common, database, server-api, web-app]
├── vite.config.ts                # lint/fmt defaults + overrides; run.tasks: check/test/lint/fmt
├── tsconfig.base.json            # strict, bundler resolution, noEmit, allowImportingTsExtensions
├── .gitignore
├── docs/
│   └── plan-project-scaffold.md
├── common/                       # @kit/common — exports "./*": "./src/*"
│   ├── package.json              # imports: "#common/*" → ./src/* (self-map; internal imports use #common, never ~)
│   ├── tsconfig.json
│   └── src/{lib,constant,validation}/
├── database/                     # @kit/database — scripts: db:generate / db:migrate / db:studio
│   ├── package.json              # imports: "#database/*" self-map + "#common/*" → @kit/common/*
│   ├── drizzle.config.ts
│   ├── tsconfig.json
│   ├── migrations/
│   └── src/
│       ├── schema/{auth.ts,app.ts,index.ts}
│       ├── client.ts             # createDb(env)
│       └── index.ts
├── server-api/                   # @kit/server-api
│   ├── package.json              # imports: "#common/*", "#database/*" → @kit/…
│   ├── vite.config.ts            # @hono/vite-dev-server, port 3000; ~ string alias → ./src
│   ├── tsconfig.json
│   └── src/{index.ts,app.ts,auth.ts,env.ts,route/}
└── web-app/                      # @kit/web-app
    ├── package.json              # imports: "#common/*" → @kit/common/*
    ├── vite.config.ts            # react-oxc, @tailwindcss/vite, tanstack router; ~ and @ string aliases; proxy /api→:3000
    ├── components.json           # shadcn aliases: components:"@", ui:"@/ui", utils:"~/lib/utils"
    ├── tsconfig.json
    ├── index.html
    ├── public/{pixel,sound}      # moved out of src/ (or set publicDir)
    └── src/
        ├── env.ts
        ├── global.css
        ├── component/{ui,shell,icon}
        ├── hook/
        ├── lib/utils.ts
        ├── route/{index.tsx,app/,auth/}   # singular; tanstackRouter({ routesDirectory: './src/route' })
        └── state/
```

## Next steps (scaffold order)

1. `git init`; root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, root `vite.config.ts`; `vp install`. As each package is added below: libraries get a `#<name>/*` self-map, apps get `~` (tsconfig paths + vite alias) plus `#` maps for the siblings they import. Smoke-test the `#common/* → @kit/common/* → ./src/*` chain under rolldown-vite as soon as `common` exists.
2. `common/` — package.json with wildcard exports, tsconfig, empty `lib`/`constant`/`validation` folders with a seed file each.
3. `database/` — pick DB engine (see shortlist), drizzle config, `createDb`, empty `app.ts` schema.
4. `server-api/` — Hono app + `@hono/vite-dev-server`, Valibot `env.ts`, better-auth config, then generate `schema/auth.ts` and run first `db:generate`/`db:migrate`.
5. `web-app/` — Vite config (react-oxc, Tailwind v4, TanStack Router plugin with `routesDirectory: './src/route'`, aliases, proxy), `shadcn init` with Base UI registry, TanStack Router file routes under `src/route/`.
6. Wire root tasks; verify `vp run -r check`, `vp run -r test`, both dev servers, and an end-to-end auth round-trip through the proxy.
7. Update `web-app/agents.md` (drop Biome, fix `public/` location, rename `routes` → `route`) and fill in `server-api/agents.md`.

## Scaffold-day outcomes (2026-07-05)

Executed on branch `scaffold`. Corrections and deltas discovered against this doc:

1. **Bun, not pnpm** (user preference): workspaces declared in root `package.json` (`"workspaces": [...]` — no `pnpm-workspace.yaml`), `bun.lock` committed. Vite+ detects Bun via the lockfile and `vp install` maps to Bun's install flags. No `packageManager` pin — evergreen policy.
2. **App vite configs import from `'vite-plus'`, not `'vite'`** — vite-plus bundles its own vite (no `vite` package is installed at root), and it re-exports `defineConfig`/`loadEnv`. Importing `'vite'` fails module resolution.
3. **`vp run -r --parallel dev` requires a `"dev": "vp dev"` script in each app's package.json** — confirmed working with that in place (the doc's "verify flag interplay" note was warranted).
4. **The `#common/* → @kit/common/* → ./src/*` double-wildcard chain works** under rolldown-vite (Vitest gate test in `database/src/client.test.ts`) and under the better-auth CLI's loader.
5. **better-auth CLI bootstrap**: the `auth.ts → db.ts → env.ts` chain uses _relative_ imports (not `~`) so the CLI can load it outside Vite; `createDb` is a pure lazy factory, so generation needs `.env` populated but no live DB.
6. **shadcn CLI v4** (2026): Base UI is selected via `style: "base-vega"` in `components.json` (base-\*/radix-\* style matrix; there is no separate init-time registry pick). Non-interactive path used: hand-written `components.json` → `yes | bunx shadcn init --base base --preset vega -f` (injects theme into `global.css`) → `bunx shadcn add button`. Singular `component/` folder and `@`/`~` aliases worked with zero stray-path fixes.
7. **Type-aware checking** (`lint.options.typeAware + typeCheck`) needs `vitest` as a devDep in packages with tests (`^4.1.9`, tracking vp's bundled major — bun's isolated layout doesn't hoist vite-plus's internals) and `types: ["node"]` wherever `process.env` is read.
8. **Generated files** (`routeTree.gen.ts`, `migrations/`) are excluded via `ignorePatterns` in both `lint` and `fmt` root config; `routeTree.gen.ts` is committed.
9. **"Remote caching at 1.0"** could not be verified in the Vite+ docs — treat as unconfirmed; the `actions/cache` CI fallback stands.
10. Verified end-to-end: `vp run -r check` (fmt+lint+typecheck, cache hit on rerun), `vp run -r test`, both dev servers under one `vp run -r --parallel dev`, and a full auth round-trip (sign-up → cookie → get-session) through the web-app proxy into Postgres.

## Links

- [Vite+ guide](https://viteplus.dev/guide/) · [run](https://viteplus.dev/guide/run) · [cache](https://viteplus.dev/guide/cache) · [monorepo](https://viteplus.dev/guide/monorepo) · [create](https://viteplus.dev/guide/create) · [migrate](https://viteplus.dev/guide/migrate)
- [Vite+ beta announcement](https://voidzero.dev/posts/announcing-vite-plus-beta) · [VoidZero joins Cloudflare](https://voidzero.dev/posts/voidzero-cloudflare)
- [@hono/vite-dev-server](https://github.com/honojs/vite-plugins/blob/main/packages/dev-server/README.md) · [Hono + better-auth example](https://hono.dev/examples/better-auth-on-cloudflare)
- [better-auth Drizzle adapter](https://better-auth.com/docs/adapters/drizzle) · [better-auth CLI](https://better-auth.com/docs/concepts/cli)
- [TanStack Router rolldown-vite notes: #5100](https://github.com/TanStack/router/issues/5100) · [#4436](https://github.com/TanStack/router/discussions/4436) · [#5653](https://github.com/TanStack/router/issues/5653)
