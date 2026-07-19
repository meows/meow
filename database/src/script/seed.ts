import { Database } from "#database/client.ts"
import { env } from "#database/env.ts"
import { check } from "@meow/common/lib/console.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Seed

const psql = new Database("seed", env.DATABASE_URL, { max: 1 })

// TODO: nothing to seed yet — add inserts here as tables land in
// src/schema/app.ts (use psql.db with the schema barrel).
console.log(`${check} Database seeded successfully!`)

await psql.end()
