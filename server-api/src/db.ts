import { createDb } from "#database/client.ts"

// Relative import (not ~): this chain is also loaded by the better-auth CLI
// outside Vite, where the ~ alias doesn't exist.
import { env } from "./env.ts"

export const { db, driver } = createDb(env.DATABASE_URL)
