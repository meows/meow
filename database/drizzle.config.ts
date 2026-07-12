import { defineConfig } from "drizzle-kit"
import { env } from "./src/env"

export default defineConfig({
  dialect: "postgresql",
  // Point at the barrel, not the directory: under drizzle-kit v1 a directory
  // scan also loads index.ts's re-exports, double-counting every table and
  // suppressing output. The barrel re-exports all tables exactly once.
  schema: "./src/schema/index.ts",
  out: "./migrations",
  // Connect via the discrete PSQL_* vars (what database/.env actually provides and
  // what the runtime `Database` client uses) — there is no DATABASE_URL in env.
  dbCredentials: {
    host: env.PSQL_HOSTNAME,
    port: env.PSQL_PORT,
    user: env.PSQL_USER,
    password: env.PSQL_PASSWORD,
    database: env.PSQL_DB,
    ssl: false,
  },
})
