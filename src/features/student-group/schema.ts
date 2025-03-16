import { z } from "zod";


export enum SECTION {
    section1 = "section1",
    section2 = "section2",
    section3 = "section3",
    section4 = "section4",
    section5 = "section5",
}

export enum CYCLE {
    license = "license",
    master = "master",
    engineer = "engineer",
    PhD = "PhD",
}

export enum YEAR {
    first = "first",
    second = "second",
    third = "third",
    fourth = "fourth",
    fifth = "fifth",
}


export const createGroupSchima = z.object({
    name: z.string().trim().min(1, "group name is required"),
    specialtyId: z.string().trim().min(1, "specialty id is required"),
    section: z.nativeEnum(SECTION, { required_error: "section is required" }),
    year: z.nativeEnum(YEAR, { required_error: "year is required" }),

});

