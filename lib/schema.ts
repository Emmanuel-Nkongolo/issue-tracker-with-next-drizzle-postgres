import { relations } from "drizzle-orm";
import {
  uuid,
  text,
  integer,
  timestamp,
  pgTable,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["Admin", "User"]);
export const issueStatus = pgEnum("issue_status", [
  "Open",
  "In-progress",
  "Closed",
]);
export const issuePriority = pgEnum("issue_priority", [
  "Low",
  "Medium",
  "High",
]);

// Users table will add admin priv later on
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: userRole("role").notNull().default("User"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Accounts table (for NextAuth)
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table (for NextAuth)
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Verification tokens table (for NextAuth)
export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Issue table
export const issues = pgTable("issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: issueStatus("status").notNull().default("Open"),
  priority: issuePriority("priority").notNull().default("Medium"),
  assigneeId: uuid("assignee_id").references(() => users.id),
  createdById: uuid("created_by_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  createdIssues: many(issues, { relationName: "createdIssues" }),
  assignedIssues: many(issues, { relationName: "assignedIssues" }),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  createdBy: one(users, {
    fields: [issues.createdById],
    references: [users.id],
    relationName: "createdIssues",
  }),
  assignee: one(users, {
    fields: [issues.assigneeId],
    references: [users.id],
    relationName: "assignedIssues",
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
