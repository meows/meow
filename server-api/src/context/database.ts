import { Database, type DB } from "@meow/database/client.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Database

export const psql = new Database("server-api", { max: 10 })
