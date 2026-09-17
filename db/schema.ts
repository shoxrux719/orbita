// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
export const profiles=sqliteTable("profiles",{userId:text("user_id").primaryKey(),data:text("data").notNull(),updatedAt:integer("updated_at").notNull()});
export const homework=sqliteTable("homework",{userId:text("user_id").primaryKey(),state:text("state").notNull(),revision:integer("revision").notNull()});
export const googleAccounts=sqliteTable("google_accounts",{userId:text("user_id").primaryKey(),email:text("email").notNull(),name:text("name").notNull()});
export const authSessions=sqliteTable("auth_sessions",{tokenHash:text("token_hash").primaryKey(),userId:text("user_id").notNull(),expiresAt:integer("expires_at").notNull()});
export const oauthStates=sqliteTable("oauth_states",{stateHash:text("state_hash").primaryKey(),nonce:text("nonce").notNull(),expiresAt:integer("expires_at").notNull()});
export const sessions = sqliteTable("sessions", {
 userId:text("user_id").notNull(), id:text("id").notNull(), kind:text("kind").notNull(), itemId:text("item_id").notNull(), title:text("title").notNull(), score:integer("score").notNull(), total:integer("total").notNull(), seconds:integer("seconds").notNull(), day:text("day").notNull(), createdAt:integer("created_at").notNull()
},t=>[primaryKey({columns:[t.userId,t.id]})]);
export const reviews = sqliteTable("reviews",{
 userId:text("user_id").notNull(), wordId:text("word_id").notNull(), stage:integer("stage").notNull().default(0), due:integer("due").notNull(), lastAttempt:text("last_attempt").notNull()
},t=>[primaryKey({columns:[t.userId,t.wordId]})]);
export const drafts = sqliteTable("drafts",{userId:text("user_id").notNull(),promptId:text("prompt_id").notNull(),text:text("text").notNull(),updatedAt:integer("updated_at").notNull()},t=>[primaryKey({columns:[t.userId,t.promptId]})]);
export const bookmarks = sqliteTable("bookmarks",{userId:text("user_id").notNull(),bookId:text("book_id").notNull(),page:integer("page").notNull(),updatedAt:integer("updated_at").notNull()},t=>[primaryKey({columns:[t.userId,t.bookId]})]);
