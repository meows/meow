import { describe, expect, it } from "vitest"
import * as v from "valibot"

import { PASSWORD_MIN } from "#common/constant/limits.ts"
import { SignUpSchema } from "#common/validation/user.ts"

describe("SignUpSchema", () => {
  it("accepts a valid sign-up payload", () => {
    const result = v.safeParse(SignUpSchema, {
      email: "a@b.co",
      password: "p".repeat(PASSWORD_MIN),
      name: "a",
    })
    expect(result.success).toBe(true)
  })

  it("rejects a short password", () => {
    const result = v.safeParse(SignUpSchema, {
      email: "a@b.co",
      password: "p".repeat(PASSWORD_MIN - 1),
      name: "a",
    })
    expect(result.success).toBe(false)
  })
})
