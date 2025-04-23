import { z } from "zod";


export const testSchema = z.object({
  name: z.string(),
  testDate: z.date(), // Change to date type since Calendar returns Date objects
  replacementDate: z.date().nullish() // Change to date type since Calendar returns Date objects
});