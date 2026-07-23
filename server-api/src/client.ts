/* ---------------------------------------------------------------------------------------
 * https://hono.dev/docs/guides/rpc#client
 * ------------------------------------------------------------------------------------ */

import { hc } from "hono/client"
import type { App } from "~/index"

// ———————————————————————————————————————————————————————————————————————————————————————
// Hono RPC Client

export type Client = ReturnType<typeof hc<App>>
export const createClient = (...args: Parameters<typeof hc>): Client => hc<App>(...args)
