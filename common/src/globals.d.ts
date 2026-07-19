/* ---------------------------------------------------------------------------------------
 * WinterTC "Minimum Common Web API" — the universal web globals @meow/common relies on.
 *
 * This package's tsconfig uses a pure-ECMAScript lib ("esnext"): no DOM, no worker scope,
 * no Node globals are in scope. This file re-declares ONLY the web-platform globals the
 * code actually uses. Anything outside that set — window/document (DOM), self/
 * importScripts/caches (worker), Buffer/process (Node) — stays a compile error here.
 *
 * Reaching for a new universal API (crypto.subtle, TextEncoder, structuredClone, URL,
 * fetch…) is a deliberate one-line edit to this file — that friction is the point.
 * ------------------------------------------------------------------------------------ */

interface Crypto {
  getRandomValues<T extends ArrayBufferView>(array: T): T
}

declare const crypto: Crypto
