import { Hono } from "hono"

import { auth } from "~/auth.ts"
import { hello } from "~/route/hello.ts"

export const app = new Hono()

app.get("/api/health", (c) => c.json({ ok: true }))
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
app.route("/api", hello)
