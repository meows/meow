# meow

Bun + Vite+ monorepo. See `docs/plan-project-scaffold.md` for architecture and decisions.

## Project Structure

- 📁 `common` — `@meow/common`: shared `lib` / `constant` / `validation` (Valibot), consumed as TS source
- 📁 `database` — `@meow/database`: Drizzle ORM + PostgreSQL; migrations, `createDb` factory
- 📁 `server-api` — `@meow/server-api`: Hono + better-auth (port `API_PORT`, default 3000)
- 📁 `web-app` — `@meow/web-app`: React SPA — TanStack Router, Tailwind v4, shadcn (Base UI); proxies `/api` → the API (dev ports come from Infisical `/network`)

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
bun run dev                      # server-api :3000 + web-app :4444 (interleaved logs)
```

> Prefer a native Postgres over a container? The generated `.env` files point at
> `postgres://meow:meow@localhost:5432/meow`; start Postgres yourself (e.g.
> `brew services start postgresql@18`) and skip `db:up`.

## Secrets (Infisical)

Secrets live in a self-hosted Infisical instance, **not** in tracked files. One project
(env `dev`), one folder per app, plus a shared `/network` folder for the dev network
topology (host + ports):

- `/database` — the six `PSQL_*` + `DATABASE_URL` (7)
- `/server-api` — `BETTER_AUTH_SECRET`, `DATABASE_URL` + the six `PSQL_*` (8)
- `/network` — shared dev topology: `HOST`, `GATEWAY_PORT` (Caddy), `WEB_PORT` (Vite), `API_PORT` (Hono) (4)

`bun run secret:pull` renders each consumer's committed `.env.template` — a small Go template
that ranges its Infisical folder(s) — into a gitignored `.env`
(`infisical export --template=.env.template > .env`). `database` ← `/database`; `server-api`
← `/server-api` + `/network`; `web-app` and `infra` (Caddy) ← `/network`. The template prints
each secret's Infisical **comment** as a `# ` line above it; plain `--format=dotenv` silently
drops comments, so the template is what carries them through. The per-package Valibot `env.ts`
still validates. Re-run `secret:pull` when secrets change.

The `/network` values are the single source of truth for dev ports/host: `server-api`
**derives** one canonical `SERVER_API_URL` (the public gateway origin) from them — used as
better-auth's `baseURL`, its `trustedOrigins`, and the OpenAPI doc's server — and binds
`API_PORT`; `web-app/vite.config.ts` reads them via `loadEnv`; and the Caddyfile substitutes
them via `{$VAR:default}`. Change a port in `/network`,
re-pull, and Vite + Caddy + the API all move together. Every consumer keeps a code-level
default matching the committed value, so a fresh checkout boots before the first `secret:pull`.

> Note: the DB creds (`PSQL_*`, `DATABASE_URL`) live in both folders — `/server-api` keeps its
> own copies so it needs only one folder. Simple, at the cost of updating creds in two places.
> (Alternative: store `/server-api`'s copies as `${dev.database.KEY}` references so there's one
> source of truth — Infisical resolves them on export.)

First-time setup (once, by an admin):

1. `bun run infisical:up`, open `http://localhost:8080`, create the admin account.
   Instance config lives in `infra/infisical/.env` (see `.env.example`).
2. `bunx infisical login --domain http://localhost:8080` (browser; token in OS keyring).
3. Create the project with a **`dev`** environment, add folders `/database`,
   `/server-api`, and `/network`, and put its **Project ID** into every `.infisical.json`
   file (`database`, `server-api`, `web-app`, `infra`).
4. Load the secrets into their folders:
   ```sh
   bunx infisical secrets set --env=dev --path=/database \
     PSQL_USER=meow PSQL_PASSWORD=meow PSQL_DB=meow PSQL_SCHEMA=meow \
     PSQL_HOSTNAME=localhost PSQL_PORT=5432 DATABASE_URL=postgres://meow:meow@localhost:5432/meow
   bunx infisical secrets set --env=dev --path=/server-api \
     BETTER_AUTH_SECRET=$(openssl rand -hex 32) \
     DATABASE_URL=postgres://meow:meow@localhost:5432/meow \
     PSQL_USER=meow PSQL_PASSWORD=meow PSQL_DB=meow PSQL_SCHEMA=meow PSQL_HOSTNAME=localhost PSQL_PORT=5432
   bunx infisical secrets set --env=dev --path=/network \
     HOST=meow.localhost GATEWAY_PORT=4443 WEB_PORT=4444 API_PORT=3000
   ```
5. `bun run secret:pull` to regenerate every `.env` (`database`, `server-api`, `web-app`,
   `infra`) from Infisical.

## HTTPS + nice hostnames (optional — Caddy)

Fronts the app at `https://meow.localhost:4443` — real HTTPS plus a clean name (add more
services by copying the site block in `infra/Caddyfile` with a new `*.localhost` name).
`*.localhost` resolves to loopback automatically, so there's no `/etc/hosts` to edit, and
Caddy runs on a high port so **no sudo** to start it.

The host + ports come from the `/network` Infisical folder: `secret:pull` renders `infra/.env`,
and `gateway:up` / `gateway:reload` source it before Caddy adapts the `{$VAR:default}`
placeholders in `infra/Caddyfile` (defaults match the committed dev values, so it works before
the first pull). Infisical's own `:8080` is **not** parameterized — it's the bootstrap the rest
is fetched from.

```sh
bun run gateway:up    # start Caddy on :4443 (rootless — no sudo)
sudo caddy trust      # one-time: add Caddy's local CA to your keychain (admin action)
```

Then `bun run dev` and open `https://meow.localhost:4443`.
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
