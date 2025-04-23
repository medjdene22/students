ALTER TABLE "assessment_test" RENAME COLUMN "event_date" TO "test_date";--> statement-breakpoint
ALTER TABLE "assessment_test" ADD COLUMN "replacement_date" date;