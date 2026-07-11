import { vValidator } from "@hono/valibot-validator"
import { Hono } from "hono"
import * as v from "valibot"

import { EmailSchema } from "#common/validation/user.ts"

export const hello = new Hono().get(
  "/hello",
  vValidator("query", v.object({ email: EmailSchema })),
  (c) => c.json({ hello: c.req.valid("query").email }),
)
