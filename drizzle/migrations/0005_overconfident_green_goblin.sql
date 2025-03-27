CREATE TYPE "public"."products" AS ENUM('Impertudo', 'Safe', 'Safe Tech', 'Eco', 'Tech Block');--> statement-breakpoint
ALTER TABLE "certificate" ADD COLUMN "product" "products";