# meow

Bun + Vite+ monorepo. See `docs/plan-project-scaffold.md` for architecture and decisions.

## Project Structure

- 📁 `common` — `@kit/common`: shared `lib` / `constant` / `validation` (Valibot), consumed as TS source
- 📁 `database` — `@kit/database`: Drizzle ORM + PostgreSQL; migrations, `createDb` factory
- 📁 `server-api` — `@kit/server-api`: Hono + better-auth (port 3000)
- 📁 `web-app` — `@kit/web-app`: React SPA — TanStack Router, Tailwind v4, shadcn (Base UI); proxies `/api` → 3000

## Quickstart

```sh
bun install                      # or: bunx vp install
cp database/.env.example database/.env
cp server-api/.env.example server-api/.env   # fill BETTER_AUTH_SECRET: openssl rand -hex 32
cd database
bun run db:up                    # Postgres 18 via docker compose (OrbStack/Docker), waits for healthy
bun run db:migrate               # apply migrations
cd ..
bunx vp run -r --parallel dev    # server-api :3000 + web-app :5173
```

> Prefer a native Postgres over a container? Point the two `.env` files at
> `postgres://<macos-user>@localhost:5432/meow` and skip `db:up` (see `database/.env.example`).

## Tasks

```sh
bunx vp run -r check   # oxfmt + oxlint + typecheck (cached)
bunx vp run -r test    # vitest
bunx vp check --fix    # auto-fix formatting
```
