CREATE TABLE "absence_justification" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_event_id" integer,
	"test_event_id" integer,
	"justification_type" "justification_type" NOT NULL,
	"notes" text,
	"submit_date" date NOT NULL,
	"file_data" "bytea" NOT NULL,
	"file_type" text NOT NULL,
	"verification_date" date,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"reason" text
);
--> statement-breakpoint
ALTER TABLE "absence_justification" ADD CONSTRAINT "absence_justification_subject_event_id_student_subject_event_id_fk" FOREIGN KEY ("subject_event_id") REFERENCES "public"."student_subject_event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "absence_justification" ADD CONSTRAINT "absence_justification_test_event_id_assessment_test_event_id_fk" FOREIGN KEY ("test_event_id") REFERENCES "public"."assessment_test_event"("id") ON DELETE cascade ON UPDATE no action;