CREATE TYPE "public"."justification_type" AS ENUM('test', 'session');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "public"."assessment_test_event" ALTER COLUMN "event" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."student_subject_event" ALTER COLUMN "event" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."event";--> statement-breakpoint
CREATE TYPE "public"."event" AS ENUM('absence', 'absence_justified', 'participation', 'absence_test', 'absence_test_justified', 'absence_exam', 'absence_exam_justified');--> statement-breakpoint
ALTER TABLE "public"."assessment_test_event" ALTER COLUMN "event" SET DATA TYPE "public"."event" USING "event"::"public"."event";--> statement-breakpoint
ALTER TABLE "public"."student_subject_event" ALTER COLUMN "event" SET DATA TYPE "public"."event" USING "event"::"public"."event";