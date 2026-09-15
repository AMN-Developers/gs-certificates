CREATE TABLE IF NOT EXISTS "admin_users" (
  "id" serial PRIMARY KEY NOT NULL,
  "username" varchar(80) NOT NULL,
  "password_hash" varchar(512) NOT NULL,
  "role" varchar(20) DEFAULT 'admin' NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "must_change_password" boolean DEFAULT true NOT NULL,
  "last_login_at" timestamp(3),
  "password_changed_at" timestamp(3) DEFAULT now() NOT NULL,
  "created_at" timestamp(3) DEFAULT now() NOT NULL,
  "updated_at" timestamp(3) DEFAULT now() NOT NULL,
  CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_users_active_idx"
ON "admin_users" USING btree ("active");
