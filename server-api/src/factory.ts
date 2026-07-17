/* ---------------------------------------------------------------------------------------
 * Factory for Hono application.
 * https://hono.dev/docs/helpers/factory
 * ------------------------------------------------------------------------------------ */

import { createFactory } from "hono/factory"

import type { DB } from "@meow/database/client.ts"

import type { Session } from "./middleware/getSession.ts"
import { psql } from "./context/database.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

/**
 * The context type for the base hono instance.
 */
export type Env = {
  Variables: { db: DB } & Session["Variables"]
}

// ———————————————————————————————————————————————————————————————————————————————————————
// Factory

/**
 * App factory for creating routes with context.
 * @example
 * ```ts
 * const app = factory.createApp()
 * ```
 */
const factory = createFactory<Env>({
  initApp(app) {
    app.use(async (c, next) => {
      c.set("db", psql.db)
      await next()
    })
  },
})

export default factory
