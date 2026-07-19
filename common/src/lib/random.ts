import { alphabet } from "#common/constant/string.ts"

/** Returns a cryptographically random 64-bit unsigned integer. */
function randomU64(): bigint {
  const buf = crypto.getRandomValues(new Uint8Array(8))
  return new DataView(buf.buffer).getBigUint64(0, false)
}

/**
 * Randomly choose an element from array `arr`.
 * @example
 * randomChoice([1, 2, 3]) // => 2
 * randomChoice([1, 2, 3]) // => 1
 */
export function randomChoice<T>(arr: T[]): T {
  return arr[randomNat(arr.length)]!
}

/**
 * Generate a uniformly random natural from `[0, max)` without modulo bias.
 *
 * Uses a 128-bit fixed-point multiply: treats two 64-bit random words as
 * `r ∈ [0, 1)` and returns `⌊r × max⌋`. Bias is ≤ max / 2¹²⁸.
 *
 * @see https://github.com/swiftlang/swift/pull/39143
 * @example
 * const arr = [0, 1, 2, 3, 4]
 * const randomChoice = arr[randomNat(arr.length)]
 */
export function randomNat(max: number): number {
  if (max <= 1) return 0
  const m = BigInt(max)
  const r128 = (randomU64() << 64n) | randomU64()
  return Number((r128 * m) >> 128n)
}

/**
 * Returns a random string of `length` characters.
 * - cryptographically safe
 * - cardinality of alphabet **must** be a power of 2
 * - bit mask **must** be `alphabet.length - 1`
 */
export function randomString(length = 32): string {
  const int = crypto.getRandomValues(new Uint8Array(length))
  let token = ""
  for (let n=0; n<length; n++) token += alphabet[63 & int[n]!]
  return token
}

/**
 * Generate a random base64 string of `length` characters.
 * @example
 * const base64 = randomBase64(32)
 */
export function randomBase64(length = 32): string {
  const byteLength = Math.ceil((length * 3) / 4)
  const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength))
  return randomBytes.toBase64().slice(0, length)
}

/**
 * Returns a randomly permuted copy of `arr`.
 * - Uses Fischer-Yates shuffle.
 * @example
 * shuffleArray([1, 2, 3, 4, 5]) // returns a shuffled copy
 */
export function shuffle<T>(arr:T[]) {
  const 品 = arr.slice()
  for (let i = 品.length - 1; 0 < i; i--) {
    const j = randomNat(i + 1)
    const tmp = 品[i]!
    品[i] = 品[j]!
    品[j] = tmp
  }
  return 品
}
