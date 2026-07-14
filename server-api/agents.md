# Technology
- Hono for API.
  - BetterAuth
- Drizzle ORM for PostgreSQL.
- Valibot at the boundaries like environment variables and request validation.

# Aliases
- `~/…` → this app's `src/` (tsconfig `paths`; Bun honours it). The `auth.ts` →
  `context/database.ts` → `env.ts` chain uses relative imports so the BetterAuth CLI can
  load it standalone.
- `#common/…`, `#database/…` → sibling packages as TypeScript source (Node subpath imports).

# Constraint
- We validate environmental variables with Valibot.
- Do not default to agent attribution when engaging on Git & GitHub, such as on commit
  messages and PRs.

# Directory Structure
- `.env` you must generate this as this is git-ignored
- `.env.tpl` env template for 1Password CLI tool `op`
- `.env.template` env template for Infisical CLI tool `infisical`
- 📁 `src`
  - `index.ts` Hono server entrypoint
  - `factory.ts` For making Hono instances with initial context and middleware
  - `auth.ts` BetterAuth config
  - `env.ts` Valibot-validated `process.env`
  - 📁 `context`
  - 📁 `route`

# Links
- [Hono documentation](https://hono.dev/llms.txt)
- [BetterAuth documentation](https://better-auth.com/llms.txt)
- [Valibot documentation](https://valibot.dev/llms.txt)
- [Drizzle ORM documentation](https://orm.drizzle.team/llms.txt)
