import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "#database/schema/index.ts"

// Pure factory — no env access, no top-level connection. postgres.js connects
// lazily on first query, which lets tooling (better-auth CLI, drizzle-kit)
// import this module without a live database.
export function createDb(url: string, options?: postgres.Options<{}>) {
  const driver = postgres(url, options)
  const db = drizzle(driver, { schema })
  return { driver, db }
}

export type Database = ReturnType<typeof createDb>["db"]
