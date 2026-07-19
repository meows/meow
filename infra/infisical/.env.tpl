# Config for the self-hosted Infisical instance (infra/infisical/docker-compose.yaml).
# Copy to infra/infisical/.env and fill in. This file is committed as a reference;
# the real .env stays gitignored.
#
# Verify the exact required variable set against the current official compose:
#   https://infisical.com/docs/self-hosting/configuration/envars

# App secrets — generate fresh, do NOT reuse across environments:
# openssl rand -hex 16
ENCRYPTION_KEY=op://Employee/Infisical/LOCAL/ENCRYPTION_KEY
# openssl rand -base64 32
AUTH_SECRET=op://Employee/Infisical/LOCAL/AUTH_SECRET

# Public URL the instance is served from.
SITE_URL=http://localhost:8080

# The PostgreSQL that will back the Infisical instance.
INFISICAL_DB_USER=op://Employee/Infisical/LOCAL/INFISICAL_DB_USER
INFISICAL_DB_PASSWORD=op://Employee/Infisical/LOCAL/INFISICAL_DB_PASSWORD
INFISICAL_DB_NAME=op://Employee/Infisical/LOCAL/INFISICAL_DB_NAME

# Email functionality to stop Infisical from warning.
SMTP_HOST=op://Employee/Infisical/LOCAL/SMTP_HOST
SMTP_PORT=op://Employee/Infisical/LOCAL/SMTP_PORT
SMTP_USERNAME=op://Employee/Infisical/LOCAL/SMTP_USERNAME
SMTP_PASSWORD=op://Employee/Infisical/LOCAL/SMTP_PASSWORD
SMTP_FROM_ADDRESS=op://Employee/Infisical/LOCAL/SMTP_FROM_ADDRESS
SMTP_FROM_NAME=op://Employee/Infisical/LOCAL/SMTP_FROM_NAME
