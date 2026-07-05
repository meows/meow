# Goal

I want a web app starting scaffold.
- I want monorepo.
- I want Valibot for validation.
- Consider viteplus if it's interesting.
- Uses Tanstack Router on the web app side in a high-level folder/project called `web-app`.
  - I want to use shadcn with base ui.
  - There will be a folder called typically called `components`; call it `component` instead and allow the path aliasing of `@`.
  - I also want the root `src` of this frontend project to have the alias `~`.
- For the server API side I want a high-level folder/project called `server-api`.
  - Hono
  - Drizzle ORM
- I want a `common` high-level folder for libraries.
  - Start off with a `lib` subproject
  - Start off with a `constant` subproject
  - Start off with a `validation` subproject
  - I should be able to import `@kit/common/constant/specific-file.ts` into another project.

# Guidance

# Links
