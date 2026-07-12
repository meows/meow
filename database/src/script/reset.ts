import { reset } from "drizzle-seed"

import { Database } from "#database/client.ts"
import * as schema from "#database/schema/index.ts"
import { check } from "@meow/common/lib/console.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Reset

const psql = new Database("reset", { max: 1 })

try {
  await reset(psql.db, { schema })
  console.log(`${check} Database reset.`)
} 

finally {
  await psql.end()
}
