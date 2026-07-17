import { email, maxLength, minLength, object, pipe, string, trim, type InferOutput } from "valibot"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

import { EMAIL_MAX, NAME_MAX, PASSWORD_MIN } from "#common/constant/limits.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Schema

export const schema_email = pipe(string(), trim(), email(), maxLength(EMAIL_MAX))

export const schema_password = pipe(string(), minLength(PASSWORD_MIN))

export const schema_sign_up = object({
  email: schema_email,
  password: schema_password,
  name: pipe(string(), trim(), minLength(1), maxLength(NAME_MAX)),
})

// ---------------------------------------------------------------------------------------
// Type

export type SignUp = InferOutput<typeof schema_sign_up>
