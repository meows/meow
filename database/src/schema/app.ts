/* -----------------------------------------------------------------------------
 * Main application database schema.
 * -------------------------------------------------------------------------- */

import { integer, pgSchema, primaryKey, text, timestamp, type ReferenceConfig } from "drizzle-orm/pg-core"
import { defineRelations } from "drizzle-orm"

// ———————————————————————————————————————————————————————————————————————————————————————
// Namespace

/**
 * Use this to create new resources under the appropriate namespace (what PSQL
 * unfortunately calls "schema"). The name is baked into generated migrations,
 * so it is a constant of the data model; the env override exists only for
 * non-standard deployments. Defaulted so that importing the schema (or the
 * client built on it) never demands a configured environment.
 */
export const schema = pgSchema(process.env.PSQL_SCHEMA || "meow")

const chain: Record<string, ReferenceConfig["config"]> = {
  delete: { onDelete: "cascade" },
  null:   { onDelete: "set null" },
  none:   { onDelete: "no action" },
} as const

const time = () => timestamp({ withTimezone: true, mode: "date" }).defaultNow()

// ———————————————————————————————————————————————————————————————————————————————————————
// Tables

