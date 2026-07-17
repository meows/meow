import { describeRoute, resolver, validator as input } from "hono-openapi"
import { object } from "valibot"

import { schema_email } from "#common/validation/user.ts"
import factory from "~/factory.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

const model = {
  hello: {
    get: {
      query: object({
        email: schema_email,
      }),
      response: object({
        hello: schema_email,
      }),
    },
  },
}

const doc = {
  hello: {
    get: describeRoute({
      description: "Echo the given email address",
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": { schema: resolver(model.hello.get.response) },
          },
        },
      },
    }),
  },
}

// ———————————————————————————————————————————————————————————————————————————————————————
// Route

export const hello = factory.createApp()
  .get("/", doc.hello.get, input("query", model.hello.get.query), (c) => {
    const { email } = c.req.valid("query")
    return c.json({ hello: email })
  })
