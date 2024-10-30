ALTER TABLE "certificate_tokens" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificate_tokens" ADD CONSTRAINT "certificate_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
