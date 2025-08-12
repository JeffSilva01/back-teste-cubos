import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
});

export type User = typeof usersTable.$inferSelect; // return type when queried
export type NewUser = typeof usersTable.$inferInsert; // insert type
