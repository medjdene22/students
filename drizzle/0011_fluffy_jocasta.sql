CREATE TABLE "teacher_assignment" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher" integer NOT NULL,
	"group_id" integer NOT NULL,
	"specialty_subject_id" integer NOT NULL,
	"assessment_type" "assessment_type" NOT NULL
);
--> statement-breakpoint
DROP TABLE if exists "teacher_subject_group" CASCADE;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_teacher_teacher_info_id_fk" FOREIGN KEY ("teacher") REFERENCES "public"."teacher_info"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_group_id_student_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."student_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_specialty_subject_id_specialty_subject_id_fk" FOREIGN KEY ("specialty_subject_id") REFERENCES "public"."specialty_subject"("id") ON DELETE cascade ON UPDATE no action;