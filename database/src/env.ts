/* ---------------------------------------------------------------------------------------
 * Database environment variables
 * - So far the only purpose is for tooling config and database management.
 * ------------------------------------------------------------------------------------ */

import { object, parse } from "valibot"
import { notEmpty, port } from "#common/validate/env-parsing.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

const schema_env = object({
  /** Full PostgreSQL connection string. */
  DATABASE_URL: notEmpty(),

  PSQL_HOSTNAME: notEmpty(),
  PSQL_PORT:     port(),
  PSQL_USER:     notEmpty(),
  PSQL_PASSWORD: notEmpty(),
  PSQL_DB:       notEmpty(),
  PSQL_SCHEMA:   notEmpty(),
})

// ---------------------------------------------------------------------------------------
// Export

export const env = parse(schema_env, process.env)
export default env
