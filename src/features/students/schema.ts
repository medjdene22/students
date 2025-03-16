import { z } from "zod";


export const createStudentSchima = z.object({
    name: z.string().trim().min(1, "name is required"),
    email: z.string().trim().email("email is invalid").min(1, "email is required"),
    username: z.string().trim().min(1, "username is required"),
    password: z.string().trim().min(6, "password is required"),
    groupId: z.coerce.number().nullable(),
});

export const editStudentSchema = z.object({
    name: z.string().trim().min(1, "name is required"),
    email: z.string().trim().email("email is invalid").min(1, "email is required"),
    username: z.string().trim().min(1, "username is required"),
    groupId: z.coerce.number().nullable(),
    changePassword: z.boolean().default(false),
    password: z.string().optional(),
}).refine((data) => {
    // If changing password, require password with min length
    if (data.changePassword) {
        return data.password && data.password.trim().length >= 6;
    }
    return true;
}, {
    message: "Password must be at least 6 characters long",
    path: ["password"]
});