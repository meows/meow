import { createDb } from "#database/client.ts"
import { check } from "@meow/common/lib/console.ts"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set — see database/.env.example")

const { driver } = createDb(url, { max: 1 })

// TODO: nothing to seed yet — add inserts here as tables land in
// src/schema/app.ts (import { db } from the factory above and use
// db.insert(...) with the schema barrel).
console.log(`${check} Database seeded successfully!`)

await driver.end()
