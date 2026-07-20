import { bytea, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull(),
  token: text(),
  currentChallenge: text("current_challenge"),
});

export const passkeys = pgTable("passkeys", {
  id: uuid().defaultRandom().primaryKey(),
  credentialId: bytea("credential_id").notNull(),
  publicKey: bytea("public_key").notNull(),
  counter: integer(),
  transports: text().array(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Passkey = typeof passkeys.$inferSelect;
export type NewPasskey = typeof passkeys.$inferInsert;
