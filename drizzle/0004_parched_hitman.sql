CREATE TYPE "public"."teacher_grade" AS ENUM('mcb', 'mca', 'professor', 'substitute');--> statement-breakpoint
CREATE TABLE "teacher_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"grade" "teacher_grade" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teacher_info" ADD CONSTRAINT "teacher_info_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;