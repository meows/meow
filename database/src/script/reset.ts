import { sql } from "drizzle-orm"
import { migrate } from "drizzle-orm/postgres-js/migrator"

import { createDb } from "#database/client.ts"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set — see database/.env.example")

const { db, driver } = createDb(url, { max: 1, onnotice: () => {} })

// Drop everything: application tables (public) AND drizzle's migration
// journal (the drizzle schema) — leaving the journal behind would make
// migrate() a no-op and the tables would never come back.
await db.execute(sql`drop schema if exists public cascade`)
await db.execute(sql`create schema public`)
await db.execute(sql`drop schema if exists drizzle cascade`)

await migrate(db, { migrationsFolder: "./migrations" })
await driver.end()

console.log("db:reset — schema dropped, migrations re-applied")
