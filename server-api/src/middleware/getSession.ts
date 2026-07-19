/* ---------------------------------------------------------------------------------------
 * ■ Links
 * - https://hono.dev/docs/guides/middleware
 * - https://better-auth.com/docs/integrations/hono
 * ------------------------------------------------------------------------------------ */

import { createMiddleware } from "hono/factory"
import { auth } from "~/auth"

export type Session = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}

export const getSession = createMiddleware<Session>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.set("user", session?.user ?? null)
  c.set("session", session?.session ?? null)
  await next()
})
