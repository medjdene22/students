CREATE TABLE "specialty_subject" (
	"id" serial PRIMARY KEY NOT NULL,
	"specialty_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"year" "year" NOT NULL
);
--> statement-breakpoint
DROP TABLE "subject_group" CASCADE;--> statement-breakpoint
ALTER TABLE "specialty_subject" ADD CONSTRAINT "specialty_subject_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "specialty_subject" ADD CONSTRAINT "specialty_subject_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;