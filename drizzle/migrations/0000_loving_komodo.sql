CREATE TABLE IF NOT EXISTS "certificate_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"higienizacao" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certificate" (
	"tokenHash" varchar(64) PRIMARY KEY NOT NULL,
	"encryptedData" varchar(1000) NOT NULL,
	"issuedAt" timestamp(3) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY NOT NULL,
	"certificateTokenId" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3) DEFAULT now(),
	CONSTRAINT "user_certificateTokenId_unique" UNIQUE("certificateTokenId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificate" ADD CONSTRAINT "certificate_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
