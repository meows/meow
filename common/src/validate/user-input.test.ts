import { safeParse } from "valibot"
import { describe, expect, it } from "vitest"

import { PASSWORD_MIN } from "#common/constant/limits.ts"
import { schema_sign_up } from "#common/validate/user-input.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Test

describe("SignUpSchema", () => {
  it("Accepts a valid sign-up payload", () => {
    const result = safeParse(schema_sign_up, {
      email: "a@b.co",
      password: "p".repeat(PASSWORD_MIN),
      name: "a",
    })
    expect(result.success).toBe(true)
  })

  it("Rejects a short password", () => {
    const result = safeParse(schema_sign_up, {
      email: "a@b.co",
      password: "p".repeat(PASSWORD_MIN - 1),
      name: "a",
    })
    expect(result.success).toBe(false)
  })
})
