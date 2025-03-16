ALTER TABLE "student_info" DROP CONSTRAINT "student_info_group_id_student_group_id_fk";
--> statement-breakpoint
ALTER TABLE "student_info" ALTER COLUMN "group_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "student_info" ADD CONSTRAINT "student_info_group_id_student_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."student_group"("id") ON DELETE set null ON UPDATE no action;