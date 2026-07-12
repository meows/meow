# meow

Bun + Vite+ monorepo. See `docs/plan-project-scaffold.md` for architecture and decisions.

## Project Structure

- 📁 `common` — `@meow/common`: shared `lib` / `constant` / `validation` (Valibot), consumed as TS source
- 📁 `database` — `@meow/database`: Drizzle ORM + PostgreSQL; migrations, `createDb` factory
- 📁 `server-api` — `@meow/server-api`: Hono + better-auth (port 3000)
- 📁 `web-app` — `@meow/web-app`: React SPA — TanStack Router, Tailwind v4, shadcn (Base UI); proxies `/api` → 3000

## Quickstart

```sh
bun install                      # or: bunx vp install
cp database/.env.example database/.env
cp server-api/.env.example server-api/.env   # fill BETTER_AUTH_SECRET: openssl rand -hex 32
grep '^PSQL_' database/.env >> server-api/.env   # server-api validates PSQL_* at boot

cd database && bun run db:up && cd ..   # Postgres 18 via docker compose, waits for healthy
bun run db:migrate               # apply migrations (runs in @meow/database)
bun run dev                      # server-api :3000 + web-app :5173 (interleaved logs)
```

> Prefer a native Postgres over a container? Point the two `.env` files at
> `postgres://<macos-user>@localhost:5432/meow`, start it yourself (e.g.
> `brew services start postgresql@18`), and skip `db:up`.

## HTTPS + a stable hostname (optional — Caddy)

For real local HTTPS and a name other devices on the LAN can reach (`https://meow.local`):

```sh
sudo scutil --set LocalHostName meow    # → meow.local via mDNS (one-time)
bun run gateway:up                      # start the HTTPS gateway (runs `sudo caddy` — macOS needs root for :443)
sudo caddy trust                        # trust the running gateway's CA in your keychain (one-time; needs the gateway up)
```

Then `bun run dev` and open `https://meow.local` (or `https://meow.localhost`).
`bun run gateway:down` / `bun run gateway:reload` manage the proxy without bouncing the apps — no
sudo needed, they just talk to the running gateway's admin API on `localhost:2019`.

## Tasks

```sh
bun run dev            # both app dev servers (vp run -r --parallel dev)
bun run db:migrate     # + db:generate / db:reset / db:seed / db:studio
vp check               # oxfmt + oxlint + typecheck (cached) — or: vpr check
vp test                # vitest
vp check --fix         # auto-fix formatting
```
