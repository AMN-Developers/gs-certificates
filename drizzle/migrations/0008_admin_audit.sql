CREATE TABLE IF NOT EXISTS "token_adjustments" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "type" "certificate_type" NOT NULL,
  "amount" integer NOT NULL,
  "balance_before" integer NOT NULL,
  "balance_after" integer NOT NULL,
  "reason" varchar(300) NOT NULL,
  "admin_actor" varchar(100) NOT NULL,
  "created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "token_adjustments" ADD CONSTRAINT "token_adjustments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "token_adjustments_user_created_idx" ON "token_adjustments" USING btree ("user_id", "created_at");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "level" varchar(20) DEFAULT 'info' NOT NULL,
  "category" varchar(20) DEFAULT 'operational' NOT NULL,
  "event" varchar(150) NOT NULL,
  "correlation_id" varchar(36) NOT NULL,
  "actor_type" varchar(30) DEFAULT 'system' NOT NULL,
  "actor_id" integer,
  "actor_label" varchar(100),
  "resource_type" varchar(80),
  "resource_id" varchar(150),
  "details" jsonb,
  "created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "system_logs_created_idx" ON "system_logs" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "system_logs_event_created_idx" ON "system_logs" USING btree ("event", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "system_logs_level_created_idx" ON "system_logs" USING btree ("level", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "system_logs_category_created_idx" ON "system_logs" USING btree ("category", "created_at");
