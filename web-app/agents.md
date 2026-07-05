# Technology
- Our build system is Vite.
- We use React with Tailwind.
- We use shadcn with Base UI but other component libraries are ok.

# Style
- We want the ergonomic standards of a library author.
- Prefer idiomatic React and TypeScript patterns.

# Constraint
- Resist modifying base shadcn components without a good argument.
- Don't modify global css without a good argument.
- We are doing single-page app (SPA) and don't care about SSR.
- Ignore Biome style and linting issues.

# Directory Structure
- `biome.json` style formatting
- `components.json` shadcn configs
- `tsconfig.json`
- 📁 `src` source code
  - `env.ts` local client environment variables
  - `global.css` Tailwind v4 theme config (colors, fonts, animations, keyframes)
  - 📁 `component` shared React components
    - 📁 `ui` shadcn components
    - 📁 `shell` application shell
    - 📁 `icon` artistic icon assets
  - 📁 `hook` React hooks
  - 📁 `lib`
    - `utils.ts` shadcn utility function (cn)
  - 📁 `public`
    - 📁 `pixel` pixel art
    - 📁 `sound`
  - 📁 `routes` we're using Tanstack Router
    - `index.tsx` root route
    - 📁 `app` the session protected portion of our app
    - 📁 `auth` registration, login, recovery stuff
  - 📁 `state` Jotai atoms, global state, etc.

# Links
- [Base UI documentation](https://base-ui.com/llms.txt)
- [Shadcn documentation](https://ui.shadcn.com/llms.txt)
- [Tanstack Router documentation](https://tanstack.com/router/latest/docs/overview)
