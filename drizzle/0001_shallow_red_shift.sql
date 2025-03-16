CREATE TABLE "student_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"group_id" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_group_id_student_group_id_fk";
--> statement-breakpoint
ALTER TABLE "student_info" ADD CONSTRAINT "student_info_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_info" ADD CONSTRAINT "student_info_group_id_student_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."student_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "group_id";