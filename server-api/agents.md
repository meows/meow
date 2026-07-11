# Technology

- Hono app, fetch-based: `src/index.ts` does `export default app`. Dev runs under `vp dev` via `@hono/vite-dev-server` (port 3000); production can run the same entry with `bun run src/index.ts`.
- Drizzle ORM against PostgreSQL via `@kit/database` (`createDb` factory; this app owns the singleton in `src/db.ts`).
- better-auth mounted at `/api/auth/*` in `src/app.ts`; config in `src/auth.ts`.
- Valibot everywhere: request validation with `@hono/valibot-validator`, env validation in `src/env.ts` (parses `process.env` at startup — reads `.env`, surfaced by `vite.config.ts` through `loadEnv`).

# Aliases

- `~/…` → this app's `src/` — but NOT in the `auth.ts` → `db.ts` → `env.ts` chain, which uses relative imports because the better-auth CLI loads those files outside Vite.
- `#common/…`, `#database/…` → sibling packages as TypeScript source (Node subpath imports).

# Constraint

- Keep the app fetch-based and env access injectable — the Cloudflare Workers door stays open.
- Read server env only through `src/env.ts` (`process.env`), never `import.meta.env`.
- Auth schema is generated, not hand-written. After changing better-auth config/plugins, regenerate from this directory:
  `bunx @better-auth/cli generate --config src/auth.ts --output ../database/src/schema/auth.ts`
  then `bun run db:generate` + `bun run db:migrate` in `database/`.

# Directory Structure

- `vite.config.ts` dev server plugin, port 3000, `~` alias, env surfacing
- `.env` / `.env.example` DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
- 📁 `src`
  - `index.ts` entry — `export default app`
  - `app.ts` Hono app: `/api/health`, auth mount, route composition
  - `auth.ts` better-auth config (drizzleAdapter, email+password)
  - `db.ts` db singleton from `createDb(env.DATABASE_URL)`
  - `env.ts` Valibot-validated `process.env`
  - 📁 `route` feature routes (Hono sub-apps), validated with `@hono/valibot-validator`

# Links

- [Hono documentation](https://hono.dev/llms.txt)
- [better-auth documentation](https://better-auth.com/llms.txt)
