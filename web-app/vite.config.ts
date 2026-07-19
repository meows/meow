import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react-oxc"
import { defineConfig, loadEnv } from "vite-plus"

import { env } from "./config"

// Shared dev topology comes from the Infisical /network folder (rendered to web-app/.env by
// `bun run secret:pull`). These are NOT VITE_-prefixed, so they're absent from
// import.meta.env — load them here in the config's Node context. Empty prefix = load every
// var, not just VITE_. `mode` only selects .env.[mode] overlays (which we don't use), so the
// base mode is fine. Fallbacks match the committed dev values so a fresh checkout boots
// before secret:pull. Object-literal form (not the fn form) avoids blowing TS's overload
// comparison depth on defineConfig.
const mode = process.env.NODE_ENV ?? "development"
// const env = loadEnv(mode, process.cwd(), "")
// const host = env.HOST ?? "meow.localhost"
// const webPort = Number(env.WEB_PORT ?? "4444") // Vite's own listener
// const gatewayPort = Number(env.GATEWAY_PORT ?? "4443") // Caddy origin the browser visits
// const apiPort = env.API_PORT ?? "3000"

export default defineConfig({
  plugins: [
    // Router plugin must come before the react plugin.
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
})
