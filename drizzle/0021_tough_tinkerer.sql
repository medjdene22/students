ALTER TABLE "assessment_test_event" ADD CONSTRAINT "assessment_test_event_unique" UNIQUE("student_id","assessment_test_id");--> statement-breakpoint
ALTER TABLE "public"."assessment_test_event" ALTER COLUMN "event" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."student_subject_event" ALTER COLUMN "event" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."event";--> statement-breakpoint
CREATE TYPE "public"."event" AS ENUM('absence', 'absence_justified', 'participation', 'absence_test', 'absence_test_justificated', 'absence_exam', 'absence_exam_justificated');--> statement-breakpoint
ALTER TABLE "public"."assessment_test_event" ALTER COLUMN "event" SET DATA TYPE "public"."event" USING "event"::"public"."event";--> statement-breakpoint
ALTER TABLE "public"."student_subject_event" ALTER COLUMN "event" SET DATA TYPE "public"."event" USING "event"::"public"."event";