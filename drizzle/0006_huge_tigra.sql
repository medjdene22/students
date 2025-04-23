CREATE TYPE "public"."assessment_type" AS ENUM('exam', 'td', 'tp');--> statement-breakpoint
DROP TABLE "teacher_subject" CASCADE;--> statement-breakpoint
ALTER TABLE "teacher_subject_group" ADD COLUMN "assessment_type" "assessment_type"[] DEFAULT '{}' NOT NULL;