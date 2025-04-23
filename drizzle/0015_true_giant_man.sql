ALTER TABLE "student_subject" RENAME TO "student_subject_event";--> statement-breakpoint
ALTER TABLE "student_subject_event" DROP CONSTRAINT "student_subject_student_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "student_subject_event" DROP CONSTRAINT "student_subject_teacher_assignment_id_teacher_assignment_id_fk";
--> statement-breakpoint
ALTER TABLE "student_subject_event" ADD CONSTRAINT "student_subject_event_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_subject_event" ADD CONSTRAINT "student_subject_event_teacher_assignment_id_teacher_assignment_id_fk" FOREIGN KEY ("teacher_assignment_id") REFERENCES "public"."teacher_assignment"("id") ON DELETE cascade ON UPDATE no action;