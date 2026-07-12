import { integer, minValue, nonEmpty, object, parse, pipe, string, toNumber } from "valibot"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

const schema_env = object({
  PSQL_USER:     pipe(string(), nonEmpty()), // postgres
  PSQL_PASSWORD: pipe(string(), nonEmpty()), // postgres
  PSQL_DB:       pipe(string(), nonEmpty()), // postgres
  PSQL_SCHEMA:   pipe(string(), nonEmpty()), // meow

  PSQL_HOSTNAME: pipe(string(), nonEmpty()), // localhost
  PSQL_PORT:     pipe(string(), toNumber(), integer(), minValue(1)), // 5432
})

// ---------------------------------------------------------------------------------------
// Export

export const env = parse(schema_env, process.env)
export default env
