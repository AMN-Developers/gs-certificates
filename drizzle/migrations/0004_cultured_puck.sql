CREATE TYPE "public"."certificate_type" AS ENUM('higienizacao', 'impermeabilizacao');--> statement-breakpoint
ALTER TABLE "certificate_tokens" RENAME TO "token_balance";--> statement-breakpoint
ALTER TABLE "token_balance" DROP CONSTRAINT "certificate_tokens_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "token_balance" ADD COLUMN "type" "certificate_type" DEFAULT 'higienizacao' NOT NULL;--> statement-breakpoint
ALTER TABLE "token_balance" ADD COLUMN "balance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "certificate" ADD COLUMN "type" "certificate_type" DEFAULT 'higienizacao' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "token_balance" ADD CONSTRAINT "token_balance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "token_balance" DROP COLUMN IF EXISTS "higienizacao";--> statement-breakpoint
ALTER TABLE "token_balance" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "token_balance" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "certificateTokenId";--> statement-breakpoint
ALTER TABLE "token_balance" ADD CONSTRAINT "token_balance_user_id_type_unique" UNIQUE("user_id","type");