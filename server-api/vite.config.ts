import devServer from "@hono/vite-dev-server"
import { defineConfig, loadEnv } from "vite-plus"

// @hono/vite-dev-server doesn't inherit Vite's env loading — surface .env
// through process.env for src/env.ts. Top-level (not the function config
// form) because this only matters for the dev server.
Object.assign(process.env, loadEnv(process.env.NODE_ENV ?? "development", import.meta.dirname, ""))

export default defineConfig({
  server: { port: 3000 },
  resolve: {
    alias: { "~/": "/src/" },
  },
  plugins: [devServer({ entry: "src/index.ts" })],
})
