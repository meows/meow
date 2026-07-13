# ----------------------------------------------------------------------------------------
# ■ Environment variables for `server-api`
# - Template for 1Password CLI tool `op` that will overwrite corresponding env file.
# ----------------------------------------------------------------------------------------

# https://better-auth.com/docs/installation#set-environment-variables
BETTER_AUTH_URL=op://scaffold/BetterAuth/LOCAL/BETTER_AUTH_URL
BETTER_AUTH_SECRET=op://scaffold/BetterAuth/LOCAL/BETTER_AUTH_SECRET

PSQL_HOSTNAME=op://scaffold/database/LOCAL/host
PSQL_PORT=op://scaffold/database/LOCAL/port
PSQL_USER=op://scaffold/database/LOCAL/user
PSQL_PASSWORD=op://scaffold/database/LOCAL/password
PSQL_DB=op://scaffold/database/LOCAL/database
PSQL_SCHEMA=op://scaffold/database/LOCAL/schema

DATABASE_URL=op://scaffold/database/LOCAL/connection_string
