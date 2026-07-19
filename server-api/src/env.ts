/* ---------------------------------------------------------------------------------------
 * Validation for environment variables
 * ------------------------------------------------------------------------------------ */

import { minLength, object, parse, pipe, string } from "valibot"
import { notEmpty, port, url } from "#common/validation/environment.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Validation

const schema = object({
  /** https://better-auth.com/docs/reference/options#secret */
  BETTER_AUTH_SECRET: pipe(string(), minLength(16)),

  /** Connection string for the primary app database. */
  DATABASE_URL: url(),

  /** Caddy alias for host. */
  GATEWAY_HOST: notEmpty(),

  /** Port for the gateway service. */
  GATEWAY_PORT: port(),

  /** Port this Hono API binds to. */
  SERVER_API_PORT: port(),

  /** Externally visible URL. */
  SERVER_API_URL: url(),
})

// ---------------------------------------------------------------------------------------
// Export

export const env = parse(schema, process.env)
export default env
