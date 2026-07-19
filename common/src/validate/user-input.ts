/* -----------------------------------------------------------------------------
 * ■ Validation methods for user input.
 *
 * These validations are distinctive in that they prefer data normalization.
 * - strings are whitespace trimmed
 * - email address is lowercased
 * -------------------------------------------------------------------------- */

import { email, maxLength, minLength, nonEmpty, object, pipe, string, toLowerCase, trim, url, type InferOutput } from "valibot"
import { EMAIL_MAX, NAME_MAX, PASSWORD_MIN } from "#common/constant/limits.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Schema

export const schema_email = pipe(string(), trim(), email(), maxLength(EMAIL_MAX))

export const schema_password = pipe(string(), minLength(PASSWORD_MIN))

export const schema_sign_up = object({
  email: schema_email,
  password: schema_password,
  name: pipe(string(), trim(), nonEmpty("Name cannot be empty."), maxLength(NAME_MAX)),
})

/** Validates email address and normalizes it to lowercase. */
export const isEmail = pipe(
  string(),
  trim(),
  nonEmpty(),
  email("Malformed email address"),
  toLowerCase(),
)

/** Non-empty trimmed string. */
export const isGoodString = pipe(
  string(),
  trim(),
  nonEmpty(),
)

/** Trims string and checks if URL. */
export const isUrl = pipe(
  string(),
  trim(),
  url("Malformed URL"),
)

// ---------------------------------------------------------------------------------------
// Type

export type SignUp = InferOutput<typeof schema_sign_up>
