import { GET, POST } from "@meow/common/constant/http.ts"
import { check } from "@meow/common/lib/console.ts"
import { auth } from "~/auth"
import factory from "~/factory"
import { hello } from "~/route/hello"

// —————————————————————————————————————————————————————————————————————————————
// Hono Root

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
  port: 3000,
  fetch: app.fetch,
})

console.log(`${check} server-api → http://localhost:${server.port}`)
