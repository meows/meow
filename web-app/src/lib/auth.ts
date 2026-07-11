import { createAuthClient } from "better-auth/client"

// Same-origin in dev via the /api proxy — no baseURL needed.
export const authClient = createAuthClient()
