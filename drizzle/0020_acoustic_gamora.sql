CREATE TABLE "assessment_test_event" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"assessment_test_id" integer NOT NULL,
	"event" "event" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_test_event" ADD CONSTRAINT "assessment_test_event_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_test_event" ADD CONSTRAINT "assessment_test_event_assessment_test_id_assessment_test_id_fk" FOREIGN KEY ("assessment_test_id") REFERENCES "public"."assessment_test"("id") ON DELETE cascade ON UPDATE no action;