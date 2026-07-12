import { minLength, object, parse, pipe, string, url } from "valibot"

const schema_env = object({
  DATABASE_URL: pipe(string(), url()),
  BETTER_AUTH_SECRET: pipe(string(), minLength(16)),
  BETTER_AUTH_URL: pipe(string(), url()),
})

export const env = parse(schema_env, process.env)
