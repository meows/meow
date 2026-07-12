import { Hono } from "hono"

import { GET, POST } from "@meow/common/constant/http.ts"
import { auth } from "~/auth.ts"
import factory from "~/factory.ts"
import { hello } from "~/route/hello.ts"

const app = factory.createApp()
  .get("/api/health", (c) => c.json({ ok: true }))
  .on([GET, POST], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    c.set("user", session?.user ?? null)
    c.set("session", session?.session ?? null)
    await next()
  })
  .route("/api", hello)

export type App = typeof app

// —————————————————————————————————————————————————————————————————————————————
// Serve

const server = Bun.serve({
  fetch: app.fetch,
})
