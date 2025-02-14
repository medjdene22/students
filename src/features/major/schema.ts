import { z } from "zod";


export const createMajorSchema = z.object({
    name: z.string().trim().min(1, "name is required"),

});