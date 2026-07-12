/* ---------------------------------------------------------------------------------------
 * ■ Links
 * - https://orm.drizzle.team/docs/relations
 * ------------------------------------------------------------------------------------ */

import { defineRelations } from "drizzle-orm"
import * as schema from "#database/schema/index.ts"

// ———————————————————————————————————————————————————————————————————————————————————————
// Relations

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  session: {
    // FK column is NOT NULL, so a session always resolves to a user.
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
      optional: false,
    }),
  },
}))
