/* -----------------------------------------------------------------------------
 * ■ BetterAuth Hono middleware
 * Where core BetterAuth is configured.
 * -----------------------------------------------------------------------------
 * ■ Reference
 * - https://www.better-auth.com/docs/reference/options
 * - https://www.better-auth.com/docs/guides/optimizing-for-performance#bundle-size-optimization
 * -------------------------------------------------------------------------- */

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import * as schema from "#database/schema/index.ts"
import { psql } from "~/context/database.ts"
import { env } from "~/env.ts"

// —————————————————————————————————————————————————————————————————————————————
// BetterAuth

export const auth = betterAuth({
  baseURL: env.SERVER_API_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(psql.db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [env.SERVER_API_URL],
})
