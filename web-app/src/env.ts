import { boolean, object, parse, string } from "valibot"

// Client env — extend with VITE_-prefixed vars as they appear.
const EnvSchema = object({
  MODE: string(),
  DEV: boolean(),
  PROD: boolean(),
})

export const env = parse(EnvSchema, import.meta.env)
