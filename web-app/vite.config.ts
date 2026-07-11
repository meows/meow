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
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
