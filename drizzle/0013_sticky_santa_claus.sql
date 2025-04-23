CREATE TYPE "public"."event" AS ENUM('absence', 'absence_justificated', 'participation');--> statement-breakpoint
CREATE TABLE "student_subject" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"teacher_assignment_id" integer NOT NULL,
	"event" "event" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_student_id_student_info_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_info"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_teacher_assignment_id_teacher_assignment_id_fk" FOREIGN KEY ("teacher_assignment_id") REFERENCES "public"."teacher_assignment"("id") ON DELETE cascade ON UPDATE no action;