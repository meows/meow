import { defineConfig } from "vite-plus"

export default defineConfig({
  lint: {
    plugins: ["typescript"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: ["**/routeTree.gen.ts", "**/migrations/**"],
    overrides: [
      {
        files: ["web-app/**"],
        plugins: ["typescript", "react"],
      },
    ],
  },
  fmt: {
    semi: false,
    ignorePatterns: ["**/routeTree.gen.ts", "**/migrations/**"],
  },
  run: {
    tasks: {
      check: { command: "vp check" },
      test: { command: "vp test" },
      lint: { command: "vp lint" },
      fmt: { command: "vp fmt", cache: false },
    },
  },
})
