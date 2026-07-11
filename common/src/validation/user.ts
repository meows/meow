import * as v from "valibot"

import { EMAIL_MAX, NAME_MAX, PASSWORD_MIN } from "#common/constant/limits.ts"

export const EmailSchema = v.pipe(v.string(), v.trim(), v.email(), v.maxLength(EMAIL_MAX))

export const PasswordSchema = v.pipe(v.string(), v.minLength(PASSWORD_MIN))

export const SignUpSchema = v.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(NAME_MAX)),
})

export type SignUp = v.InferOutput<typeof SignUpSchema>
