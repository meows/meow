import * as v from "valibot"

// Client env — extend with VITE_-prefixed vars as they appear.
const EnvSchema = v.object({
  MODE: v.string(),
  DEV: v.boolean(),
  PROD: v.boolean(),
})

export const env = v.parse(EnvSchema, import.meta.env)
