/* ---------------------------------------------------------------------------------------
 * This module wraps over Drizzle and also exposes the underlying driver for lifecycle
 * management.
 * ------------------------------------------------------------------------------------ */

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { relations } from "#database/schema/relations.ts"
import { generate as randomUUIDv7 } from "@meow/common/lib/uuid7.ts"
import { env } from "#database/env.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Database Client

/** Type for Drizzle client used by `Database`. */
export type DB = PostgresJsDatabase<typeof relations>

/** Abstraction over Drizzle client. */
export class Database {
  /** Database driver for PSQL. @see https://github.com/porsager/postgres */
  driver: ReturnType<typeof postgres>
  /** The Drizzle client. */
  db: DB
  /** Unique per-client id, used to tag the connection's `application_name`. */
  uuid = randomUUIDv7()

  /**
   * Create a new database client.
   * @param name - The name of the connection.
   * @param options - Options for the `postgres` driver.
   */
  constructor(name: string, options?: postgres.Options<{}>) {
    this.driver = postgres({
      host: env.PSQL_HOSTNAME,
      port: env.PSQL_PORT,
      password: env.PSQL_PASSWORD,
      idle_timeout: 0,
      connection: { application_name: `${name}-${this.uuid}` },
      ...options,
    })
    this.db = drizzle({ client: this.driver, relations })
  }

  /** Check if database is reachable. */
  async ping() {
    return await this.db.execute(`SELECT 1`)
      .then(r => r.columns.length > 0)
      .catch(() => false)
  }

  /**
   * Close the database connection.
   * @param timeout - The timeout in seconds.
   */
  async end(timeout = 5) {
    await this.driver.end({ timeout })
  }
}
