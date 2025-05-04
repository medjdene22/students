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
// export const EventEnum = pgEnum("event", ["absence", "absence_justificated", "participation", "absence_test", "absence_test_justificated", "absence_exam", "absence_exam_justificated"]);

export enum Events {
  ABSENCE = "absence",
  PARTICIPATION = "participation",
  ABSENCE_JUSTIFIED = "absence_justified",
  TEST = "absence_test",
  TEST_JUSTIFICATION = "absence_test_justified",
  EXAM = "absence_exam",
  EXAM_JUSTIFICATION = "absence_exam_justified",

}

export enum JustificationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}
export enum JustificationType {
    SESSION = "session",
    TEST = "test",
}

export enum JustificationEvent {
    ABSENCE = "absence",
    ABSENCE_JUSTIFIED = "absence-justified",
}
export interface Justification {
    type: JustificationType;
    eventId: number;
    event: JustificationEvent;
    eventDate: string;
    justificationId: number;
    assessment: string;
    status: JustificationStatus;
    submitDate: string;
    verificationDate: string | null;
  }



export const verifySchema = z.object({
  reason: z.string().optional(),
});  