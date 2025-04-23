ALTER TABLE "student_subject" DROP CONSTRAINT "student_subject_student_id_student_info_id_fk";
--> statement-breakpoint
ALTER TABLE "student_subject" ALTER COLUMN "student_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;