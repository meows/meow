import { Database } from "#database/client.ts"
import { env } from "~/env.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Database client

/** The PSQL client for shared Hono context. */
export const psql = new Database("server-api", env.DATABASE_URL, { max: 10 })
