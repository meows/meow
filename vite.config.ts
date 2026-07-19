import { defineConfig } from "vite-plus"

export default defineConfig({
  check: {
    // Formatting is hand-managed and selective — never bundle it into `vp check`.
    // `vp check` = lint + type-check only; run `vp fmt` manually when you want it.
    fmt: false,
  },
  lint: {
    plugins: ["typescript"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      // Erasable-syntax discipline, enums intentionally kept: ban the runtime-
      // emitting TS constructs that break type-stripping, but leave enums alone.
      "typescript/no-namespace": "error",
      "typescript/no-require-imports": "error",
      "typescript/parameter-properties": "error",
    },
    ignorePatterns: ["**/routeTree.gen.ts", "**/migrations/**"],
    overrides: [
      {
        files: ["web-app/**"],
        plugins: ["typescript", "react"],
      },
      {
        // @meow/common is WinterTC-universal: it may import only universal code
        // (valibot, its own modules). The tsconfig guards ambient GLOBALS; this
        // guards module IMPORTS — the other route non-universal code sneaks in.
        files: ["common/**"],
        plugins: ["typescript", "import"], // override REPLACES base plugins; "import" is off by default
        rules: {
          "import/no-nodejs-modules": "error", // bans both `fs` and `node:fs`
          "no-restricted-imports": [
            "error",
            {
              paths: [
                { name: "react", message: "common is universal — no React (browser-only)" },
                { name: "react-dom", message: "common is universal — no React (browser-only)" },
                { name: "hono", message: "common is universal — no server framework" },
                { name: "drizzle-orm", message: "common is universal — no DB layer" },
              ],
              patterns: [
                {
                  group: [
                    "bun",
                    "bun:*",
                    "@meow/web-app",
                    "@meow/web-app/*",
                    "@meow/server-api",
                    "@meow/server-api/*",
                    "@meow/database",
                    "@meow/database/*",
                  ],
                  message: "common is WinterTC-universal — no bun/app-package imports",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  fmt: {
    semi: false,
    singleQuote: true,
    printWidth: 100,
    // Sort imports into groups (blank line between): builtin → external
    // (bare + @scoped) → #-subpath internal → relative. So library imports
    // ("hello", "@hello") always rank above our internal "#" imports.
    sortImports: true,
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
