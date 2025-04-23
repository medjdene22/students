ALTER TABLE "teacher_assignment" DROP CONSTRAINT "teacher_assignment_teacher_teacher_info_id_fk";
--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD COLUMN "teacher_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignment" DROP COLUMN "teacher";