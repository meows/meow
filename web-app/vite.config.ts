import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { object, parse, string } from "valibot"
import { defineConfig, loadEnv } from "vite-plus"

import { port } from "#common/validate/env-parsing.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

const schema = object({
  GATEWAY_HOST: string(),
  GATEWAY_PORT: port(),
  SERVER_API_PORT: port(),
  WEB_APP_PORT: port(),
})

// ———————————————————————————————————————————————————————————————————————————————————————
// Vite configuration

/**
 * - Tanstack Router plugin must come before React plugin.
 * - https://vite.dev/config/#using-environment-variables-in-config
 * - https://vite.dev/guide/api-javascript#loadenv
 * - https://vite.dev/guide/env-and-mode#env-files
 */
export default defineConfig(() => {
  const env = parse(schema, loadEnv(process.env.NODE_ENV ?? "development", import.meta.dirname, ""))
  return {
    plugins: [
      tanstackRouter({
        target: "react",
        routesDirectory: "./src/route",
        generatedRouteTree: "./src/routeTree.gen.ts",
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "~/": "/src/",
        "@/": "/src/component/",
      },
    },
    server: {
      port: env.WEB_APP_PORT,
      strictPort: true,
      allowedHosts: [env.GATEWAY_HOST],
      // HMR over the Caddy origin: the client dials the gateway port (Caddy), which
      // upgrades the WebSocket through to Vite. Host + protocol are inferred from the page
      // (wss + the host). Trade-off: direct http://localhost:<webPort> no longer
      // hot-reloads — go through Caddy.
      hmr: { clientPort: env.GATEWAY_PORT },
      // proxy: {
      //   "/api": `https://localhost:${env.SERVER_API_PORT}`,
      // },
    },
  }
})
