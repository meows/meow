/* ---------------------------------------------------------------------------------------
 * ■ Environment variable validation for Vite configuration
 *
 * This is specifically for Vite configuration which has special rules around environment
 * variables.
 * ---------------------------------------------------------------------------------------
 * ■ Links
 * - https://vite.dev/config/#using-environment-variables-in-config
 * - https://vite.dev/guide/api-javascript#loadenv
 * ------------------------------------------------------------------------------------ */

import { object, parse, string } from "valibot"
import { loadEnv } from "vite-plus"

import { port } from "#common/validation/environment.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

const raw = loadEnv(process.env.NODE_ENV ?? "development", import.meta.dirname, "")

// ———————————————————————————————————————————————————————————————————————————————————————
// Validate

const schema = object({
  GATEWAY_HOST: string(),
  GATEWAY_PORT: port(),
  SERVER_API_PORT: port(),
  WEB_APP_PORT: port(),
})

// ---------------------------------------------------------------------------------------
// Export

export const env = parse(schema, raw)
export default env
