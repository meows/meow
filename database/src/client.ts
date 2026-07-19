/* ---------------------------------------------------------------------------------------
 * This module wraps over Drizzle and also exposes the underlying driver for lifecycle
 * management.
 * ------------------------------------------------------------------------------------ */

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { generate as randomUUIDv7 } from "#common/lib/uuid7.ts"
import { relations } from "./schema/relations.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Database Client

/** Type for Drizzle client used by `Database`. */
export type DB = PostgresJsDatabase<typeof relations>

/**
 * Abstraction over Drizzle client for PostgreSQL.
 */
export class Database {
  /** Database driver for PSQL. @see https://github.com/porsager/postgres */
  driver: ReturnType<typeof postgres>
  /** The Drizzle client. */
  db: DB
  /** Unique client id. */
  uuid = randomUUIDv7()

  /**
   * Create a new PostgreSQL database client. 
   * - Constructing is lazy. No connection is opened until the first query.
   *
   * @param name - The name of the connection.
   * @param url - PostgreSQL connection string.
   * @param options - Options for the `postgres` driver.
   */
  constructor(name: string, url: string, options?: postgres.Options<{}>)
  constructor(name: string, options: postgres.Options<{}>)
  constructor(name: string, url?: string | postgres.Options<{}>, options?: postgres.Options<{}>) {
    if (typeof url !== "string") [url, options] = [undefined, url]
    const config: postgres.Options<{}> = {
      idle_timeout: 0,
      connection: { application_name: `${name}-${this.uuid}` },
      ...options,
    }
    this.driver = url ? postgres(url, config) : postgres(config)
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
