/* ---------------------------------------------------------------------------------------
 * ■ Links
 * - https://hono.dev/docs/guides/middleware
 * - https://better-auth.com/docs/integrations/hono
 * ------------------------------------------------------------------------------------ */

import { createMiddleware } from "hono/factory"
import { auth } from "~/auth"

export type Session = {
  Variables: {
    user: typeof auth.$Infer.Session.user
    session: typeof auth.$Infer.Session.session
  }
}

export const enforceSession = createMiddleware<Session>(async (c, next) => {
  if (!c.get("user") || !c.get("session")) return c.body(null, 401)
  await next()
})
