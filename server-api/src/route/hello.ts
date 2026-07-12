import { vValidator } from "@hono/valibot-validator"
import * as v from "valibot"

import { EmailSchema } from "#common/validation/user.ts"
import factory from "~/factory.ts"

export const hello = factory.createApp().get(
  "/hello",
  vValidator("query", v.object({ email: EmailSchema })),
  (c) => c.json({ hello: c.req.valid("query").email }),
)
