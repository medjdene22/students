import { z } from "zod";

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
