import { z } from "zod";

export const createJustificationSchima = z.object({
    notes: z.string().optional(),
    image: z.union([
        z.instanceof(File),
        z.string()
    ]),
})