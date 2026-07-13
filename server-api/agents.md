# Technology

- Hono app on Bun: `src/index.ts` serves with `Bun.serve({ port: 3000, fetch: app.fetch })`. Dev runs `bun --watch src/index.ts` — native TS, native `.env` loading, fast reload, no Vite for the API. Production runs the same entry (`bun src/index.ts`).
- Drizzle ORM against PostgreSQL via `@meow/database` (`Database` class; the connection singleton is `psql` in `src/context/database.ts`).
- Hono context is built by `src/factory.ts` (`createFactory` — injects `db`, `user`, `session`); routes are `factory.createApp()` sub-apps.
- better-auth mounted at `/api/auth/*` in `src/index.ts`; config in `src/auth.ts`.
- Valibot everywhere: request validation with `@hono/valibot-validator`, env validation in `src/env.ts` (parses `process.env` at startup; Bun auto-loads `.env`).

# Aliases

- `~/…` → this app's `src/` (tsconfig `paths`; Bun honours it). The `auth.ts` → `context/database.ts` → `env.ts` chain uses relative imports so the better-auth CLI can load it standalone.
- `#common/…`, `#database/…` → sibling packages as TypeScript source (Node subpath imports).

# Constraint

- The Hono app stays fetch-based (`app.fetch`), so the handler is portable even though the `Bun.serve` entry is Bun-specific.
- Read server env only through `src/env.ts` (`process.env`), never `import.meta.env`.
- Auth schema is generated, not hand-written. After changing better-auth config/plugins, regenerate from this directory:
  `bunx @better-auth/cli generate --config src/auth.ts --output ../database/src/schema/auth.ts`
  then `bun run db:generate` + `bun run db:migrate` in `database/`.

# Directory Structure

- `.env` / `.env.example` — `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, plus `PSQL_*` (the `@meow/database` client reads `PSQL_*` at import; keep them in sync with `database/.env`)
- 📁 `src`
  - `index.ts` entry — builds the Hono app and serves it with `Bun.serve` (:3000)
  - `factory.ts` Hono `createFactory` (db / user / session context)
  - `auth.ts` better-auth config (drizzleAdapter, email+password)
  - `env.ts` Valibot-validated `process.env`
  - 📁 `context` — `database.ts`, the `psql` Database singleton
  - 📁 `route` feature routes (Hono sub-apps), validated with `@hono/valibot-validator`

# Links

- [Hono documentation](https://hono.dev/llms.txt)
- [better-auth documentation](https://better-auth.com/llms.txt)
