import { describe, expect, it } from "vitest"

import { SLUG_MAX } from "#common/constant/limits.ts"
import { createDb } from "#database/client.ts"

// Gate test for the scaffold: #common/* → @kit/common/* → ./src/* must resolve
// from a sibling package under rolldown-vite, and createDb must stay lazy
// (constructing a client without a reachable database must not throw).
describe("cross-package resolution", () => {
  it("resolves #common through the @kit/common exports chain", () => {
    expect(SLUG_MAX).toBe(48)
  })

  it("creates a db client lazily without connecting", () => {
    const { db, driver } = createDb("postgres://nobody@localhost:1/nope")
    expect(db).toBeDefined()
    expect(typeof driver.end).toBe("function")
  })
})
