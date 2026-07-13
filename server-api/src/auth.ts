import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import * as schema from "#database/schema/index.ts"
import { psql } from "./context/database.ts"
import { env } from "./env.ts"

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(psql.db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  trustedOrigins: ["https://meow.localhost:8443"],
})
