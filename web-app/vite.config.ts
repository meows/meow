import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react-oxc"
import { defineConfig } from "vite-plus"

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
    // Caddy (see infra/Caddyfile) is the primary dev entry: it serves
    // https://meow.local / https://meow.localhost on :443 and proxies here.
    allowedHosts: ["meow.localhost", "meow.local"],
    // HMR over the Caddy origin: the client dials :443 (Caddy), which upgrades
    // the WebSocket through to Vite. Host + protocol are inferred from the page
    // (wss + whichever hostname), so both names work. Trade-off: direct
    // http://localhost:5173 no longer hot-reloads — go through Caddy.
    hmr: { clientPort: 443 },
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
