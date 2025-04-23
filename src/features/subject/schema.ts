import { z } from "zod";
import { YEAR } from "../student-group/schema";


export const createSubjectSchema = z.object({
    name: z.string().trim().min(1, "name is required"),

});

export const addSpecialtySchema = z.object({
    specialtyId: z.string().min(1, "Please select a specialty"),
    year: z.nativeEnum(YEAR, { required_error: "year is required" }),
})