/* -----------------------------------------------------------------------------
 * Main application database schema.
 * -------------------------------------------------------------------------- */

import { integer, pgSchema, primaryKey, text, timestamp, type ReferenceConfig } from "drizzle-orm/pg-core"
import { defineRelations } from "drizzle-orm"

import { env } from "#database/env.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Environment

/**
 * Use this to create new resources under the appropriate namespace (what PSQL
 * unfortunately calls "schema").
 */
export const schema = pgSchema(env.PSQL_SCHEMA)

const chain: Record<string, ReferenceConfig["config"]> = {
  delete: { onDelete: "cascade" },
  null:   { onDelete: "set null" },
  none:   { onDelete: "no action" },
} as const

const time = () => timestamp({ withTimezone: true, mode: "date" }).defaultNow()

// ———————————————————————————————————————————————————————————————————————————————————————
// Tables

