ALTER TABLE "subject_group" DROP CONSTRAINT "subject_group_group_id_student_group_id_fk";
--> statement-breakpoint
ALTER TABLE "subject_group" DROP CONSTRAINT "subject_group_subject_id_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "subject_group" ADD CONSTRAINT "subject_group_group_id_student_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."student_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_group" ADD CONSTRAINT "subject_group_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;