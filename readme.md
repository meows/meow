# meow

Bun + Vite+ monorepo. See `docs/plan-project-scaffold.md` for architecture and decisions.

## Project Structure

- 📁 `common` — `@meow/common`: shared `lib` / `constant` / `validation` (Valibot), consumed as TS source
- 📁 `database` — `@meow/database`: Drizzle ORM + PostgreSQL; migrations, `createDb` factory
- 📁 `server-api` — `@meow/server-api`: Hono + better-auth (port 3000)
- 📁 `web-app` — `@meow/web-app`: React SPA — TanStack Router, Tailwind v4, shadcn (Base UI); proxies `/api` → 3000

## Quickstart

```sh
bun install                      # materializes the pinned infisical CLI (trustedDependencies)
bun run infisical:up             # start self-hosted Infisical → http://localhost:8080
bunx infisical login --domain http://localhost:8080   # one-time; token stored in OS keyring

# Ask an admin to add you to the `meow-platform` and `meow-server-api` projects (dev env).
# The .infisical.json files are committed, so you do NOT run `infisical init`.

bun run secret:pull             # writes database/.env + server-api/.env from Infisical
bun run db:up                    # Postgres 18 via docker compose (creds from database/.env)
bun run db:migrate               # apply migrations (runs in @meow/database)
bun run dev                      # server-api :3000 + web-app :5173 (interleaved logs)
```

> Prefer a native Postgres over a container? The generated `.env` files point at
> `postgres://meow:meow@localhost:5432/meow`; start Postgres yourself (e.g.
> `brew services start postgresql@18`) and skip `db:up`.

## Secrets (Infisical)

Secrets live in a self-hosted Infisical instance, **not** in tracked files. One project
(env `dev`), one folder per app — each folder self-contained (holds everything that app's
`env.ts` needs):

- `/database` — the six `PSQL_*` + `DATABASE_URL` (7)
- `/server-api` — `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL` + the six `PSQL_*` (9)

`bun run secret:pull` renders each package's committed `.env.template` — a small Go template
that ranges over its one folder — into the package's gitignored `.env`
(`infisical export --template=.env.template > .env`; `database` ← `/database`, `server-api` ←
`/server-api`). The template prints each secret's Infisical **comment** as a `# ` line above
it; plain `--format=dotenv` silently drops comments, so the template is what carries them
through. The per-package Valibot `env.ts` still validates. This replaces the old
`grep '^PSQL_' database/.env >> server-api/.env` step; re-run `secret:pull` when secrets change.

> Note: the DB creds (`PSQL_*`, `DATABASE_URL`) live in both folders — `/server-api` keeps its
> own copies so it needs only one folder. Simple, at the cost of updating creds in two places.
> (Alternative: store `/server-api`'s copies as `${dev.database.KEY}` references so there's one
> source of truth — Infisical resolves them on export.)

First-time setup (once, by an admin):

1. `bun run infisical:up`, open `http://localhost:8080`, create the admin account.
   Instance config lives in `infra/infisical/.env` (see `.env.example`).
2. `bunx infisical login --domain http://localhost:8080` (browser; token in OS keyring).
3. Create the project with a **`dev`** environment, add folders `/database` and
   `/server-api`, and put its **Project ID** into both `.infisical.json` files.
4. Load the secrets into their folders:
   ```sh
   bunx infisical secrets set --env=dev --path=/database \
     PSQL_USER=meow PSQL_PASSWORD=meow PSQL_DB=meow PSQL_SCHEMA=meow \
     PSQL_HOSTNAME=localhost PSQL_PORT=5432 DATABASE_URL=postgres://meow:meow@localhost:5432/meow
   bunx infisical secrets set --env=dev --path=/server-api \
     BETTER_AUTH_SECRET=$(openssl rand -hex 32) BETTER_AUTH_URL=http://localhost:3000 \
     DATABASE_URL=postgres://meow:meow@localhost:5432/meow \
     PSQL_USER=meow PSQL_PASSWORD=meow PSQL_DB=meow PSQL_SCHEMA=meow PSQL_HOSTNAME=localhost PSQL_PORT=5432
   ```
5. `bun run secret:pull` to regenerate `database/.env` + `server-api/.env` from Infisical.

## HTTPS + nice hostnames (optional — Caddy)

Fronts the app at `https://meow.localhost:8443` — real HTTPS plus a clean name (add more
services by copying the site block in `infra/Caddyfile` with a new `*.localhost` name).
`*.localhost` resolves to loopback automatically, so there's no `/etc/hosts` to edit, and
Caddy runs on a high port so **no sudo** to start it.

```sh
bun run gateway:up    # start Caddy on :8443 (rootless — no sudo)
sudo caddy trust      # one-time: add Caddy's local CA to your keychain (admin action)
```

Then `bun run dev` and open `https://meow.localhost:8443`.
`bun run gateway:down` / `bun run gateway:reload` manage the proxy — they talk to Caddy's
admin API on `localhost:2019`.

## Tasks

```sh
bun run dev            # both app dev servers (vp run -r --parallel dev)
bun run db:migrate     # + db:generate / db:reset / db:seed / db:studio
vp check               # oxfmt + oxlint + typecheck (cached) — or: vpr check
vp test                # vitest
vp check --fix         # auto-fix formatting
```
