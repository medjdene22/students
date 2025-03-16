ALTER TABLE "student_info" DROP CONSTRAINT "student_info_student_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "teacher_info" DROP CONSTRAINT "teacher_info_teacher_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "student_info" ADD CONSTRAINT "student_info_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_info" ADD CONSTRAINT "teacher_info_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;