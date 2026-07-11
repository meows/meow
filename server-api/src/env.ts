import * as v from "valibot"

const EnvSchema = v.object({
  DATABASE_URL: v.pipe(v.string(), v.url()),
  BETTER_AUTH_SECRET: v.pipe(v.string(), v.minLength(16)),
  BETTER_AUTH_URL: v.pipe(v.string(), v.url()),
})

export const env = v.parse(EnvSchema, {
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
})
