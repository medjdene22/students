import * as z from "zod";

export const LoginSchema = z.object({
    id: z.union([
    z.string().trim().email("Please enter a valid email address"),
    z.string().trim().min(3, "Username must be at least 3 characters")
    ]),

    password: z.string().min(1, "password is required"),
})
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export enum Role {
    ADMIN = "admin",
    USER = "user",
    STUDENT = "student",
    TEACHER = "teacher"
}