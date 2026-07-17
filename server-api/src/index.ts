import { Scalar } from "@scalar/hono-api-reference"
import { openAPIRouteHandler } from "hono-openapi"

import { GET, POST } from "#common/constant/http.ts"
import { auth } from "~/auth"
import factory from "~/factory"
import { getSession } from "~/middleware/getSession"
import { hello } from "~/route/hello"

// ———————————————————————————————————————————————————————————————————————————————————————
// Hono Root

const app = factory.createApp()
  .basePath("/api")
  .on([GET, POST], "/auth/*", (c) => auth.handler(c.req.raw))
  .use("*", getSession)
  .route("/hello", hello)

// ---------------------------------------------------------------------------------------
// OpenAPI

app
  .get("/openapi", openAPIRouteHandler(app, {
    documentation: {
      info: { title: "meow API", version: "1.0.0" },
      servers: [{ url: "http://localhost:3000", description: "Local" }],
    },
  }))
  .get("/docs", Scalar({ url: "/api/openapi" }))

// ———————————————————————————————————————————————————————————————————————————————————————
// Export

export type App = typeof app
export default app
