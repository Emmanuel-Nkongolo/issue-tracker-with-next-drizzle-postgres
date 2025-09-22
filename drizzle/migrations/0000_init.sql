CREATE TYPE "public"."issue_priority" AS ENUM('Low', 'Medium', 'High');--> statement-breakpoint
CREATE TYPE "public"."issue_status" AS ENUM('Open', 'In-progress', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('Admin', 'User');--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "issue_status" DEFAULT 'Open' NOT NULL,
	"priority" "issue_priority" DEFAULT 'Medium' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
