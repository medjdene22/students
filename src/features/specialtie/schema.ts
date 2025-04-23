import { z } from "zod";
import { YEAR } from "../student-group/schema";

export enum CYCLE {
    license = "license",
    master = "master",
    engineer = "engineer",
    PhD = "PhD",
}

export const createSpecialtieSchema = z.object({
    name: z.string().trim().min(1, "name is required"),
    cycle: z.nativeEnum(CYCLE, { required_error: "cycle is required" }),
});

export const addSubjectSchema = z.object({
    subjectId: z.string().min(1, "Please select a subject"),
    year: z.nativeEnum(YEAR, { required_error: "year is required" }),
})