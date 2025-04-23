ALTER TYPE "public"."event" ADD VALUE 'absence_test';--> statement-breakpoint
ALTER TYPE "public"."event" ADD VALUE 'absence_test_justificated';--> statement-breakpoint
ALTER TYPE "public"."event" ADD VALUE 'absence_exam';--> statement-breakpoint
ALTER TYPE "public"."event" ADD VALUE 'absence_exam_justificated';--> statement-breakpoint
CREATE TABLE "assessment_exam" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"event_date" date NOT NULL,
	"assessment_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teacher_assignment" DROP CONSTRAINT "teacher_assignment_teacher_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "teacher_assignment" ALTER COLUMN "teacher_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessment_exam" ADD CONSTRAINT "assessment_exam_assessment_id_teacher_assignment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."teacher_assignment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;