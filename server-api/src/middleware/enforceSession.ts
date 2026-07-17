import { createMiddleware } from "hono/factory"

import type { Session } from "./getSession.ts"

export type EnforcedSession = {
  Variables: {
    [K in keyof Session["Variables"]]: NonNullable<Session["Variables"][K]>
  }
}

/**
 * Rejects unauthenticated requests. Routes behind it see non-null `user` / `session`.
 * Requires `getSession` to have run earlier in the chain.
 */
export const enforceSession = createMiddleware<EnforcedSession>(async (c, next) => {
  if (!c.get("user") || !c.get("session")) return c.body(null, 401)
  await next()
})
