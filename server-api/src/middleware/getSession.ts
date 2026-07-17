import { auth } from "~/auth"
import factory from "~/factory"

export type Session = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}

/**
 * https://better-auth.com/docs/integrations/hono
 */
export const getSession = factory.createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.set("user", session?.user ?? null)
  c.set("session", session?.session ?? null)
  await next()
})
