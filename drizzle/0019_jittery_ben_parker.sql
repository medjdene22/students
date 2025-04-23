ALTER TABLE "assessment_exam" RENAME TO "assessment_test";--> statement-breakpoint
ALTER TABLE "assessment_test" DROP CONSTRAINT "assessment_exam_assessment_id_teacher_assignment_id_fk";
--> statement-breakpoint
ALTER TABLE "assessment_test" ADD CONSTRAINT "assessment_test_assessment_id_teacher_assignment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."teacher_assignment"("id") ON DELETE cascade ON UPDATE no action;